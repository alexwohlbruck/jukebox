var express = require('express');
var router = express.Router();
var spotify = require.main.require('./app/services/spotify');

router.get('/:albumId', (req, res) => {
    spotify.getAlbum(req.params.albumId)
        .then(data => {
            res.status(data.statusCode).json(data.body);
        }, err => {
            res.status(err.statusCode).json(err);
        });
});

router.get('/:albumId/tracks', (req, res) => {
	spotify.getAlbumTracks(req.params.albumId)
        .then(data => {
            res.status(data.statusCode).json(data.body);
        }, err => {
            res.status(err.statusCode).json(err);
        });
});

module.exports = router;