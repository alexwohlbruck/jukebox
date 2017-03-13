var express = require('express');
var router = express.Router();
var keys = require.main.require('./config/keys');
var spotify = require.main.require('./app/services/spotify');
var google = require('googleapis');
var youtube = google.youtube('v3');
var ytdl = require('ytdl-core');

router.get('/search', function(req, res) {

	spotify.searchTracks(req.query.q).then(function(data) {
		return res.status(200).json(data);
	}).catch(function(err) {
		console.log(err);
		return res.status(400).json(err);
	});

});

router.get('/mp3', function(req, res) {
	
	youtube.search.list({
		part: 'snippet',
		q: req.query.artist + ' - ' + req.query.track,
		auth: keys.google.apiKey,
		maxResults: 1,
		type: 'video'
	}, function(err, data) {
		if (err) return res.status(err.statusCode).json(err);
		if (data.items.length == 0) return res.status(404).json({message: "Couldn't find track"});
		
		var videoId = data.items[0].id.videoId;
		var url = 'https://www.youtube.com/watch?v='+videoId;
		
		var range = '0-';
		
		if (req.headers.range) {
			range = req.headers.range.replace(/bytes=/, "");
		}
		
		var audio = ytdl(url, {
			filter: 'audioonly',
			range: range
		});
		
		audio.on('response', function(data) {
			var totalSize = data.headers['content-length'];
			
			var parts = range.split("-");
			var partialstart = parts[0];
			var partialend = parts[1];
			
			var start = parseInt(partialstart, 10);
			var end = partialend ? parseInt(partialend, 10) : totalSize - 1;
			
			var chunkSize = (end - start) + 1;
			
			res.writeHead(206, {
				'Content-Type': 'audio/mpeg',
				'Content-Range': 'bytes ' + start + '-' + end + '/' + totalSize,
				'Content-Length': chunkSize,
				'Content-Disposition': 'inline; filename="music.mp3"',
				'Accept-Ranges': 'bytes'
			});
		});
		
		audio.pipe(res);
	});
});

module.exports = router;