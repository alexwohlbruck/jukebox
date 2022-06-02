/* global angular */
var app = angular.module('jukebox');

app.directive('queue', ['Player', function(Player) {
	return {
		restrict: 'E',
		link: function(scope) {
		    scope.Player = Player;
		},
		templateUrl: 'components/queue/queue.directive.html'
	};
}]);