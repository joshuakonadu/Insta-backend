const mongoose = require('mongoose');

// const uri = 'mongodb://'+process.env.DB_HOST+'/'+process.env.DB_NAME;
const uri = 'mongodb://localhost:27017/insta-backend?retryWrites=true';

// Default Mongooptions:
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    poolSize: 10, // the number of concurrent operations your Node.js connection can handle is limited by the poolSize
    connectWithNoPrimary: false,
};

const connection = mongoose.createConnection(uri, options);

// Notifications
connection.on('connected', function(){
    // console.log('Mongoose connected to Mongo database '+process.env.DB_NAME+' on Host: '+process.env.DB_HOST);
    console.log('Mongoose connected to Mongo database insta-backend on Host: '+uri);
});

connection.on('disconnected', function (error) {
    console.log('Mongoose connection disconnectd on database insta-backend on Host: '+uri);
});

connection.on('reconnect', function (ref) {
    console.log('reconnect to mongo server.');
});

connection.on('error', function (err) {
    console.log('error connection to mongo server!');
});

module.exports = connection;