/* global angular */
var app = angular.module('jukebox');

app.service('Player', ['$rootScope', 'Socket', '$http', '$mdToast', function($rootScope, Socket, $http, $mdToast) {
	var Player = this;
	
	this.el = document.getElementById('song');
	
	this.pinnedQueue = true;
	
	this.queue = {
        source: {
            id: null,
            type: null,
            tracks: [],
            /* other spotify data */
        },
        nowPlaying: {
            index: 0,
            paused: true,
            track: null,
            progress: 0
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
	
	
	Socket.on('queue:update', function(newQueue) {
		Player.udpateQueue(newQueue);
		Player.updateStreamUrl();
		Player.updateVibrantSwatches();
	});
	
	this.play = function(source) {
		Socket.emit('queue:set', source);
	};
	
	Socket.on('queue:set', function(source) {
		Player.queue.source = source;
		Player.updateStreamUrl();
		Player.updateVibrantSwatches();
	});
	
	
	this.plause = function() {
		Socket.emit('playback:plause');
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
	
	this.skip = function(direction) {
		Socket.emit('playback:skip.' + direction);
	};
	
	Socket.on('playback:skip.next', function() {
		Player.queue.nowPlaying.index++;
		Player.updateStreamUrl();
		Player.updateVibrantSwatches();
	});
	
	Socket.on('playback:skip.prev', function() {
		Player.queue.nowPlaying.index--;
		Player.updateStreamUrl();
		Player.updateVibrantSwatches();
	});
	
	this.updateVibrantSwatches = function() {
		// Nested RAF to wait for Vibrant to load
		window.requestAnimationFrame(function() {
			window.requestAnimationFrame(function() {
				Player.queue.nowPlaying.theme = Player.queue.nowPlaying.swatches.Vibrant.getBodyTextColor() == '#000' ? 'light' : 'dark';
			});
		});
	};
	
	this.updateStreamUrl = function() {
		var track = Player.queue.source.tracks.items[Player.queue.nowPlaying.index];
		Player.queue.nowPlaying.streamUrl = '/api/tracks/mp3?artist='+track.artists[0].name+'&track='+track.name;
	};
	
	Player.el.addEventListener('canplay', function() {
		console.log('canplay');
		Socket.emit('playback:canplay');
	});
	
	Socket.on('playback:ended', function() {
		Player.el.skip('next');
	});
}]);