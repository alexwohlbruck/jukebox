var path = require('path');

module.exports = function(express, app) {
    app.use('/music', require('./music.routes'));
    
    app.use(express.static('public'));
};