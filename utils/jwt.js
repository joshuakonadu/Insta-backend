let jwt = require('jsonwebtoken');
const User = require('../models/user').production;

function authenticate() {

    return (req, res, next) => {
        let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
        if(!token){
            return res.status(403).json({message: 'Auth token is not supplied'});
        }
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.split(' ')[1];
        } else{
            return res.status(403).json({message: 'Auth token wrong format'});
        }

        jwt.verify(token, 'secretNotReally', async (err, decoded) => {
            if (err) {
                return res.status(403).json({message: 'Token is not valid'});
            } 
            req.user = decoded;
            const userid = req.user.id;
            var select = '_id role username'
            select = select.trim()

            var user = await User.findById(userid, select).lean();
            if (!user) return res.status(417).json({message: "The user <"+userid+"> does not exist!"});

            req.user = user;
            
            const domainpath = req.path.split('/')[2]
            if (domainpath !== 'getnotifications') {
                User.findOneAndUpdate({_id :userid},  {'online' : true}).then(e => {})
            }

            next();
        });
    };
};

function isRole(role){
    const userRole = role;
    return (req, res, next) => {
        if (req.user.role !== userRole) return res.status(401).json({message: "You are not authorized for this action!"});
        next();
    }
}

module.exports = {
    authenticate,
    isRole,
}