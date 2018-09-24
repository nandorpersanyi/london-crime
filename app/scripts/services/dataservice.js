'use strict';
// London Crime Dashboard by Nandor Persanyi
/**
* @ngdoc function
* @name londoncrimeApp.service:dataService
* @description
* # dataService
* Directive of the londoncrimeApp
*/
angular.module('londoncrimeApp')
.factory('dataService', ['$http','$state',/*'authService','$cookieStore',*/ function($http,$state/*,authService,$cookieStore*/){
    var dataService={};
    dataService.getData = function(filename){
        return $http.get(filename)
        .then(function(response){
            return response.data;
        },function error(msg) {
            //authService.user=undefined;
            //$cookieStore.remove('londoncrime-dashboard-user');
            sessionStorage.clear();
            $state.go("login");
        });
    };
    return dataService;
}])