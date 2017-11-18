// Initializes the `album` service on path `/album`
const createService = require('./album.class.js');
const hooks = require('./album.hooks');
const filters = require('./album.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'album',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/album', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('album');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
