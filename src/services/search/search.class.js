const spotify = require('../spotify');

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  find (params) {
    return spotify.search(params.query.q, [
      'track',
      'album',
      'artist',
      'playlist'
    ], {
      // options
    })
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
