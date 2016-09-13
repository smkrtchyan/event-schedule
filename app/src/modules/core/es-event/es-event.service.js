'use strict';

angular.module('esCore.event')
	.factory('esEvent', esEventService);

	function esEventService(moment, esStorage, Notification) {
			var allEvents;

		function _sortByStartDates(a,b){
				if(a.start < b.start)
					return -1;
				else if( a.start > b.start) {
					return 1;
				}
				return 0;
		}

		function _getEventsByDay(currentDay){
			var todayEvents; 

			todayEvents = allEvents.filter(function( element, index, array ){
				var startDate = new moment(element.start);
				return currentDay.isSame(startDate, 'day');
			})
			todayEvents.sort(_sortByStartDates);
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
			Notification.success('<i class="fa fa-info-circle"></i> Event has been created');
		}

		function _updateEvent(id, data){
			var index = _getEventById(id).index;
			allEvents[index] = data;
			esStorage.set('events', allEvents);
			Notification.success('<i class="fa fa-info-circle"></i> Event has been updated');
		}

		function _removeEvent(id){
			var index = _getEventById(id).index;
			allEvents.splice(index,1);
			esStorage.set('events', allEvents);
			Notification.success('<i class="fa fa-info-circle"></i> Event has been removed');
		}

		function _getUpcomingEvents(){
			var upcomingEvents = _getEventsByDay(moment());	        

	        return upcomingEvents.filter(function(event){
	        	var leftTime = moment(event.start).diff(moment(), 'minutes', true);
	        	return (leftTime >= 0 && leftTime <= 16);
	        })
	        
		}

		function _notifyOnCommingEvents(scope){
				upcomingEvents = _getUpcomingEvents();

				if(upcomingEvents.length){
					scope.upcomingEvents = upcomingEvents;

	        Notification.success({
	          title: 'Upcoming events',
	          message: '',
	          templateUrl: "src/modules/es-calendar/es-calendar-notify.template.html",
	          scope: scope
	        });
	      }
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
			update: 	_updateEvent,
			getUpcoming: _getUpcomingEvents,
			notifyOnUpcoming : _notifyOnCommingEvents
		}
	}

	esEventService.$inject = ['moment', 'esStorage', 'Notification'];