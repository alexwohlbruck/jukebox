/* global angular */
var app = angular.module('jukebox');

app.factory('Socket', ['socketFactory', function(socketFactory) {
	return socketFactory();
}]);