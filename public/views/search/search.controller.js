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
}]);
