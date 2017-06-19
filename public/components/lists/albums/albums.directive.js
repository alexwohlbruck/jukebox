/* global angular */
var app = angular.module('jukebox');

app.directive('albums', [function() {
	return {
		restrict: 'E',
		scope: {
		    data: '='
		},
		templateUrl: 'components/lists/albums/albums.directive.html'
	};
}]);