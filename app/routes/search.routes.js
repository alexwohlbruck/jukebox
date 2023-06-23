var express = require('express');
var router = express.Router();
var spotify = require.main.require('./app/services/spotify');

router.get('/', function(req, res) {
    var searchQuery = req.query.q;
    var searchTypes = ['track', 'album', 'artist', 'playlist'];
    var searchOptions = {
        limit: req.query.limit || 30,
        offset: req.query.offset || 0
    };

    spotify.search(searchQuery, searchTypes, searchOptions)
        .then(function(data) {
            res.status(200).json(data.body);
        })
        .catch(function(err) {
            res.status(400).json(err);
        });
});

module.exports = router;
