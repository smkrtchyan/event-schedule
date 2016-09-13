'use strict';

angular.module('esApp')
	.config(['$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider){

			$locationProvider.hashPrefix('!');

			$routeProvider
				.when('/calendar', {
					template: '<es-calendar></es-calendar>'
				})
				.when('/event', {
					template: '<es-manage-event></es-manage-event>'
				})
				.when('/event/:eventId', {
					template: '<es-manage-event></es-manage-event>'
				})
				.otherwise('/calendar');

		}
	])

	.constant('NOTIFY', {
		interval : 60000 // 1min
	})

	.run(['$rootScope', '$interval', 'NOTIFY', 'esEvent', function($rootScope, $interval, NOTIFY, esEvent){
		var childScope = $rootScope.$new();
		 
		$interval(function(){
			esEvent.notifyOnUpcoming(childScope);
		}, NOTIFY.interval);
	}]);