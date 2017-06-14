/* global angular */
var app = angular.module('jukebox');

app.filter('vibrantRgb', function() {
    return function(Vibrant) {
        return 'rgb(' + Vibrant.rgb.join(',') + ')';
    };
})