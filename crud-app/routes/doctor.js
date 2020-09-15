"use strict"
require('dotenv').config();
const express = require("express");
let router = express.Router();
const fs = require('fs');
const db = require('../db');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

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
    let message = "";
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let position = req.body.position;
    let specialty = req.body.specialty;
    let username = req.body.username;

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
      console.log(results);
      res.redirect('/');

    // }
  });

  router
    .route('/edit/:id')
    .get(async (req, res) => {
      let d_id = req.params.id;
      
      let doctor_result = await db.one(d_id);

      res.render('edit-doctor.ejs', {
        title: "Edit Player",
        doctor: doctor_result,
        message: ''
      });
    })
    .post(async (req, res) => {
      let d_id = req.params.id;
      let first_name = req.body.first_name;
      let last_name = req.body.last_name;
      let position = req.body.position;
      let specialty = req.body.specialty;

      let result = await db.edit(d_id, first_name, last_name, position, specialty);

      res.redirect('/');
    });

router
    .route('/delete/:id')
    .get(async (req, res) => {
      let d_id = req.params.id;

      let deleted = await db.delete(d_id);

      res.redirect('/');
    });

function authenticateToken(req, res, next) { //validates token generated
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(token == null) {
    return res.sendStatus(401); //no access
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err) return res.sendStatus(403); //invalid token
    req.user = user;
    next();
  })
}

  module.exports = router;