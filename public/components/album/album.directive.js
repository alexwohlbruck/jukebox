/* global angular */
var app = angular.module('jukebox');

app.directive('album', [function() {
	return {
		restrict: 'E',
		scope: {
		    data: '='
		},
		templateUrl: 'components/album/album.directive.html',
		controller: ['$scope', 'Spotify', 'Player', function($scope, Spotify, Player) {
			$scope.Player = Player;
			
			$scope.plause = function() {
				if (Player.queue.source.id && Player.queue.source.id == $scope.data.id) {
					Player.plause();
				} else { 
					$scope.playAlbum($scope.data.id);
				}
			};
			
			$scope.playAlbum = function(albumID) {
				Spotify.getAlbum(albumID).then(function(response) {
					Player.play(response.data);
				});
			};
		}]
	};
}]);