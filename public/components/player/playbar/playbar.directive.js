/* global angular */
var app = angular.module('jukebox');

app.directive('playbar', ['$document', 'Player', function($document, Player) {
	return {
		restrict: 'E',
		link: function(scope) {
		    scope.Player = Player;
		},
		templateUrl: 'components/player/playbar/playbar.directive.html'
	};
}]);