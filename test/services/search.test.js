const assert = require('assert');
const app = require('../../src/app');

describe('\'search\' service', () => {
  it('registered the service', () => {
    const service = app.service('search');

    assert.ok(service, 'Registered the service');
  });
});
