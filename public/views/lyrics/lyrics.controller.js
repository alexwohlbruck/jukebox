/* global angular */
var app = angular.module('jukebox');

app.controller('LyricsCtrl', ['$scope', '$mdDialog', 'track', function($scope, $mdDialog, track) {
    $scope.track = track;

    $scope.closeDialog = function() {
        $mdDialog.hide();
    };
}]);
