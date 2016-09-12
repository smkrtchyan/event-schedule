'use strict';

angular.module('esCore.event')
	.factory('esEvent', esEventService);

	function esEventService(moment, esStorage, Notification) {
			var allEvents;

		function _getEventsByDay(currentDay){
			var todayEvents; 

			todayEvents = allEvents.filter(function( element, index, array ){
				var startDate = new moment(element.start);
				return currentDay.isSame(startDate, 'day');
			})
			return todayEvents;
		}

		function _getEventById(eventId) {
			var i;

			for( i = 0; i < allEvents.length; i++){
				if( eventId === allEvents[i].uid ){
					return { event: allEvents[i], index: i };
				}
			}
		}

		function _addEvent(data){
			allEvents.push(data);
			esStorage.set('events', allEvents);
			Notification.success('Appointment has been created');
		}

		function _updateEvent(id, data){
			var index = _getEventById(id).index;
			allEvents[index] = data;
			esStorage.set('events', allEvents);
			Notification.success('Appointment has been updated');
		}

		function _removeEvent(id){
			var index = _getEventById(id).index;
			allEvents.splice(index,1);
			esStorage.set('events', allEvents);
			Notification.success('Appointment has been removed');
		}

		function _init(){
			allEvents = esStorage.get('events') || [];
		}

		_init();

		return {
			getByDay: _getEventsByDay,
			getById: 	_getEventById,
			add: 			_addEvent,
			remove: 	_removeEvent,
			update: 	_updateEvent
		}
	}

	esEventService.$inject = ['moment', 'esStorage', 'Notification'];