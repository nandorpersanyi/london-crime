'use strict';

/**
 * @ngdoc function
 * @name londoncrimeApp.controller:SummaryController
 * @description
 * # SummaryController
 * Controller of the londoncrimeApp
 */
angular.module('londoncrimeApp')
.controller('SummaryController', function ($scope,$timeout,$window,$state) {

    var chartsWidth = 525;
    var chartsHeight = 250;
    //Params:  chartType,chartId,chartKey,width,height,xScale,xScaleSort,xScaleDomain,centerBar,event,eventFunc,tickNum,tickSwitchFunc,positionLabel
    var offenceChart = new $scope.createChart('bar','#offence-chart','CrimeType',chartsWidth,chartsHeight,'ordinal',null,null,null,"postRedraw",null,null,null,true);
    var boroughChart = new $scope.createChart('bar','#borough-chart','LSOA_name',chartsWidth,chartsHeight,'ordinal',null,null,null,"postRedraw",null,null,null,true);
    var outcomeChart = new $scope.createChart('bar','#outcome-chart','LastOutcomeCategory',chartsWidth,chartsHeight,'ordinal',null,null,null,"postRedraw",null,null,'switchOutcome',true);
    var identifiedChart = new $scope.createChart('pie','#identified-chart','Context',chartsWidth,chartsHeight,null,null,null,null,"postRedraw",null,null,'switchIdentified',null);
    
    dc.renderAll();

    $scope.alignChart('#offence-chart',20,null,null);
    $scope.alignChart('#borough-chart',20,null,null);
    $scope.alignChart('#outcome-chart',20,null,null);
    //Scroll to Content >>
    /*var scrollToElem = angular.element(document.getElementById("county-navigation"));
    $document.scrollToElement(scrollToElem, 100, 2000);*/
    //<< Scroll to Content

});
