var express = require('express');
var router = express.Router();
var keys = require.main.require('./config/keys');
var spotify = require.main.require('./app/services/spotify');
var google = require('googleapis');
var youtube = google.youtube('v3');
var ytdl = require('ytdl-core');
var request = require('request-promise');
var cheerio = require('cheerio');

router.get('/search', function(req, res) {

	spotify.searchTracks(req.query.q).then(function(data) {
		return res.status(200).json(data);
	}).catch(function(err) {
		console.log(err);
		return res.status(400).json(err);
	});

});

router.get('/mp3', function(req, res) {
	
	if (!req.query.artist || !req.query.track) return res.json({message: "Provide an artist and a track name"});
	
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
			
			res.writeHead(200, {
				'Content-Type': 'audio/webm',
				'Content-Range': 'bytes ' + start + '-' + end + '/' + totalSize,
				'Content-Length': chunkSize,
				'Content-Disposition': 'inline; filename="'+req.query.track.replace(/[^a-zA-Z0-9 ]/g, "")+'.mp3"',
				'Accept-Ranges': 'bytes'
			});
		});
		
		audio.pipe(res);
	});
});

// Get lyics for a song
var metrolyrics = {
	base: 'http://www.metrolyrics.com/',
	formatString: function(string) {
		return string
			.split(" - feat.")[0].split(" - ft.")[0] // Remove artist feature tag*/
			.replace(/ *\([^)]*\) */g, "") // Remove text in parenthesis
			.replace(/[^a-zA-Z0-9 ]/g, "") // Remove non alpha chars
			.toLowerCase()
			.split(' ')
			.join('-');
	},
	getUrl: function(track) {
		return this.base + this.formatString(track.name) + '-lyrics-' + this.formatString(track.artists[0].name) + '.html';
	},
	messages: {
		notFound: "No lyrics available"
	}
};
router.get('/lyrics', function(req, res) {
	if (!req.query.track_id) return res.status(404).json({message: "No track id given"});
	
	var response = {};
    
    spotify.getTrack(req.query.track_id).then(function(data) {
    	var url = response.url = metrolyrics.getUrl(data.body);
    	
    	return request(url);
    })
    .then(function(html) {
	    var $ = cheerio.load(html);
	    
	    var lyrics = response.lyrics = $('#lyrics-body-text .verse').map(function(i, el) {
			return $(this).text();
		}).get().join('\n\n').trim();
	    
	    if (lyrics == '')
	    	return res.status(404).json({message: metrolyrics.messages.notFound});
	    
	    return res.status(200).json(response);
    })
    .catch(function(err) {
    	if (err.statusCode == 404) {
    		// These results are a big mess (It's html for the 404 page)
    		err.error = undefined;
    		err.message = metrolyrics.messages.notFound;
    		err.response.body = undefined;
    	}
    	return res.status(err.statusCode || 400).json(err);
    });
});

module.exports = router;