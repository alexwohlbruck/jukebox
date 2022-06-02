/* global angular */
var app = angular.module('jukebox');

app.directive('tracks', [function() {
	return {
		restrict: 'E',
		scope: {
		    data: '='
		},
		templateUrl: 'components/lists/tracks/tracks.directive.html'
	};
}]);