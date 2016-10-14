'use strict';
// London Crime Dashboard by Nandor Persanyi
/**
 * @ngdoc function
 * @name londoncrimeApp.directive:mapLoading
 * @description
 * # mapLoading
 * Directive of the londoncrimeApp
 */
angular.module('londoncrimeApp')
.directive('mapLoading', function ($rootScope) {
    return {
        restrict: 'E',
        scope: true,
        link: function (scope, elem, attrs) {
            scope.$on('mapLoadedEvent', function(event, mass) {
                if(mass){
                    elem.addClass("map-loaded");
                }
            });
        }
    }
});