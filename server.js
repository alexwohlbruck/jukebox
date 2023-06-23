require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressGeoIP = require('express-geoip');
const Promise = require('bluebird');

const env = process.env.NODE_ENV;

if (env === 'development') {
    const morgan = require('morgan');
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

const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log('App listening on port ' + port + '!');
});
