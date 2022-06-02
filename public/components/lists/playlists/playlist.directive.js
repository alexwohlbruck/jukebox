/* global angular */
var app = angular.module('jukebox');

app.directive('playlist', [function() {
	return {
		restrict: 'E',
		scope: {
		    data: '='
		},
		templateUrl: 'components/lists/playlist/playlist.directive.html'
	};
}]);