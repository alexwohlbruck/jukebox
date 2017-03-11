var express = require('express');
var router = express.Router();
var path = require('path');

router.use('/users', require('./user.routes'));
router.use('/search', require('./search.routes'));
router.use('/albums', require('./album.routes'));
router.use('/tracks', require('./track.routes'));

module.exports = router;