require('dotenv').config();
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var env = process.env.NODE_ENV;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressGeoIP = require('express-geoip');

global.Promise = require('bluebird');

require('dotenv').config()

if (env === 'development') {
	var morgan = require('morgan');
	app.use(morgan('dev'));
}

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(expressGeoIP('US').getCountryCodeMiddleware);
    
app.use('/api', require('./app/routes'));
app.use('/', express.static('public'));

require('./app/sockets')(io);

var port = process.env.PORT || 8080;
server.listen(port, function () {
  console.log('App listening on port '+port+'!');
});