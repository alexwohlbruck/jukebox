module.exports = function(io) {
    var connectedClients = 0;
    var queue = {
        nowPlaying: {
        	index: 0
        }
    };
    
    io.on('connection', client => {
        connectedClients++;
        
        client.emit('queue:create', queue);
        
        client.on('queue:create', data => {
            queue = data;
            client.broadcast.emit('queue:create', data);
        });
        
        var clientsThatCanPlay = 0;
        
        client.on('track:play', data => {
            client.broadcast.emit('track:play', data);
        });
        
        client.on('track:canplay', data => {
            clientsThatCanPlay++;
            console.log('can play #: ' + clientsThatCanPlay)
            
            if (clientsThatCanPlay >= connectedClients) {
                console.log('play it');
                clientsThatCanPlay = 0;
                
                client.emit('playback:play', data);
            }
        });
        
        client.on('playback:play', () => {
            console.log('play it');
            client.broadcast.emit('playback:play');
        });
        
        client.on('playback:pause', () => {
            client.broadcast.emit('playback:pause');
        });
        
        client.on('track:play.index', data => {
            client.broadcast.emit('track:play.index', data);
        });
        
        client.on('track:ended', () => {
            client.broadcast.emit('track:ended');
        });
        
        client.on('disconnect', () => {
            connectedClients--;
        });
    });
};