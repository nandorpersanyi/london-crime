'use strict';
// London Crime Dashboard by Nandor Persanyi
/**
 * @ngdoc function
 * @name londoncrimeApp.controller:boroughCrimesController
 * @description
 * # boroughCrimesController
 * Controller of the londoncrimeApp
 */
angular.module('londoncrimeApp')
.controller('boroughCrimesController', function ($scope,$rootScope,$timeout,$document,$window,$state) {

    var boroughCrimeData = {};
    var firstBorough = true;

    filterCrimeData();
    setCrimePoints();

    // Observe borough change event, also triggered on first borough load 
    $scope.$watch('selectedBorough.name',function(){
        if(!firstBorough){
            filterCrimeData();
            setCrimePoints();
            $rootScope.$broadcast('borough-changed');
        } else {
            firstBorough = false;
        }
    });

    // Create crimeData object filtered on selected borough
    function filterCrimeData(){
        // Create filtered crimeData object using parent controller's crimeData object filtered by selected borough
        boroughCrimeData = $scope.crimeData.filter(function(crime){
            return crime.LSOA_name === $scope.selectedBorough.name;
        });
        // Set crimes filtered by selected borough in main crossfilter object 
        $rootScope.crimeNdx = crossfilter(boroughCrimeData);
    }

    // Plot crimes on map >>
    function setCrimePoints(){
        // Set crime point properties object and pass it to points directive config object
        $scope.points.properties = boroughCrimeData.map(function(crime){ return createCrimePointProps(crime) });
        // Set crime point coordinates array and pass it to points directive config object
        $scope.points.coords = boroughCrimeData.map(function(crime){ return createCrimePointCoords(crime) });

        // crimePointFilter object model, connected to filter checkboxes in view
        $scope.crimePointFilter = {
            'Bicycle theft' : true,
            'Burglary' : true,
            'Criminal damage and arson' : true,
            'Drugs' : true,
            'Other crime' : true,
            'Posession of weapons' : true,
            'Public order' : true,
            'Robbery' : true,
            'Shop lifting' : true,
            'Vehicle crime' : true,
            'Violence and sexual offences' : true
        };
        $scope.filterAll = false;
        $scope.filterAllText = 'Deselect all';
    }

    // Returns array containing coordinates of crimePoints
    function createCrimePointCoords(crime){
        return [crime.Latitude,crime.Longitude]
    }

    // Creates crimePoint properties to add to markers on map
    function createCrimePointProps(crime){
        return {
            "CrimeType" : crime.CrimeType,
            "CrimeLocation" : crime.Location,
            "CrimeOutcome" : crime.LastOutcomeCategory
        };
    }

    // Filter crimePoints >>
    // Filter crimes against crimePointFilter object
    function filterCrime(crime){
        return $scope.crimePointFilter[crime.CrimeType];
    }
    // Bootstrap crimePoint filter event, triggered in view. Resets crimePoint properties object and crimePoint
    // coordinates array and passes it to points directive config object 
    $scope.filterCrimePoints = function(){
        $scope.points.properties = boroughCrimeData
            .filter(function(crime){return filterCrime(crime)})
            .map(function(crime){return createCrimePointProps(crime)});
        $scope.points.coords = boroughCrimeData
            .filter(function(crime){return filterCrime(crime)})
            .map(function(crime){return createCrimePointCoords(crime)});
    }
    
    $scope.allFilters = function(){
        if($scope.filterAll){
            Object.keys($scope.crimePointFilter).forEach(function (key) {$scope.crimePointFilter[key.toString()] = true;});
            $scope.filterAll = false;
            $scope.points.properties = boroughCrimeData.map(function(crime){return createCrimePointProps(crime)});
            $scope.points.coords = boroughCrimeData.map(function(crime){ return createCrimePointCoords(crime) });
            $scope.filterAllText = 'Deselect all';
        } else{
            Object.keys($scope.crimePointFilter).forEach(function (key) {$scope.crimePointFilter[key.toString()] = false;});
            $scope.filterAll = true;
            $scope.points.properties = [];
            $scope.points.coords = [];
            $scope.filterAllText = 'Select all';
        }
    }

});
