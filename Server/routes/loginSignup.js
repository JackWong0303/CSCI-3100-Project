var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://jacky:jacky310@cluster0-5jjxe.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const mongoose = require('mongoose');

const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

router.get('/', function (req, res) {
  res.sendFile('loginSignup.html', { 'root': "./website" });
});

router.post('/login', (req, res) => {
  var data = req.body;
  console.log(req.body);
  client.connect(err => {
    if (data.userType == "customer"){
      const cusColl = client.db("PartyRoomBooking").collection("customer");
      cusColl.findOne({username:  data.username},  {password: 1}, (err, customer) => {
        // Check whether the username exist
        if (customer == null){
          res.send("Username Not Found");
        }
        else {
          // Check whether the password correct
          bcrypt.compare(data.password, customer.password, (err, result) => {
            if(result == true) {
              req.session.regenerate(function(err) {
                if(err){
                  res.send("Login Fail");
                }
                req.session.user = data.username;
                req.session.userType = data.userType;
                res.send("CustomerLoginSuccess");
              });
            }
            else {
              res.send("Password Not Correct");
            }
          });
        }
      });
    }
    else if (data.userType == "owner"){
      const ownerColl = client.db("PartyRoomBooking").collection("owner");
      ownerColl.findOne({username:  data.username},  {password: 1}, (err, owner) => {
        // Check whether the username exist
        if (owner == null){
          res.send("Username Not Found");
        }
        else {
          // Check whether the password correct
          bcrypt.compare(data.password, owner.password, (err, result) => {
            if(result == true) {
              req.session.regenerate(function(err) {
                if(err){
                  res.send("Login Fail");
                }
                req.session.user = data.username;
                req.session.userType = data.userType;
                res.send("OwnerLoginSuccess");
              });
            }
            else {
              res.send("Password Not Correct");
            }
          });
        }
      });
    }
    // const cusColl = client.db("PartyRoomBooking").connection("customer");
    // const ownerColl = client.db("PartyRoomBooking").connection("owner");
    // cusColl.findOne({})


    // console.log(data.userType, data.username, "Login Success!!!");
    // if (data.userType == "customer")
    //   res.send("CustomerLoginSuccess");
    // else if (data.userType == "owner")
    //   res.send("OwnerLoginSuccess");
  });
});

module.exports = router;
