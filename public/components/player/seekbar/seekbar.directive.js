/* global angular */
var app = angular.module('jukebox');

app.directive('seekbar', ['$document', function($document) {
    return {
        restrict: 'E',
        scope: {
            audio: '='
        },
        controller: ['$scope', function($scope) {
            // Download track function
            $scope.downloadTrack = function() {
                var track = $scope.audio.source.tracks.items[$scope.audio.nowPlaying.index];
                var trackUrl = track.preview_url;
                var trackName = track.name + '.mp3';

                if (trackUrl) {
                    // Create an invisible anchor element
                    var anchor = document.createElement('a');
                    anchor.style.display = 'none';
                    anchor.href = trackUrl;
                    anchor.download = trackName;

                    // Append the anchor element to the document body
                    document.body.appendChild(anchor);

                    // Trigger a click event on the anchor element to start the download
                    anchor.click();

                    // Remove the anchor element from the document body
                    document.body.removeChild(anchor);
                }
            };
        }],
        templateUrl: 'components/player/seekbar/seekbar.directive.html'
    };
}]);
