/* global angular */
var app = angular.module('jukebox');

app.controller('SearchCtrl', ['$scope', '$stateParams', '$http', function($scope, $stateParams, $http) {
    $http({
		url: '/api/search',
		method: 'GET',
		params: {
			q: $stateParams.q,
			limit: 8
		}
	}).then(function(response) {
		$scope.results = response.data;
		console.log(response.data);
	});
}]);