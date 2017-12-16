// Initializes the `player` service on path `/player`
const createService = require('feathers-mongoose');
const createModel = require('../../models/player.model');
const hooks = require('./player.hooks');
const filters = require('./player.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'player',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/player', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('player');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
