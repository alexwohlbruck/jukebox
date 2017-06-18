module.exports = function(io) {
    var Player = {
        queue: {
            source: {
                id: null,
                type: null,
                /* other optional spotify data */
            },
            tracks: [],
            nowPlaying: {
                index: 0,
                paused: true,
                track: null,
                progress: 0
            },
        },
        
        
        setQueue(newQueue)  {
            this.queue = Object.assign(this.queue, newQueue);
        },
        
        plause() {
            io.emit(this.queue.nowPlaying ? 'playback:play' : 'playback:pause');
            this.queue.nowPlaying = !this.queue.nowPlaying;
        },
        
        skip(direction) {
            // ?TODO: Update data for 'this.queue.nowPlaying.track'
            if (direction == 'next') {
                if (this.queue.nowPlaying.index < this.queue.tracks.length - 1) {
                    this.queue.nowPlaying.index++;
                    io.emit('playback:skip.next');
                }
            } else if (direction == 'prev') {
                if (this.queue.nowPlaying.index > 0) {
                    this.queue.nowPlaying.index--;
                    io.emit('playback:skip.prev');
                }
            }
        },
        
        setVolume() {
            
        },
        
        toggleShuffle(state) {
            
        },
        
        toggleRepeat(state) {
            
        },
        
        seek(to) {
            
        },
        
        // canPlay
    };
    
    io.on('connection', client => {
        
        var clientsThatCanPlay = 0, canPlayTimeout;
        
        client.emit('queue:set', Player.queue);
        
		client.on('connection:ping', () => client.emit('connection:pong'));
        
        client.on('queue:set', newQueue => {
            console.log('queue set');
            Player.setQueue(newQueue);
            io.emit('queue:set', Player.queue);
        });
        
        // TODO: Inefficient and verbose -- needs refactoring
        client.on('playback:canplay', data => {
            io.clients((error, clients) => {
                
                var totalClients = clients.length;
                
                if (clientsThatCanPlay == 0) {
                    canPlayTimeout = setTimeout(function() {
                        // TODO: Boot slow loading devices
                        console.log((totalClients - clientsThatCanPlay) + ' are taking too long, playing now');
                        client.emit('playback:play');
                    }, 3000);
                }
                
                clientsThatCanPlay++;
            
                console.log(clientsThatCanPlay + '/' + totalClients + ' can play');
                
                if (clientsThatCanPlay >= totalClients) {
                    clientsThatCanPlay = 0;
                    clearTimeout(canPlayTimeout);
                    
                    client.emit('playback:play', data);
                }
            });
        });
        
        client.on('playback:plause', () => Player.plause());
        
        client.on('playback:skip.next', () => Player.skip('next'));
        client.on('playback:skip.prev', () => Player.skip('prev'));
        
        client.on('track:play.index', data => client.broadcast.emit('track:play.index', data));
        
        client.on('track:ended', () => client.broadcast.emit('track:ended'));
    });
};