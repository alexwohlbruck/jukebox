var spotify = require.main.require('./app/services/spotify');
var keys = require.main.require('./config/keys');
var google = require('googleapis');
var youtube = google.youtube('v3');
var ytdl = require('ytdl-core');
var express = require('express');
var router = express.Router();

router.get('/search', function(req, res) {

	spotify.searchTracks(req.query.q).then(function(data) {
		return res.status(200).json(data);
	}).catch(function(err) {
		console.log(err);
		return res.status(400).json(err);
	});

});

router.get('/music', function(req, res) {

	youtube.search.list({
		part: 'snippet',
		q: req.query.artist + ' - ' + req.query.track,
		auth: keys.google.apiKey,
		maxResults: 1,
		type: 'video'
	}, function(err, data) {
		if (err) return res.status(err.statusCode).json(err);

		var videoId = data.items[0].id.videoId;
		
		var url = 'https://www.youtube.com/watch?v='+videoId;

		var video = ytdl(url, {
			filter: 'audioonly'
		});

		res.set({'Content-Type': 'audio/mpeg'});

		video.pipe(res);
	});
});

router.get('/users/:user/playlists/:playlistId', function(req, res) {
	spotify.getPlaylist(req.params.user, req.params.playlistId)
	  .then(function(data) {
	  	res.status(200).json(data.body);
	  }, function(err) {
	    res.status(400).json(err);
	  });
});

module.exports = router;