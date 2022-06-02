/* global angular */
var app = angular.module('jukebox');

app.directive('artists', [function() {
	return {
		restrict: 'E',
		scope: {
		    data: '='
		},
		templateUrl: 'components/lists/artists/artists.directive.html'
	};
}]);