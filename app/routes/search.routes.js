var express = require('express');
var router = express.Router();
var spotify = require.main.require('./app/services/spotify');

router.get('/', function(req, res) {
	spotify.search(
        req.query.q,
        ['track', 'album', 'artist', 'playlist'],
        {
            limit: req.query.limit || 30,
            offset: req.query.offset || 0
        }
    )
    .then(function(data) {
        res.status(200).json(data.body);
    }, function(err) {
        res.status(400).json(err);
    });
});

module.exports = router;