"use strict"
const express = require("express");
let router = express.Router();
const fs = require('fs');
const db = require('../db');
const multer = require('multer');
const path = require('path');

router.use('/uploads', express.static(path.join(__dirname, '/uploads')));

router.use(function (req, res, next) {
  console.log(req.url, "@", Date.now());
  next();
});

//variable for image upload
let imageUpload;

//multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
      imageUpload = file.originalname;
      cb(null, file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
      cb(null, true);
  } else {
      cb(null, false);
  }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

router
  .route('/add')
  .post(upload.single("image"), async (req, res, next) => {
    console.log(req.body);
    let message = "";
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let position = req.body.position;
    let specialty = req.body.specialty;
    let username = req.body.username;
    console.log(imageUpload);

    //let user = db.find(username);

    // if(user) {
    //   message = 'User already exists';
    //   res.render('add-doctor.ejs', {
    //     title: "Welcome to Seattle Grace", 
    //     message: ""
    //   });
    // } else {

      //add doctor to db
      let results = await db.add(first_name, last_name, position, specialty, imageUpload, username);

      if(results) {
        //res.redirect('/');
        res.send('Added');
      }
    // }
  });

  module.exports = router;