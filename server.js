var express = require('express');
var app = express();
var env = process.env.NODE_ENV;

if (env === 'development') {
	var morgan = require('morgan');
	app.use(morgan('dev'));
}

require('./app/routes')(express, app);

var port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log('Example app listening on port '+port+'!');
})