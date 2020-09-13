// set up ======================================================================

// get all the tools we need
var fs          = require('fs');
var path        = require('path');
var express     = require('express');
var bodyParser  = require('body-parser');
var logger      = require('morgan');
var cors        = require('cors');
var helmet      = require('helmet');
require('dotenv').config();

const app = express();
const port = 5000;

// configuration ===============================================================

app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
app.use(bodyParser.json({ limit: '500mb' }));


// enable CORS Request to support vue
// needs further configuration to only let our domains make requests

app.use(cors())
app.options('*', cors())

// require the database library (which instantiates a connection)
require('./config/db');


const User = require('./models/user');


//security ====================================================================
app.use(helmet())

app.set('strict routing', true);

// helpers ====================================================================

// if (app.get('env').toLowerCase() === 'production') {
//   app.use(logger('combined'));
// } else {
//   app.use(logger('dev'));
// }

// template engine ====================================================================

// view engine setup
app.set('views', path.join(__dirname, '/mailtemplates'));
app.set('view engine', 'hbs');

// Handlebars default config
const hbs = require('hbs');

// routes ======================================================================

// dynamically include all routes and pass the APP context to the route for binding
fs.readdirSync(path.join(__dirname, 'routes')).map(file => {
  require('./routes/' + file)(app);
});

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

// launch ======================================================================

var server = app.listen(port);

// increase the timeout to 4 minutes
server.timeout = 440000;
console.log('RESTful API server dd-VueBackend started on: ' + port);

// The keyword require returns an object, which references the value of module.exports for a given file
module.exports.app = app;
module.exports.server = server;

process.on('SIGINT', function() {
  server.close(function(err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
    
  });
});