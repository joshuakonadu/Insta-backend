
var jwt = require('../utils/jwt');
var authenticate = jwt.authenticate;
var isRole = jwt.isRole;
var cors = require('cors');
var UserCon = require('../controllers/usercon');


module.exports = app => {
    app.get('/api/test', UserCon.test);
    app.post('/api/register',UserCon.registerUser)
    app.post('/api/login',UserCon.loginUser)
    app.post('/api/change-avatar',authenticate(),UserCon.changeAvatar)
    app.get('/api/getUserData',authenticate(),UserCon.getUserData)
};