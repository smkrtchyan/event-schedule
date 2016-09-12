'use strict';

angular
  .module('esCalendar')
  .component('esCalendar', {
    templateUrl: 'src/modules/es-calendar/es-calendar.template.html',
    controller: esCalendarController
  });


function esCalendarController($scope, $interval, moment, Notification, esEvent, NOTIFY) {
  var _self = this,
    _today = new moment(),
    _currentWeek = _today.week(),
    _notifyInterval;


  function _setCurrentWeek(indexOfWeek) {
    _currentWeek = indexOfWeek;
    _self.currentWeek = _currentWeek;
  }

  function _goToWeek(index) {
    var indexOfWeek = _currentWeek + index;
    _setCurrentWeek(indexOfWeek);
  }

  function _notifyOnCommingEvents() {
  	var todayEvents = esEvent.getByDay(moment()),
        upcomingEvents = [],
        message = '';

      angular.forEach(todayEvents, function(event, value) {
        var leftTime = moment(event.start).diff(moment(), 'minutes', true);

        if (leftTime >= 0 && leftTime <= 16) {
          upcomingEvents.push(event);
        }
      });

      if (upcomingEvents.length) {
        $scope.upcomingEvents = upcomingEvents;

        Notification.success({
          title: 'Upcoming events',
          message: message,
          templateUrl: "src/modules/es-calendar/es-calendar-notify.template.html",
          scope: $scope
        });
      }
  }

  _self.$onInit = function() {
    _notifyInterval = $interval(_notifyOnCommingEvents, NOTIFY.interval);
  }

  _self.$onDestroy = function() {
    $interval.cancel(_notifyInterval);
  }

  _self.today = _today;
  _self.currentWeek = _currentWeek;
  _self.goToWeek = _goToWeek;
}

esCalendarController.$inject =['$scope', '$interval', 'moment', 'Notification', 'esEvent', 'NOTIFY'];


