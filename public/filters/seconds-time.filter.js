/* global angular */
var app = angular.module('jukebox');

app.filter('secondsToTimeString', function() {
	return function(input) {
		if (isNaN(input)) return null;
		
		input = Math.floor(input);
		var hours   = Math.floor(input / 3600);
		var minutes = Math.floor((input - (hours * 3600)) / 60);
		var seconds = input - (hours * 3600) - (minutes * 60);

		if (seconds < 10) { seconds = "0" + seconds; }
		if (hours != 0 && minutes < 10) { minutes = "0" + minutes; }
		return (hours == 0 ? '' : hours+':')+minutes+':'+seconds;
	};
});