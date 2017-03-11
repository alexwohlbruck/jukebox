var express = require('express');
var router = express.Router();
var spotify = require.main.require('./app/services/spotify');

router.get('/:albumID/tracks', function(req, res) {
	spotify.getAlbumTracks(req.params.albumID)
        .then(function(data) {
            res.status(200).json(data.body);
        }, function(err) {
            res.status(400).json(err);
        });
});

module.exports = router;