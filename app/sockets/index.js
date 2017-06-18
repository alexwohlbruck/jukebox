module.exports = function(io) {
    require('./player.socket')(io);
};