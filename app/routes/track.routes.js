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
		if (err) return res.status(err.statusCode || 500).json(err);
		if (!data.items || data.items.length == 0) return res.status(404).json({message: "Couldn't find track"});

		var videoId = data.items[0].id.videoId;
		var url = 'https://www.youtube.com/watch?v='+videoId;

		// ytdl-core v4 wants {start, end}, not the raw header string -- a string
		// is silently ignored, so we'd stream the whole file while advertising a
		// short Content-Length and the client would hang up mid-write.
		var isPartial = false;
		var start = 0;
		var end;

		if (req.headers.range) {
			var parts = req.headers.range.replace(/bytes=/, "").split("-");
			var parsedStart = parseInt(parts[0], 10);
			var parsedEnd = parseInt(parts[1], 10);

			if (!isNaN(parsedStart)) {
				isPartial = true;
				start = parsedStart;
				if (!isNaN(parsedEnd)) end = parsedEnd;
			}
		}

		var audio = ytdl(url, {
			filter: 'audioonly',
			range: end === undefined ? {start: start} : {start: start, end: end}
		});

		// The client bailing out (seek, skip, tab close) is routine, not an error.
		// Without this the pipe keeps writing into a dead socket and the EPIPE
		// takes the whole process down.
		var closed = false;
		function cleanup() {
			if (closed) return;
			closed = true;
			audio.destroy();
		}

		req.on('aborted', cleanup);
		res.on('close', cleanup);
		res.on('error', cleanup);

		audio.on('error', function(err) {
			console.log('ytdl failed for ' + url + ': ' + err.message);
			cleanup();
			if (res.headersSent) return res.destroy();
			return res.status(502).json({message: "Couldn't stream track"});
		});

		audio.on('response', function(data) {
			if (closed || res.headersSent) return;

			var totalSize = parseInt(data.headers['content-length'], 10);
			var lastByte = end === undefined ? start + totalSize - 1 : end;

			res.writeHead(isPartial ? 206 : 200, {
				'Content-Type': 'audio/webm',
				'Content-Range': 'bytes ' + start + '-' + lastByte + '/' + (start + totalSize),
				'Content-Length': totalSize,
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