const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://jacky:jacky310@cluster0-5jjxe.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const app = express();
const router = express.Router();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var path = require('path');

// app.use(express.static('website'));
// app.use(express.static('website/js'));
// app.use('/website',express.static('images'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());

app.use(session({
  secret: 'csci3100',
  store: new MongoStore({url: 'mongodb+srv://jacky:jacky310@cluster0-5jjxe.gcp.mongodb.net/sessiondb?retryWrites=true&w=majority'}),
  cookie: { maxAge: 60 * 10000 },
  saveUninitialized: false,
  resave: false
}));

// Check MongoDB Connection
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB connection established');
});

// For Index page
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/website/index.html'));
});
app.use(express.static('website'));

app.post('/checkLogin', (req, res) => {
  var user = '';
  var isLogined = false;
  var userType = 'guest';
  if (!(req.session.user == undefined)){
    user = req.session.user;
    isLogined = true;
    userType = req.session.userType
  }
  res.send({user: user, isLogined: isLogined, userType: userType});
});

app.post('/logout', (req, res) => {
    req.session.destroy(function(err) {
        if(err){
            res.send("Logout Fail");
        }
        res.redirect('/');
    });
});


app.get('/search', (req, res) => {
  var data = req.query;
  console.log(data);
  client.connect(err => {
    console.log("Search Success!!!");
    res.send("SearchSuccess");
  });
});

// For Login page
const loginSignup = require('./routes/loginSignup');
app.use('/loginSignup', loginSignup);

// For Customer Signup page
const customerSignup = require('./routes/customerSignup');
app.use('/customerSignup', customerSignup);

// For Owner Signup page
const ownerSignup = require('./routes/ownerSignup');
app.use('/ownerSignup', ownerSignup);

const customer_info = require('./routes/customer_info');
app.use('/customer', customer_info);

const owner_info = require('./routes/owner_info');
app.use('/owner', owner_info);

const createPartyRoom = require('./routes/create_partyroom');
app.use('/create_partyroom', createPartyRoom);

// const owner_route = require('./routes/owner');
//
// app.use('/owners', owner_route);

app.listen(3000, () => {
  console.log("server is listening on port 3000");
});
