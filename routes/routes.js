
var jwt = require('../utils/jwt');
var authenticate = jwt.authenticate;
var UserCon = require('../controllers/usercon');
var ImageCon = require('../controllers/imagecon');

const express = require("express");

const imageDirectory = __dirname.replace("routes", "images");


module.exports = app => {
    app.post('/api/register',UserCon.registerUser)
    app.post('/api/login',UserCon.loginUser)
    app.post('/api/change-avatar',authenticate(),UserCon.changeAvatar)
    app.get('/api/getUserData',authenticate(),UserCon.getUserData)
    app.post('/api/uploadImages',authenticate(),ImageCon.uploadImages)
    app.get('/api/getUserImage/:id',ImageCon.getUserImage)
    app.post('/api/deleteImage',authenticate(),ImageCon.deleteImage)
    app.use('/api/static/images',express.static(imageDirectory))
};