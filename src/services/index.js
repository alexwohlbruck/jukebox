const search = require('./search/search.service.js');
const album = require('./album/album.service.js');
const player = require('./player/player.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(search);
  app.configure(album);
  app.configure(player);
};
