var express = require('express');
var router = express.Router();
var spotify = require.main.require('./app/services/spotify');

router.get('/:artistId', function(req, res) {
  var artistId = req.params.artistId;

  // Retrieve artist information from Spotify
  spotify.getArtist(artistId)
    .then(function(artistData) {
      var artist = {
        id: artistData.id,
        name: artistData.name,
        followers: artistData.followers,
        genres: artistData.genres,
        images: artistData.images
        // Include any additional artist data you want to display
      };

      res.status(200).json(artist);
    })
    .catch(function(err) {
      res.status(err.statusCode || 500).json(err);
    });
});

module.exports = router;
