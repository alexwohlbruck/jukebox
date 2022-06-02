var express = require('express');
var router = express.Router();
var spotify = require.main.require('./app/services/spotify');

router.get('/:artistId/top-tracks', function(req, res) {
	spotify.getArtistTopTracks(req.params.artistId, req.countryCode)
        .then(function(data) {
            res.status(data.statusCode).json(data.body);
        }, function(err) {
            res.status(err.statusCode).json(err);
        });
});

module.exports = router;