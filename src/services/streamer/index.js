const google = require('googleapis');
const youtube = google.youtube('v3');
const ytdl = require('ytdl-core');

module.exports = app => {
	app.get('/stream', function(req, res) {
		
		if (!req.query.artist || !req.query.track) return res.json({message: "Provide an artist and a track name"});
		
		youtube.search.list({
			part: 'snippet',
			q: req.query.artist + ' - ' + req.query.track,
			auth: 'AIzaSyCFEUzxTKh-AmNI7RL1ZM616lYHyGlGVdw',
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
}