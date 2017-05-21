module.exports = function(io) {
    require('./playback.socket')(io);
};