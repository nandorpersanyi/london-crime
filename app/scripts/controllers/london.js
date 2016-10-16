'use strict';
// London Crime Dashboard by Nandor Persanyi
/**
 * @ngdoc function
 * @name londoncrimeApp.controller:LondonController
 * @description
 * # LondonController
 * Controller of the londoncrimeApp
 */
angular.module('londoncrimeApp')
.controller('LondonController', function ($rootScope,$scope,$state,$timeout,mapData,crimeData) {

    $scope.crimeData = crimeData;
    $scope.selectedBorough = {};
    $scope.selectedBoroughTitle = 'London';
    $scope.selectedBorough.name = 'London';
    var boroughSelected = false;
    var firstBoroughSelected = false;
    $rootScope.crimeNdx = crossfilter($scope.crimeData);

    // Map Logic >>>
    // Set map directive config object
    $scope.map = {
        center: [51.515741, -0.115339],
        zoom: 10,
        options: function() {
            return {
                streetViewControl: false,
                scrollwheel: false
            }
        },
        events:{
            idle: function(e, p, map, points) {
                $scope.$broadcast('mapLoadedEvent', true);
            }
        }
    };
    // Set geopolygoncustom directive config object
    $scope.boroughs = {
        geojson:mapData,
        options: function(geometry, properties, map, i) {
            return {
                fillColor: '#002699',
                strokeWeight: 1,
                strokeColor: '#e6e600'
            }
        },
        events: {
            mouseover: function(e, p, map, polygons) {
                $scope.selectedBoroughTitle = p.properties.NAME;
                $scope.$apply();

                if($scope.selectedBorough.name !== p.properties.NAME) {
                    p.setOptions({
                        fillColor: '#001966'
                    })
                }
            },
            mouseout: function(e, p, map, polygons) {
                if(!boroughSelected){
                    $scope.selectedBoroughTitle = 'London';
                } else {
                    $scope.selectedBoroughTitle = $scope.selectedBorough.name;
                }
                if($scope.selectedBorough.name !== p.properties.NAME){
                    $scope.$apply();
                    p.setOptions({
                        fillColor: '#002699'
                    })
                }
            },
            click: function(e, p, map, polygons) {
                if($scope.selectedBorough.name === 'London'){
                    boroughSelected = true;
                    mapLoadBorough(p,map);
                } else {
                    polygons.forEach(function(arrayElement,index) {
                        if(arrayElement.properties.NAME === $scope.selectedBorough.name){
                            arrayElement.polygons.forEach(function(subArrayElement,subIndex) {
                                subArrayElement.setOptions({
                                    fillColor: '#002699'
                                });
                            });
                        }
                    });
                    boroughSelected = true;
                    $scope.crimeType = null;
                    mapLoadBorough(p,map);
                }
            }
        }
    };
    // Set points directive config object
    $scope.points = {
        coords: [],
        properties:[],
        options: function(coords, properties, i, map) {
            return {
                draggable: false,
                crimePoint: properties[i],
                icon: 'images/metropolitan_police_service.png'
            }
        },
        events: {
            click: function(e, point, map, points) {
                $scope.crimeType = point.crimePoint.CrimeType;
                $scope.crimeLocation = point.crimePoint.CrimeLocation;
                $scope.crimeOutcome = switchOutcome(point.crimePoint.CrimeOutcome);
                $scope.$apply();
            }
        }
    };
    // Load borough after selecting it on the map
    function mapLoadBorough(p,map){
        $scope.selectedBorough.name = p.properties.NAME;
        $scope.$apply();

        p.setOptions({
            fillColor: 'transparent'
        });
        map.setOptions({
            center: p.properties.CENTER
        });
        if(!firstBoroughSelected)
            map.setOptions({
                zoom: 12
            });

        firstBoroughSelected = true;
        if($state.current.name === 'summary')
            $state.go("borough-crimes");
    };
    // <<< Map Logic

    $scope.offenceChart = {
        charttype: 'bar',
        chartid:'#offence-chart',
        chartkey:'CrimeType',
        xscale:'ordinal',
        xscalesort:null,
        xscaledomain:null,
        centerbar:null,
        event:'postRedraw',
        eventfunc:null,
        ticknum:null,
        tickswitchfunc:null,
        positionlabel:true,
        switchtitle:null
    };
    $scope.boroughChart = {
        charttype: 'bar',
        chartid:'#borough-chart',
        chartkey:'LSOA_name',
        xscale:'ordinal',
        xscalesort:null,
        xscaledomain:null,
        centerbar:null,
        event:'postRedraw',
        eventfunc:null,
        ticknum:null,
        tickswitchfunc:null,
        positionlabel:true,
        switchtitle:null
    };
    $scope.outcomeChart = {
        charttype: 'bar',
        chartid:'#outcome-chart',
        chartkey:'LastOutcomeCategory',
        xscale:'ordinal',
        xscalesort:null,
        xscaledomain:null,
        centerbar:null,
        event:'postRedraw',
        eventfunc:null,
        ticknum:null,
        tickswitchfunc:'switchOutcome',
        positionlabel:true,
        switchtitle:'switchOutcome'
    };
    $scope.identifiedChart = {
        charttype: 'pie',
        chartid:'#identified-chart',
        chartkey:'Context',
        xscale:null,
        xscalesort:null,
        xscaledomain:null,
        centerbar:null,
        event:'postRedraw',
        eventfunc:null,
        ticknum:null,
        tickswitchfunc:'switchIdentified',
        positionlabel:true,
        switchtitle:'switchIdentified'
    };

    function switchOutcome(d){
        switch(d) {
            case 0:
                return 'Awaiting court outcome';
            case 1:
                return 'Court case unable to proceed';
            case 2:
                return 'Court result unavailable';
            case 3:
                return 'Defendant found not guilty';
            case 4:
                return 'Defendant sent to Crown Court';
            case 5:
                return 'Local resolution';
            case 6:
                return 'No suspect identified';
            case 7:
                return 'Offender deprived of property';
            case 8:
                return 'Offender fined';
            case 9:
                return 'Offender given a caution';
            case 10:
                return 'Offender given a drugs possession warning';
            case 11:
                return 'Offender given absolute discharge';
            case 12:
                return 'Offender given community sentence';
            case 13:
                return 'Offender given conditional discharge';
            case 14:
                return 'Offender given penalty notice';
            case 15:
                return 'Offender given suspended prison sentence';
            case 16:
                return 'Offender ordered to pay compensation';
            case 17:
                return 'Offender otherwise dealt with';
            case 18:
                return 'Offender sent to prison';
            case 19:
                return 'Suspect charged as part of another case';
            case 20:
                return 'Under investigation';
            default:
                return '';
        }
    }

    // Go to child state
    $state.go('summary');
});
