'use strict';
// London Crime Dashboard by Nandor Persanyi
/**
 * @ngdoc function
 * @name londoncrimeApp.service:authService
 * @description
 * # authService
 * Directive of the londoncrimeApp
 */
 angular.module('londoncrimeApp')
.factory('authService', ['$http','$cookieStore','$state','$q', function($http,$cookieStore,$state,$q){
    var auth={};
    auth.login=function(username,password/*,recapResponse*/){
        //Dummy Login >>
        function asyncFakeLogin() {
            return $q(function(resolve, reject) {
                setTimeout(function() {
                    if (username === 'london' && password === 'crime') {
                        resolve(200);
                    } else {
                        var err = {status:401}
                        reject(err);
                    }
                }, 1000);
            });
        }
        var promise = asyncFakeLogin();
        return promise
        .then(function(data) {
            if(data === 200){
                auth.user = 'DummyAuth';
                $cookieStore.put('londoncrime-dashboard-user', auth.user);
                return auth.user;
            } else {
                return false;
            } 
        });
        //<< Dummy Login
    };
    auth.logout=function(){
      //Dummy Logout >>
      auth.user=undefined;
      $cookieStore.remove('londoncrime-dashboard-user');
      $state.go("login");
      //<< Dummy Logout
    };
    return auth;
}]);