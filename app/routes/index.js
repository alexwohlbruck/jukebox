var express = require('express');
var router = express.Router();
var path = require('path');

router.use('/tracks', require('./track.routes'));

module.exports = router;