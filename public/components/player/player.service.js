/* global angular */
var app = angular.module('jukebox');

app.service('Player', ['$rootScope', 'Socket', '$http', '$mdToast', function($rootScope, Socket, $http, $mdToast) {
	var Player = this;
	
	this.el = document.getElementById('song');
	
	this.queue = {
		nowPlaying: {
			index: 0
		}
	};
	
	this.latency = 100;
	this.maxLatency = 250;
	
	var pingTime, pongTime, latency, showedSlowConnectionToast = false;
	
	// Ping each client to test connection speed
    setInterval(function() {
        pingTime = new Date();
        Socket.emit('connection:ping');
    }, (5 * 1000));
    
	// Recieve pong and save response time
	Socket.on('connection:pong', function() {
        pongTime = new Date();
    	Player.latency = latency = (pongTime - pingTime) / 2;
        
        if (latency > 1000 && !showedSlowConnectionToast) {
			$mdToast.show($mdToast.simple().textContent('Connection too slow for synced music'));
			showedSlowConnectionToast = true;
        }
    });
	
	this.setQueue = function(newQueue) {
		var promise;
		this.queue = Object.assign(this.queue, newQueue);
		
		switch (newQueue.source.type) {
			case 'album':
				promise = $http.get('/api/albums/'+newQueue.source.id+'/tracks');
				break;
			case 'playlist':
				promise = $http.get('/api/users/'+newQueue.source.owner.id+'/playlists/'+newQueue.source.id+'/tracks');
				break;
			case 'artist':
				promise = $http.get('/api/artists/'+newQueue.source.id+'/top-tracks');
				break;
			default:
				console.log('no case selected');
		}
		
		promise.then(function(response) {
			Player.queue = newQueue;
			switch (newQueue.source.type) {
				case 'playlist':
					Player.queue.tracks = response.data.items.map(o => o.track);
					break;
				case 'album':
					Player.queue.tracks = response.data.items;
				case 'artist':
					break;
				default:
					Player.queue.tracks = response.data.tracks;
					break;
			}
			Player.playTrack(Player.queue.tracks[0]);
		});
	};
	
	Socket.on('queue:set', function(newQueue) {
		Player.setQueue(newQueue);
	});
	
	this.plause = function() {
		Socket.emit(Player.el.paused ? 'playback:play' : 'playback:pause');
	};
	
	Socket.on('playback:play', function() {
		setTimeout(function() {
			Player.el.play();
		}, (Player.maxLatency - Player.latency));
	});
	
	Socket.on('playback:pause', function() {
		setTimeout(function() {
			Player.el.pause();
		}, (Player.maxLatency - Player.latency));
	});
	
	
	this.playTrack = function(track) {
		// Infinite recursion on multiclient playback -- fix this!
		Socket.emit('track:play', {track: track});
		
		var artistName = track.artists[0].name,
			trackName = track.name;
		
		Player.queue.nowPlaying.streamUrl = '/api/tracks/mp3?artist='+artistName+'&track='+trackName;
	};
	
	Socket.on('track:play', function(data) {
		Player.playTrack(data.track);
	});
	
	
	this.playTrackFromIndex = function(index) {
		Socket.emit('track:play.index', {index: index});
		
		Player.queue.nowPlaying.index = index;
		Player.playTrack(Player.queue.tracks[index]);
	};
	
	Socket.on('track:play.index', function(data) {
		Player.playTrackFromIndex(data.index);
	});
	
	
	this.skipTrack = function() {
		Socket.emit('track:ended');
		
		Player.queue.nowPlaying.index++;
	    Player.playTrackFromIndex(Player.queue.nowPlaying.index);
	};
	
	Player.el.addEventListener('canplay', function() {
		Socket.emit('playback:canplay');
	})
	
	Socket.on('playback:ended', function() {
		Player.el.skipTrack();
	});
}]);