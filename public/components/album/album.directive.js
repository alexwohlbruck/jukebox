/* global angular */
var app = angular.module('jukebox');

app.directive('album', [function() {
	return {
		restrict: 'E',
		scope: {
		    data: '='
		},
		templateUrl: 'components/album/album.directive.html'
	};
}]);