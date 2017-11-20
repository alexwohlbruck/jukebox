const SpotifyWebApi = require('spotify-web-api-node');

const spotify = new SpotifyWebApi({
  clientId: '8698eaf4a6254e5eb8cfa30333faef1f',
  clientSecret: '1912e260111249668f98ff1777a441cd',
  redirectUri: 'http://localhost:3030/api/auth/callback'
});

spotify.clientCredentialsGrant().then(data => {
  spotify.setAccessToken(data.body['access_token']);
});

module.exports = spotify;