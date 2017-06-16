/* global angular */
var app = angular.module('jukebox');

app.directive('seekbar', ['$document', 'Player', function($document) {
	return {
		restrict: 'E',
		scope: {
			audio: '='
		},
		link: function(scope, element, attrs) {
			scope.audio.addEventListener('timeupdate', function() {
				scope.$apply();
			});
			
			scope.audio.addEventListener('progress', function() {
				if (!scope.audio.buffers) scope.audio.buffers = [];
				
				if (scope.audio.duration > 0) {
					for (var i = 0; i < scope.audio.buffered.length; i++) {
						scope.audio.buffers[i] = {
							length: Math.round(
								(scope.audio.buffered.end(i) - scope.audio.buffered.start(i)) / scope.audio.duration * 100
							),
							offset: Math.round(
								scope.audio.buffered.start(i) / scope.audio.duration * 100
							)
						};
					}
				}
			});
		},
		templateUrl: 'components/player/seekbar/seekbar.directive.html'
	};
}]);