'use strict';
// London Crime Dashboard by Nandor Persanyi
/**
* @ngdoc function
* @name londoncrimeApp.controller:LoginController
* @description
* # LoginController
* Controller of the londoncrimeApp
*/
angular.module('londoncrimeApp')
.controller('LoginController', function ($scope,authService,$state) {

    $scope.buttonText="Login";

    $scope.login=function(){
        $scope.buttonText = "Logging in. . .";
        authService.login($scope.credentials.username, $scope.credentials.password).then(function (data) {
            $state.go('dashboard');
        }, function (err) {
            $scope.invalidLogin = true;
        }).finally(function () {
            $scope.buttonText = "Login";
        });
    };
});
