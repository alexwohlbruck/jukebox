require('dotenv').config();
var express = require('express');
var app = express();
var env = process.env.NODE_ENV;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

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
    
app.use('/api', require('./app/routes'));
app.use('/', express.static('public'));

var port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log('App listening on port '+port+'!');
})