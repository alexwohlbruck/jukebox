const assert = require('assert');
const app = require('../../src/app');

describe('\'album\' service', () => {
  it('registered the service', () => {
    const service = app.service('album');

    assert.ok(service, 'Registered the service');
  });
});
