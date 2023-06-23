/* global angular */
var app = angular.module('jukebox');

app.service('Player', ['$rootScope', 'Socket', '$http', '$mdToast', function($rootScope, Socket, $http, $mdToast) {
    var Player = this;

    this.el = new Audio();

    this.pinnedQueue = true;

    this.queue = {
        source: {
            id: null,
            type: null,
            tracks: [],
            /* other Spotify data */
        },
        nowPlaying: {
            index: 0,
            paused: true,
            track: null,
            progress: 0
        }
    };

this.play = function(source) {
    if (Player.queue.source.id === source.id && !source.tracks[source.index].isEmpty) {
        // Same album, switch to the new song within the album
        Player.queue.nowPlaying.index = source.index;
        Player.updateStreamUrl();
        Player.el.play();
    } else {
        // Different album or the selected song is empty, clear the queue and set the new source
      this.queue.source = {
                id: null,
                type: null,
                tracks: [],
                /* other Spotify data */
            };
            this.queue.nowPlaying.index = 0;
            this.queue.nowPlaying.paused = true;
            this.queue.nowPlaying.track = null;
            this.queue.nowPlaying.progress = 0;
        Player.queue.source = source;
        Player.updateStreamUrl();
        Player.el.play();
    }
};







  
  Player.downloadTrack = function() {
    var track = this.queue.source.tracks.items[this.queue.nowPlaying.index];
    var artist = track.artists[0].name;
    var trackName = track.name;
    var trackUrl = '/api/tracks/mp3?artist=' + encodeURIComponent(artist) + '&track=' + encodeURIComponent(trackName);

    // Open the track URL in a new browser tab
    window.open(trackUrl, '_blank');
};


    this.plause = function() {
        Player.queue.nowPlaying.paused = !Player.queue.nowPlaying.paused;
        if (Player.queue.nowPlaying.paused) {
            Player.el.pause();
        } else {
            Player.el.play();
        }
    };
  
      this.skipTo = function(track) {
        var trackIndex = Player.queue.source.tracks.items.indexOf(track);
        if (trackIndex > -1) {
            Player.queue.nowPlaying.index = trackIndex;
            Player.updateStreamUrl();
            Player.el.play();
        }
    };

    this.skip = function(direction) {
        if (direction === 'next') {
            Player.queue.nowPlaying.index++;
        } else if (direction === 'prev') {
            Player.queue.nowPlaying.index--;
        }
        Player.updateStreamUrl();
        Player.el.play();
    };

this.updateStreamUrl = function() {
    var track = Player.queue.source.tracks.items[Player.queue.nowPlaying.index];
    if (track) {
        Player.queue.nowPlaying.track = track;
        var artist = track.artists[0].name;
        var trackName = track.name;
        Player.el.src = '/api/tracks/mp3?artist=' + encodeURIComponent(artist) + '&track=' + encodeURIComponent(trackName);
    } else {
        Player.queue.nowPlaying.track = null;
        Player.el.src = '';
        Player.el.pause();
    }
};


    Player.el.addEventListener('ended', function() {
        $rootScope.$apply(function() {
            Player.skip('next');
        });
    });
}]);
