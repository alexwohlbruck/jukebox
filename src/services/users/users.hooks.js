const { authenticate } = require('feathers-authentication').hooks;
const commonHooks = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');

const { hashPassword } = require('feathers-authentication-local').hooks;
const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: '_id',
    ownerField: '_id'
  })
];

function buildProfile() {
  return function(hook) {
    if (hook.data.spotify) {
      const { accessToken, refreshToken } = hook.data.spotify;
      const user = hook.data.spotify.profile;

      console.log(hook.data.spotify.profile.emails)

      hook.data = {
        username: user.username, // potential conflict w/ unique usernames
        email: user.emails[0].value,
        photo: user.photos[0],
        spotify: {
          accessToken,
          refreshToken,
          profileUrl: user.profileUrl,
        }
      }
    }

    return Promise.resolve(hook);
  }
}

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ ...restrict ],
    create: [ hashPassword(), buildProfile() ],
    update: [ ...restrict, hashPassword(), buildProfile() ],
    patch: [ ...restrict, hashPassword() ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      commonHooks.when(
        hook => hook.params.provider,
        commonHooks.discard('password')
      )
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
