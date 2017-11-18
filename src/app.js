const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');

const handler = require('feathers-errors/handler');
const notFound = require('feathers-errors/not-found');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');

const mongoose = require('./mongoose');

const app = feathers();

// Load app configuration
app.configure(configuration());
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', feathers.static(app.get('public')));


///////////////////////////////
// This all handles mp3 streams, there is no way to integrate using traditional feathers service (as
// far as I know), so this uses express to stream the track.
// TODO: Clean up and move to module

const SpotifyWebApi = require('spotify-web-api-node');
const google = require('googleapis');
const youtube = google.youtube('v3');
const ytdl = require('ytdl-core');

const spotify = new SpotifyWebApi({
  clientId: '8698eaf4a6254e5eb8cfa30333faef1f',
  clientSecret: '1912e260111249668f98ff1777a441cd',
  redirectUri: 'http://localhost:3030/api/auth/callback'
});

spotify.clientCredentialsGrant().then(function(data) {
	// expires in: data.body['expires_in']
	spotify.setAccessToken(data.body['access_token']);
}, function(err) {
	console.log('Something went wrong when retrieving an access token', err);
});


app.get('/mp3', function(req, res) {
	
	if (!req.query.artist || !req.query.track) return res.json({message: "Provide an artist and a track name"});
	
	youtube.search.list({
		part: 'snippet',
		q: req.query.artist + ' - ' + req.query.track,
		auth: 'AIzaSyCFEUzxTKh-AmNI7RL1ZM616lYHyGlGVdw',
		maxResults: 1,
		type: 'video'
	}, function(err, data) {
		if (err) return res.status(err.statusCode).json(err);
		if (data.items.length == 0) return res.status(404).json({message: "Couldn't find track"});
		
		var videoId = data.items[0].id.videoId;
		var url = 'https://www.youtube.com/watch?v='+videoId;
		
		var range = '0-';
		
		if (req.headers.range) {
			range = req.headers.range.replace(/bytes=/, "");
		}
		
		var audio = ytdl(url, {
			filter: 'audioonly',
			range: range
		});
		
		audio.on('response', function(data) {
			var totalSize = data.headers['content-length'];
			
			var parts = range.split("-");
			var partialstart = parts[0];
			var partialend = parts[1];
			
			var start = parseInt(partialstart, 10);
			var end = partialend ? parseInt(partialend, 10) : totalSize - 1;
			
			var chunkSize = (end - start) + 1;
			
			res.writeHead(200, {
				'Content-Type': 'audio/webm',
				'Content-Range': 'bytes ' + start + '-' + end + '/' + totalSize,
				'Content-Length': chunkSize,
				'Content-Disposition': 'inline; filename="'+req.query.track.replace(/[^a-zA-Z0-9 ]/g, "")+'.mp3"',
				'Accept-Ranges': 'bytes'
			});
		});
		
		audio.pipe(res);
	});
});

///////////////////////////////

///////////////////////////////////
// if (process.env.NODE_ENV === 'development') {
const webpack = require('webpack');
const webpackConfig = require('../webpack.config');
const compiler = webpack(webpackConfig);


// Webpack HMR
app.use(webpackDevMiddleware(compiler, {
  hot: true,
  reload: true,
  publicPath: webpackConfig.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));
// }
///////////////////////////////////

// Set up Plugins and providers
app.configure(hooks());
app.configure(mongoose);
app.configure(rest());
app.configure(socketio());

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// Set up our services (see `services/index.js`)
app.configure(services);
// Configure a middleware for 404s and the error handler
app.use(notFound());
app.use(handler());

app.hooks(appHooks);

module.exports = app;
