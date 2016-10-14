'use strict';
// London Crime Dashboard by Nandor Persanyi
/**
 * @ngdoc function
 * @name londoncrimeApp.directive:pageLoading
 * @description
 * # pageLoading
 * Directive of the londoncrimeApp
 */
angular.module('londoncrimeApp')
.directive('pageLoading', function ($rootScope) {
	return {
		restrict: 'E',
		scope: true,
		link: function (scope, elem, attrs) {
			$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
				elem.removeClass("pageloaded");
			});
			$rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {
				elem.addClass("pageloaded");
			});
		}
	}
})