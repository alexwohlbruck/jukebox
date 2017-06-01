module.exports = function(io) {
    var queue = {
        source: {
            id: null,
            type: null,
            /* other spotify data */
        },
        tracks: [],
        nowPlaying: {
            index: 0,
            track: null,
            progress: 0
        }
    };
    
    io.on('connection', client => {
        
		client.on('connection:ping', function() {
			client.emit('connection:pong');
		});
        
        client.emit('queue:set', queue);
        
        client.on('queue:set', newQueue => {
            console.log('queue set');
            queue = Object.assign(queue, newQueue);
            io.emit('queue:set', queue);
        });
        
        var clientsThatCanPlay = 0, canPlayTimeout;
        
        client.on('playback:canplay', data => {
            io.clients((error, clients) => {
                
                var totalClients = clients.length;
                
                if (clientsThatCanPlay == 0) {
                    canPlayTimeout = setTimeout(function() {
                        // Boot slow loading devices
                        console.log((totalClients - clientsThatCanPlay) + ' are taking too long, playing now')
                        client.emit('playback:play');
                    }, 3000);
                }
                
                clientsThatCanPlay++;
            
                console.log(clients[0]);
                console.log(clientsThatCanPlay + '/' + totalClients + ' can play');
                
                if (clientsThatCanPlay >= totalClients) {
                    clientsThatCanPlay = 0;
                    clearTimeout(canPlayTimeout);
                    
                    client.emit('playback:play', data);
                }
            });
        });
        
        client.on('playback:play', () => {
            io.emit('playback:play');
        });
        
        client.on('playback:pause', () => {
            io.emit('playback:pause');
        });
        
        client.on('track:play.index', data => {
            client.broadcast.emit('track:play.index', data);
        });
        
        client.on('track:ended', () => {
            client.broadcast.emit('track:ended');
        });
    });
};