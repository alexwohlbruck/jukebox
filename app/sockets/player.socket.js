module.exports = function(io) {
    var Player = {
        queue: {
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
            },
        },
            
        setQueue(source) {
            this.clearQueue(); // Clear the queue

            this.queue.source = source;
            this.queue.nowPlaying.index = 0;
            this.queue.nowPlaying.paused = true;
            this.queue.nowPlaying.track = null;
            this.queue.nowPlaying.progress = 0;

            io.emit('queue:set', source);
        },

        clearQueue() {
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
        },
        
        updateQueue(newQueue) {
            this.queue = Object.assign(this.queue, newQueue);
        },
        
        play() {
            this.queue.nowPlaying.paused = false;
            io.emit('playback:play');
        },
        
        pause() {
            this.queue.nowPlaying.paused = true;
            io.emit('playback:pause');
        },
        
        skip(direction) {
            if (!this.queue.source.tracks || !this.queue.source.tracks.items) return false;
            
            if (direction === 'next' && this.queue.nowPlaying.index < this.queue.source.tracks.items.length - 1) {
                this.queue.nowPlaying.index++;
                io.emit('playback:skip.next');
            } else if (direction === 'prev' && this.queue.nowPlaying.index > 0) {
                this.queue.nowPlaying.index--;
                io.emit('playback:skip.prev');
            }
        },
        
        setVolume(volume) {
            // Implement your logic for setting the volume
            // For example, using the 'volume' parameter to control the volume level
            this.queue.nowPlaying.volume = volume;
            io.emit('playback:volume', volume);
        },
        
        toggleShuffle(state) {
            // Implement your logic for toggling shuffle
            this.queue.nowPlaying.shuffle = state;
            io.emit('playback:shuffle', state);
        },
        
        toggleRepeat(state) {
            // Implement your logic for toggling repeat
            this.queue.nowPlaying.repeat = state;
            io.emit('playback:repeat', state);
        },
        
        seek(to) {
            // Implement your logic for seeking
            // For example, using the 'to' parameter to seek to a specific time in the track
            this.queue.nowPlaying.progress = to;
            io.emit('playback:seek', to);
        }
    };

    Player.downloadTrack = function() {
    var track = this.queue.source.tracks.items[this.queue.nowPlaying.index];
    var artist = track.artists[0].name;
    var trackName = track.name;
    var trackUrl = '/api/tracks/download?artist=' + encodeURIComponent(artist) + '&track=' + encodeURIComponent(trackName);

    // Open the track URL in a new browser tab
    window.open(trackUrl, '_blank');
};


    io.on('connection', client => {
        client.on('queue:update', newQueue => {
            Player.updateQueue(newQueue);
        });

        client.on('queue:set', source => {
            Player.setQueue(source);
        });

        client.on('playback:play', () => {
            Player.play();
        });

        client.on('playback:pause', () => {
            Player.pause();
        });

        client.on('playback:skip.next', () => {
            Player.skip('next');
        });

        client.on('playback:skip.prev', () => {
            Player.skip('prev');
        });

        client.on('playback:volume', volume => {
            Player.setVolume(volume);
        });

        client.on('playback:shuffle', state => {
            Player.toggleShuffle(state);
        });

        client.on('playback:repeat', state => {
            Player.toggleRepeat(state);
        });

        client.on('playback:seek', position => {
            Player.seek(position);
        });

        client.on('track:download', () => {
            Player.downloadTrack();
        });
    });
};
