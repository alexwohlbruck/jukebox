var express = require('express');
var router = express.Router();
var spotify = require.main.require('./app/services/spotify');

router.get('/:user/playlists/:playlistID', function(req, res) {
	spotify.getPlaylist(req.params.user, req.params.playlistID)
	  .then(function(data) {
	  	res.status(200).json(data.body);
	  }, function(err) {
	    res.status(400).json(err);
	  });
});

router.get('/:user/playlists/:playlistID/tracks', function(req, res) {
	spotify.getPlaylistTracks(req.params.user, req.params.playlistID)
	  .then(function(data) {
	  	res.status(200).json(data.body);
	  }, function(err) {
	    res.status(400).json(err);
	  });
});

module.exports = router;