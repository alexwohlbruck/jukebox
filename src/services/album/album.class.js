const SpotifyWebApi = require('spotify-web-api-node');

const spotify = new SpotifyWebApi({
  clientId: '8698eaf4a6254e5eb8cfa30333faef1f',
  clientSecret: '1912e260111249668f98ff1777a441cd',
  redirectUri: 'http://localhost:3030/api/auth/callback'
});

spotify.clientCredentialsGrant().then(data => {
  spotify.setAccessToken(data.body['access_token']);
});

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  /*find (params) {
    return Promise.resolve([]);
  }*/

  get (id, params) {
    return spotify.getAlbum(id)
  }

  /*create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }*/
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
