/* global angular */
var app = angular.module('jukebox');

app.service('Spotify', ['$http', function($http) {
    this.getTrack = function() {
        // TODO
    };
    
    this.getTracks = function() {
        // TODO
    };
    
    this.getAlbum = function(albumId) {
        return $http.get('/api/albums/' + albumId);
    };
    
    this.getAlbums = function() {
        // TODO
    };
    
    this.getArtist = function() {
        // TODO
    };
    
    this.getArtists = function() {
        // TODO
    };
    
    this.search = function() {
        // TODO
    };
    
    this.searchAlbums = function() {
        // TODO
    };
    
    this.searchArtists = function() {
        // TODO
    };
    
    this.searchTracks = function() {
        // TODO
    };
    
    this.searchPlaylists = function() {
        // TODO
    };
    
    this.getArtistAlbums = function() {
        // TODO
    };
    
    this.getAlbumTracks = function(albumId) {
        return $http.get('/api/albums/' + albumId + '/tracks');
    };
    
    this.getArtistTopTracks = function() {
        // TODO
    };
    
    this.getArtistRelatedArtists = function() {
        // TODO
    };
    
    this.getUser = function() {
        // TODO
    };
    
    this.getMe = function() {
        // TODO
    };
    
    this.getUserPlaylists = function() {
        // TODO
    };
    
    this.getPlaylist = function() {
        // TODO
    };
    
    this.getPlaylistTracks = function() {
        // TODO
    };
    
    this.createPlaylist = function() {
        // TODO
    };
    
    this.followPlaylist = function() {
        // TODO
    };
    
    this.unfollowPlaylist = function() {
        // TODO
    };
    
    this.changePlaylistDetails = function() {
        // TODO
    };
    
    this.addTracksToPlaylist = function() {
        // TODO
    };
    
    this.removeTracksFromPlaylist = function() {
        // TODO
    };
    
    this.removeTracksFromPlaylistByPosition = function() {
        // TODO
    };
    
    this.replaceTracksInPlaylist = function() {
        // TODO
    };
    
    this.reorderTracksInPlaylist = function() {
        // TODO
    };
    
    this.getAudioFeaturesForTrack = function() {
        // TODO
    };
    
    this.getAudioFeaturesForTracks = function() {
        // TODO
    };
    
    this.getRecommendations = function() {
        // TODO
    };
    
    this.getAvailableGenreSeeds = function() {
        // TODO
    };
    
    this.clientCredentialsGrant = function() {
        // TODO
    };
    
    this.authorizationCodeGrant = function() {
        // TODO
    };
    
    this.refreshAccessToken = function() {
        // TODO
    };
    
    this.createAuthorizeURL = function() {
        // TODO
    };
    
    this.getMySavedTracks = function() {
        // TODO
    };
    
    this.containsMySavedTracks = function() {
        // TODO
    };
    
    this.removeFromMySavedTracks = function() {
        // TODO
    };
    
    this.addToMySavedTracks = function() {
        // TODO
    };
    
    this.removeFromMySavedAlbums = function() {
        // TODO
    };
    
    this.addToMySavedAlbums = function() {
        // TODO
    };
    
    this.getMySavedAlbums = function() {
        // TODO
    };
    
    this.containsMySavedAlbums = function() {
        // TODO
    };
    
    this.getMyTopArtists = function() {
        // TODO
    };
    
    this.getMyTopTracks = function() {
        // TODO
    };
    
    this.followUsers = function() {
        // TODO
    };
    
    this.followArtists = function() {
        // TODO
    };
    
    this.unfollowUsers = function() {
        // TODO
    };
    
    this.unfollowArtists = function() {
        // TODO
    };
    
    this.isFollowingUsers = function() {
        // TODO
    };
    
    this.getFollowedArtists = function() {
        // TODO
    };
    
    this.areFollowingPlaylist = function() {
        // TODO
    };
    
    this.isFollowingArtists = function() {
        // TODO
    };
    
    this.getNewReleases = function() {
        // TODO
    };
    
    this.getFeaturedPlaylists = function() {
        // TODO
    };
    
    this.getCategories = function() {
        // TODO
    };
    
    this.getCategory = function() {
        // TODO
    };
    
    this.getPlaylistsForCategory = function() {
        // TODO
    };
}]);