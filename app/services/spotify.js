var SpotifyWebApi = require('spotify-web-api-node');
var keys = require.main.require('./config/keys');

var spotify = new SpotifyWebApi({
  clientId: keys.spotify.clientId,
  clientSecret: keys.spotify.clientSecret,
  redirectUri: keys.spotify.redirectUri
});

spotify.clientCredentialsGrant().then(function(data) {
	// expires in: data.body['expires_in']
	spotify.setAccessToken(data.body['access_token']);
}, function(err) {
	console.log('Something went wrong when retrieving an access token', err);
});

module.exports = spotify;