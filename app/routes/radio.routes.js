var express = require('express');
var router = express.Router();
var spotify = require.main.require('./app/services/spotify');

router.get('/', function(req, res) {
    var seedArtists = req.query.seed_artists || null;
    var seedGenres = req.query.seed_genres || null;
    var seedTracks = req.query.seed_tracks || null;

    spotify.getRecommendations({
        seed_artists: seedArtists,
        seed_genres: seedGenres,
        seed_tracks: seedTracks
    })
    .then(function(data) {
        return res.status(200).json(data);
    })
    .catch(function(err) {
        return res.status(err.statusCode || 500).json(err);
    });
});

module.exports = router;
