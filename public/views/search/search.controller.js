/* global angular */
var app = angular.module('jukebox');

app.controller('SearchCtrl', ['$scope', '$stateParams', '$http', '$mdDialog', function($scope, $stateParams, $http, $mdDialog) {
    $http({
        url: '/api/search',
        method: 'GET',
        params: {
            q: $stateParams.q,
            limit: 19
        }
    }).then(function(response) {
        $scope.results = response.data;
        console.log(response.data);
    });

    $scope.openLyrics = function(ev) {
        var track = $scope.results.playlist.items[$scope.results.playlist.items.length - 1];
        $mdDialog.show({
            controller: 'LyricsCtrl',
            templateUrl: 'lyrics.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                track: track
            }
        });
    };
}]);
