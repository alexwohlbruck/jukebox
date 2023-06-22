/* global angular */
var app = angular.module('jukebox');

app.service('Spotify', ['$http', function($http) {
    this.getTrack = function(trackId) {
        return $http.get('/api/tracks/' + trackId);
    };
    
    this.getTracks = function(trackIds) {
        return $http.get('/api/tracks?ids=' + trackIds.join(','));
    };
    
    this.getAlbum = function(albumId) {
        return $http.get('/api/albums/' + albumId);
    };
    
    this.getAlbums = function(albumIds) {
        return $http.get('/api/albums?ids=' + albumIds.join(','));
    };
    
    this.getArtist = function(artistId) {
        return $http.get('/api/artists/' + artistId);
    };
    
    this.getArtists = function(artistIds) {
        return $http.get('/api/artists?ids=' + artistIds.join(','));
    };
    
    this.search = function(query) {
        return $http.get('/api/search?q=' + query);
    };
    
    this.searchAlbums = function(query) {
        return $http.get('/api/search?type=album&q=' + query);
    };
    
    this.searchArtists = function(query) {
        return $http.get('/api/search?type=artist&q=' + query);
    };
    
    this.searchTracks = function(query) {
        return $http.get('/api/search?type=track&q=' + query);
    };
    
    this.searchPlaylists = function(query) {
        return $http.get('/api/search?type=playlist&q=' + query);
    };
    
    this.getAlbumTracks = function(albumId) {
        return $http.get('/api/albums/' + albumId + '/tracks');
    };
    
    this.getArtistTopTracks = function(artistId) {
        return $http.get('/api/artists/' + artistId + '/top-tracks');
    };
    
    this.getArtistRelatedArtists = function(artistId) {
        return $http.get('/api/artists/' + artistId + '/related-artists');
    };
    
    this.getUser = function(userId) {
        return $http.get('/api/users/' + userId);
    };
    
    this.getMe = function() {
        return $http.get('/api/me');
    };
    
    this.getUserPlaylists = function(userId) {
        return $http.get('/api/users/' + userId + '/playlists');
    };
    
    this.getPlaylist = function(playlistId) {
        return $http.get('/api/playlists/' + playlistId);
    };
    
    this.getPlaylistTracks = function(playlistId) {
        return $http.get('/api/playlists/' + playlistId + '/tracks');
    };
    
    this.createPlaylist = function(userId, playlistData) {
        return $http.post('/api/users/' + userId + '/playlists', playlistData);
    };
    
    this.followPlaylist = function(playlistId) {
        return $http.put('/api/playlists/' + playlistId + '/follow');
    };
    
    this.unfollowPlaylist = function(playlistId) {
        return $http.delete('/api/playlists/' + playlistId + '/follow');
    };
    
    this.changePlaylistDetails = function(playlistId, updatedData) {
        return $http.put('/api/playlists/' + playlistId, updatedData);
    };
    
    this.addTracksToPlaylist = function(playlistId, trackUris) {
        return $http.post('/api/playlists/' + playlistId + '/tracks', trackUris);
    };
    
    this.removeTracksFromPlaylist = function(playlistId, trackUris) {
        var config = {
            data: { tracks: trackUris },
            headers: { 'Content-Type': 'application/json;charset=utf-8' }
        };
        return $http.delete('/api/playlists/' + playlistId + '/tracks', config);
    };
    
    this.removeTracksFromPlaylistByPosition = function(playlistId, positions) {
        var config = {
            data: { positions: positions },
            headers: { 'Content-Type': 'application/json;charset=utf-8' }
        };
        return $http.delete('/api/playlists/' + playlistId + '/tracks/positions', config);
    };
    
    this.replaceTracksInPlaylist = function(playlistId, trackUris) {
        return $http.put('/api/playlists/' + playlistId + '/tracks', trackUris);
    };
    
    this.reorderTracksInPlaylist = function(playlistId, rangeStart, insertBefore) {
        return $http.put('/api/playlists/' + playlistId + '/tracks/reorder', {
            range_start: rangeStart,
            insert_before: insertBefore
        });
    };
    
    this.getAudioFeaturesForTrack = function(trackId) {
        return $http.get('/api/audio-features/' + trackId);
    };
    
    this.getAudioFeaturesForTracks = function(trackIds) {
        return $http.get('/api/audio-features?ids=' + trackIds.join(','));
    };
    
    this.getRecommendations = function(options) {
        var queryParams = buildRecommendationQueryParams(options);
        return $http.get('/api/recommendations' + queryParams);
    };
    
    this.getAvailableGenreSeeds = function() {
        return $http.get('/api/recommendations/available-genre-seeds');
    };
    
    this.clientCredentialsGrant = function() {
        // TODO: Implement client credentials grant
    };
    
    this.authorizationCodeGrant = function() {
        // TODO: Implement authorization code grant
    };
    
    this.refreshAccessToken = function() {
        // TODO: Implement access token refresh
    };
    
    this.createAuthorizeURL = function() {
        // TODO: Implement create authorize URL
    };
    
    this.getMySavedTracks = function() {
        return $http.get('/api/me/tracks');
    };
    
    this.containsMySavedTracks = function(trackIds) {
        return $http.get('/api/me/tracks/contains?ids=' + trackIds.join(','));
    };
    
    this.removeFromMySavedTracks = function(trackIds) {
        return $http.delete('/api/me/tracks', { data: { ids: trackIds } });
    };
    
    this.addToMySavedTracks = function(trackIds) {
        return $http.put('/api/me/tracks', { ids: trackIds });
    };
    
    this.removeFromMySavedAlbums = function(albumIds) {
        return $http.delete('/api/me/albums', { data: { ids: albumIds } });
    };
    
    this.addToMySavedAlbums = function(albumIds) {
        return $http.put('/api/me/albums', { ids: albumIds });
    };
    
    this.getMySavedAlbums = function() {
        return $http.get('/api/me/albums');
    };
    
    this.containsMySavedAlbums = function(albumIds) {
        return $http.get('/api/me/albums/contains?ids=' + albumIds.join(','));
    };
    
    this.getMyTopArtists = function() {
        return $http.get('/api/me/top-artists');
    };
    
    this.getMyTopTracks = function() {
        return $http.get('/api/me/top-tracks');
    };
    
    this.followUsers = function(userIds) {
        return $http.put('/api/me/following', { ids: userIds });
    };
    
    this.followArtists = function(artistIds) {
        return $http.put('/api/me/following?type=artist', { ids: artistIds });
    };
    
    this.unfollowUsers = function(userIds) {
        return $http.delete('/api/me/following', { data: { ids: userIds } });
    };
    
    this.unfollowArtists = function(artistIds) {
        return $http.delete('/api/me/following?type=artist', { data: { ids: artistIds } });
    };
    
    this.isFollowingUsers = function(userIds) {
        return $http.get('/api/me/following/contains?type=user&ids=' + userIds.join(','));
    };
    
    this.getFollowedArtists = function() {
        return $http.get('/api/me/following?type=artist');
    };
    
    this.areFollowingPlaylist = function(playlistId, userIds) {
        return $http.get('/api/playlists/' + playlistId + '/followers/contains?ids=' + userIds.join(','));
    };
    
    this.isFollowingArtists = function(artistIds) {
        return $http.get('/api/me/following/contains?type=artist&ids=' + artistIds.join(','));
    };
    
    this.getNewReleases = function(options) {
        var queryParams = buildNewReleasesQueryParams(options);
        return $http.get('/api/browse/new-releases' + queryParams);
    };
    
    this.getFeaturedPlaylists = function(options) {
        var queryParams = buildFeaturedPlaylistsQueryParams(options);
        return $http.get('/api/browse/featured-playlists' + queryParams);
    };
    
    this.getCategories = function(options) {
        var queryParams = buildCategoriesQueryParams(options);
        return $http.get('/api/browse/categories' + queryParams);
    };
    
    this.getCategory = function(categoryId, options) {
        var queryParams = buildCategoryQueryParams(options);
        return $http.get('/api/browse/categories/' + categoryId + queryParams);
    };
    
    this.getPlaylistsForCategory = function(categoryId, options) {
        var queryParams = buildCategoryPlaylistsQueryParams(options);
        return $http.get('/api/browse/categories/' + categoryId + '/playlists' + queryParams);
    };
    
    // Helper functions for building query parameters
    
    function buildRecommendationQueryParams(options) {
        var params = [];
        if (options.seed_artists) {
            params.push('seed_artists=' + options.seed_artists.join(','));
        }
        if (options.seed_genres) {
            params.push('seed_genres=' + options.seed_genres.join(','));
        }
        if (options.seed_tracks) {
            params.push('seed_tracks=' + options.seed_tracks.join(','));
        }
        if (options.limit) {
            params.push('limit=' + options.limit);
        }
        return '?' + params.join('&');
    }
    
    function buildNewReleasesQueryParams(options) {
        var params = [];
        if (options.country) {
            params.push('country=' + options.country);
        }
        if (options.limit) {
            params.push('limit=' + options.limit);
        }
        return '?' + params.join('&');
    }
    
    function buildFeaturedPlaylistsQueryParams(options) {
        var params = [];
        if (options.country) {
            params.push('country=' + options.country);
        }
        if (options.limit) {
            params.push('limit=' + options.limit);
        }
        return '?' + params.join('&');
    }
    
    function buildCategoriesQueryParams(options) {
        var params = [];
        if (options.country) {
            params.push('country=' + options.country);
        }
        if (options.locale) {
            params.push('locale=' + options.locale);
        }
        if (options.limit) {
            params.push('limit=' + options.limit);
        }
        return '?' + params.join('&');
    }
    
    function buildCategoryQueryParams(options) {
        var params = [];
        if (options.country) {
            params.push('country=' + options.country);
        }
        if (options.locale) {
            params.push('locale=' + options.locale);
        }
        return '?' + params.join('&');
    }
    
    function buildCategoryPlaylistsQueryParams(options) {
        var params = [];
        if (options.country) {
            params.push('country=' + options.country);
        }
        if (options.limit) {
            params.push('limit=' + options.limit);
        }
        if (options.offset) {
            params.push('offset=' + options.offset);
        }
        return '?' + params.join('&');
    }
}]);
