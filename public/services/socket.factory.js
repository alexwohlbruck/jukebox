/* global angular */
var app = angular.module('music');

app.factory('Socket', ['socketFactory', function(socketFactory) {
	return socketFactory();
}]);