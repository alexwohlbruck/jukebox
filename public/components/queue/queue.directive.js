/* global angular */
var app = angular.module('jukebox');

app.directive('queue', ['$document', 'Player', function($document, Player) {
	return {
		restrict: 'E',
		link: function(scope) {
		    scope.Player = Player;
		},
		templateUrl: 'components/queue/queue.directive.html'
	};
}]);