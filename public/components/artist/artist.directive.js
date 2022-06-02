/* global angular */
var app = angular.module('jukebox');

app.directive('artist', [function() {
	return {
		restrict: 'E',
		scope: {
		    data: '='
		},
		templateUrl: 'components/artist/artist.directive.html'
	};
}]);