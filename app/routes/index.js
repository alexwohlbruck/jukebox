var express = require('express');
var router = express.Router();
var path = require('path');

router.use('/users', require('./user.routes'));
router.use('/search', require('./search.routes'));
router.use('/albums', require('./album.routes'));
router.use('/artists', require('./artist.routes'));
router.use('/tracks', require('./track.routes'));
router.use('/radio', require('./radio.routes'));

module.exports = router;