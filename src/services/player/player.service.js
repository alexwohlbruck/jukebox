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

  const methods = {
    setQueue (id, {tracks, startIndex, context}, params) {

      // TODO: Get track data from spotify instead of from client

      if (context) {
        const {id, type} = context;
      }

      return Model.update({_id: id}, { $set: {
        queue: {
          tracks: tracks,
          context: context ? {id, type} : null,
          index: startIndex
        },
        playing: true,
        progress: 0,  
      }});
    },

    async plause (id, data, params) {
      const player = await Model.findById(id);

      player.set({playing: !player.playing});

      const { playing } = await player.save();

      // TODO: Get timecode at pause event and save to db
      return {
        playing
      };
    }
  }

  for (methodName in methods) {
    app.use('/player/' + methodName, {
      patch: methods[methodName]
    })
  }

  // Initialize our service with any options it requires
  app.use('/player', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('player');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
