
var jwt = require('../utils/jwt');
var authenticate = jwt.authenticate;
var isRole = jwt.isRole;
var cors = require('cors');
var UserCon = require('../controllers/usercon');


module.exports = app => {
    app.post('/api/register',UserCon.registerUser)
    app.post('/api/login',UserCon.loginUser)
    app.post('/api/change-avatar',authenticate(),UserCon.changeAvatar)
    app.get('/api/getUserData',authenticate(),UserCon.getUserData)
    app.post('/api/uploadImages',authenticate(),UserCon.uploadImages)
    app.get('/api/getUserImage/:id',UserCon.getUserImage)
    app.post('/api/deleteImage',authenticate(),UserCon.deleteImage)
};