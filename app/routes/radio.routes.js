var express = require('express');
var router = express.Router();
var spotify = require.main.require('./app/services/spotify');

router.get('/', function(req, res) {
	spotify.getRecommendations({
	    seed_artists: req.params.seed_artists || null,
		seed_genres: req.params.seed_genres || null,
		seed_tracks: req.params.seed_tracks || null
	}).then(function(data) {
	    return res.status(200).json(data);
	})
});

module.exports = router;