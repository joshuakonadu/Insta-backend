
var jwt = require('../utils/jwt');
var authenticate = jwt.authenticate;
var isRole = jwt.isRole;
var cors = require('cors');
var UserCon = require('../controllers/usercon');


module.exports = app => {
    app.get('/api/test', UserCon.test);
    app.post('/register',UserCon.registerUser)
    app.post('/login',UserCon.loginUser)
    app.get('getUserData',authenticate(),UserCon.getUserData)
};