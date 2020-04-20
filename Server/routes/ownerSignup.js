var express = require('express');
var router = express.Router();

const uploadController = require("./uploadPhoto");

// MongoDB & mongoose:
const mongo = require('mongodb')
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://jacky:jacky310@cluster0-5jjxe.gcp.mongodb.net/PartyRoomBooking?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var fs = require('fs');

const conn = mongoose.createConnection(uri);
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('photos');
});

// Other packages:
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

router.get('/', function (req, res) {
  res.sendFile('ownerSignup.html', { 'root': "./website" });
});

router.post('/signup', (req, res) => {
  var data = req.body;
  console.log(data);
  const saltRounds = 10;
  bcrypt.hash(data.password, saltRounds).then(function (hash) {
    data.password = hash;
    client.connect(err => {
      const collection = client.db("PartyRoomBooking").collection("owner");
      collection.insertOne(data, (err) => {
        if (err) throw err;
        console.log("Owner Signup Success!!!");
        res.send("SignupSuccess");
      });
      // return res.redirect('/');
    });
  });
});

router.post('/uploadPhoto',  uploadController.uploadFile);

router.post('/downloadPhoto', (req, res) =>{
  // client.connect(err => {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        });
      }

      files.forEach((file, i) => {
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
          // Read output to browser
          const readstream = gfs.createReadStream(file.filename);
          readstream.pipe(res);
        } else {
          res.status(404).json({
            err: 'Not an image'
          });
        }
      });

      // Files exist
      // return res.json(files);
    });
  // });
});

  // gfs.files.find({}).toArray(function (err, files) {
  //   if (err) {
  //     res.json(err);
  //   }
  //   if (files.length > 0) {
  //     var mime = files[0].contentType;
  //     var filename = files[0].filename;
  //     res.set('Content-Type', mime);
  //     res.set('Content-Disposition', "inline; filename=" + filename);
  //     var read_stream = gfs.createReadStream({_id: file_id});
  //     read_stream.pipe(res);
  //   } else {
  //     res.json('File Not Found');
  //   }
  // });
// });

module.exports = router;
