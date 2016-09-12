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
		interval : 120000 // 2min
	});