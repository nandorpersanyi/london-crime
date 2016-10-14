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
    
    function initiateCharts(){
        $scope.boroughOffenceChart = new $scope.createChart('bar','#borough-offence-chart','CrimeType',chartsWidth,chartsHeight,'ordinal',null,null,null,"postRedraw",null,null,null,true);
        $scope.boroughOutcomeChart = new $scope.createChart('bar','#borough-outcome-chart','LastOutcomeCategory',chartsWidth,chartsHeight,'ordinal',null,null,null,"postRedraw",null,null,'switchOutcome',true);
        $scope.boroughIdentifiedChart = new $scope.createChart('pie','#borough-identified-chart','Context',chartsWidth,chartsHeight,null,null,null,null,"postRedraw",null,null,'switchIdentified',null);
    }

    function drawBoroughCharts(){
        $scope.boroughCrimeData = $scope.crimeData.filter(function(crime){
            return crime.LSOA_name === $scope.selectedBorough.name;
        });

        $rootScope.crimeNdx = crossfilter($scope.boroughCrimeData);

        //Params:  chartType,chartId,chartKey,width,height,xScale,xScaleSort,xScaleDomain,centerBar,event,eventFunc,tickNum,tickSwitchFunc,positionLabel
        if($scope.boroughOffenceChart){
            $scope.boroughOffenceChart.disposeChartDimension();
            $scope.boroughOutcomeChart.disposeChartDimension();
            $scope.boroughIdentifiedChart.disposeChartDimension();

            initiateCharts();
            
            $scope.boroughOffenceChart.getChartObj().render();
            $scope.boroughOutcomeChart.getChartObj().render();
            $scope.boroughIdentifiedChart.getChartObj().render();
            dc.redrawAll();
        } else{
            initiateCharts();
            dc.renderAll();
        }
        
        $scope.alignChart('#borough-offence-chart',20,null,null);
        $scope.alignChart('#borough-outcome-chart',20,null,null);
    }

    $scope.$watch('selectedBorough.name',function(){
        if($state.current.name === 'borough-crimes'){
            drawBoroughCharts();

            console.log($scope.boroughCrimeData);
            var crimePoints = $scope.boroughCrimeData.map(function(crime){
                return [crime.Latitude,crime.Longitude]
            });
            var crimePointProperties = $scope.boroughCrimeData.map(function(crime){
                var crimeTypeObj = {"crimeType" : crime.CrimeType};
                return crimeTypeObj
            });
            
            $scope.points.properties = crimePointProperties;
            $scope.points.coords = crimePoints;
        }
    });
});
