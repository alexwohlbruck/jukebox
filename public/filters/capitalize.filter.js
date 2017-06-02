/* global angular */
var app = angular.module('music');

app.filter('capitalize', function() {
	return function(token) {
		return token.charAt(0).toUpperCase() + token.slice(1);
	};
});