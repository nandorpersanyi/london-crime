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

    var chartsWidth = 525;
    var chartsHeight = 250;
    // Initiate chart object instances
    var boroughOffenceChart = null;
    var boroughOutcomeChart = null;
    var boroughIdentifiedChart = null;
    // Initiate boroughCrimeData object
    var boroughCrimeData = {};
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

    // Create chart object instances
    function initiateCharts(){
        boroughOffenceChart = new $scope.createChart('bar','#borough-offence-chart','CrimeType',chartsWidth,chartsHeight,'ordinal',null,null,null,"postRedraw",null,null,null,true,false);
        boroughOutcomeChart = new $scope.createChart('bar','#borough-outcome-chart','LastOutcomeCategory',chartsWidth,chartsHeight,'ordinal',null,null,null,"postRedraw",null,null,'switchOutcome',true,'switchOutcome');
        boroughIdentifiedChart = new $scope.createChart('pie','#borough-identified-chart','Context',chartsWidth,chartsHeight,null,null,null,null,"postRedraw",null,null,'switchIdentified',null,'switchIdentified');
    }

    function drawBoroughCharts(){
        // Create filtered crimeData object using parent controller's crimeData object filtered by selected borough
        boroughCrimeData = $scope.crimeData.filter(function(crime){
            return crime.LSOA_name === $scope.selectedBorough.name;
        });
        // Set crimes filtered by selected borough in main crossfilter object 
        $rootScope.crimeNdx = crossfilter(boroughCrimeData);
        // If charts were already set, dispose crossfilter's old chart dimension objects, and set the new ones
        if(boroughOffenceChart){
            boroughOffenceChart.disposeChartDimension();
            boroughOutcomeChart.disposeChartDimension();
            boroughIdentifiedChart.disposeChartDimension();

            initiateCharts();
            
            boroughOffenceChart.getChartObj().render();
            boroughOutcomeChart.getChartObj().render();
            boroughIdentifiedChart.getChartObj().render();
            dc.redrawAll();
        } else{
            initiateCharts();
            dc.renderAll();
        }
        // Realign y axis label
        $scope.alignChart('#borough-offence-chart',20,null,null);
        $scope.alignChart('#borough-outcome-chart',20,null,null);
    }

    // Returns array containing coordinates of crimePoints
    function createCrimePointCoords(crime){
        return [crime.Latitude,crime.Longitude]
    }

    // Creates crimePoint properties to add to markers on map
    function createCrimePointProps(crime){
        return {
            "crimeType" : crime.CrimeType,
            "crimeLocation" : crime.Location,
            "crimeOutcome" : crime.LastOutcomeCategory
        };
    }

    // Draw borough charts >>
    // Watch borough change event, also triggered on first borough load 
    $scope.$watch('selectedBorough.name',function(){
        if($state.current.name === 'borough-crimes'){
            drawBoroughCharts();
            // Set crime point properties object and pass it to points directive config object
            $scope.points.properties = boroughCrimeData.map(function(crime){ return createCrimePointProps(crime) });
            // Set crime point coordinates array and pass it to points directive config object
            $scope.points.coords = boroughCrimeData.map(function(crime){ return createCrimePointCoords(crime) });
        }
    });

    // Filter crimePoints >>
    // Filter crimes against crimePointFilter object
    function filterCrime(crime){
        return $scope.crimePointFilter[crime.CrimeType];
    }
    // Bootstrap crimePoint filter event, triggered in view. Resets crimePoint properties object and crimePoint
    // coordinates array and passes it to points directive config object 
    $scope.filterCrimePoints = function(){
        $scope.points.properties = boroughCrimeData.map(function(crime){return createCrimePointProps(crime)});
        $scope.points.coords = boroughCrimeData
            .filter(function(crime){return filterCrime(crime)})
            .map(function(crime){return createCrimePointCoords(crime)});
    }
});
