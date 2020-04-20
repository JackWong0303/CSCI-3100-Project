var express = require('express');
//let PartyRoom = require('../models/partyroom.model');
var router = express.Router();

// MongoDB & mongoose:
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://jacky:jacky310@cluster0-5jjxe.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const mongoose = require('mongoose');

// Other packages:
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

router.get('/', function (req, res) {
    res.sendFile('partyroom_create.html', { 'root': "./website" });
});

router.route('/create').post((req, res) => {
    var data = req.body;
    console.log(data);
    client.connect(err => {
        const collection = client.db("PartyRoomBooking").collection("PartyRoom");
        collection.insertOne(data, (err) => {
            if (err) throw err;
            console.log("PartyRoom create Success!!!");
            res.send("CreateSuccess");
            res.redirect('/');
        });
         //return res.redirect('/');
    });
});

module.exports = router;
