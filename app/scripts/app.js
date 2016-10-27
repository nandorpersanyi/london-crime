'use strict';
// London Crime Dashboard by Nandor Persanyi
/**
 * @ngdoc overview
 * @name londoncrimeApp
 * @description
 * # londoncrimeApp
 *
 * Main module of the application.
 */
angular
.module('londoncrimeApp', [
    'ui.router',
    'ngCookies',
    'ngResource',
    'ngTouch',
    'ngMaps'
])
.constant("CRIMEDATA_ENDPOINT", "data/2015-10-metropolitan-street-trimmed4.json")
.constant("MAPDATA_ENDPOINT", "data/london-boroughs.geojson")
/*.run(['$rootScope','$state', '$cookieStore','authService',function($rootScope,$state, $cookieStore,authService){
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        if(error.unAuthorized) {
            $state.go("login");
        } else if(error.authorized){
            $state.go('dashboard');
        }
    });
    authService.user=$cookieStore.get('londoncrime-dashboard-user');
}])*/
.run(function($rootScope, $state) {
    $rootScope.$state = $state;
})
.config(function ($stateProvider,$urlRouterProvider) {
    $stateProvider
/*    .state('login', {
        url: '/',
        controller: 'LoginController',
        resolve:{
            user:['authService','$q',function(authService,$q){
                if(authService.user){
                    return $q.reject({authorized:true});
                }
            }]
        },
        templateUrl: 'views/login.html'
    })*/
    .state('dashboard', {
        url: '/',
        controller: 'DashboardController',
        /*resolve:{
            user:['authService','$q',function(authService,$q){
                return authService.user || $q.reject({ unAuthorized:true });
            }]
        },*/
        templateUrl: 'views/dashboard.html'
    })
        .state('london', {
        parent: 'dashboard',
        url: '/london',
        controller: 'LondonController',
        templateUrl: 'views/london.html',
        resolve:{
            mapData: ['dataService','MAPDATA_ENDPOINT', function (dataService,MAPDATA_ENDPOINT) {
                if(typeof Storage !== "undefined"){
                    if (sessionStorage.getItem("mapData") === null) {
                        return dataService.getData(MAPDATA_ENDPOINT).then(function(data){
                            sessionStorage.setItem('mapData', JSON.stringify(data));
                            return data;
                        });
                    } else {
                        return JSON.parse(sessionStorage.getItem("mapData"));
                    }
                } else {
                    return dataService.getData(MAPDATA_ENDPOINT);
                }
            }],
            crimeData: ['dataService','CRIMEDATA_ENDPOINT', function (dataService,CRIMEDATA_ENDPOINT) {
                return dataService.getData(CRIMEDATA_ENDPOINT).then(function(data){
                    return data;
                });
            }]
        }
        })
            .state('summary', {
                parent: 'london',
                url: '/summary',
                controller:'SummaryController',
                templateUrl: 'views/summary.html'
            })
            .state('borough-crimes', {
                parent: 'london',
                url: '/borough-crimes',
                controller:'boroughCrimesController',
                templateUrl: 'views/borough-crimes.html'
            });
    $urlRouterProvider.otherwise('/');
});
