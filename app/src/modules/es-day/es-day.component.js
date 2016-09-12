'use strict';

angular.module('esDay')
  .component('esDay', {
    templateUrl: 'src/modules/es-day/es-day.template.html',
    bindings: {
      today: '<',
      dayOfWeek: '<',
      weekOfYear: '='
    },
    controller: esDayController
  });

function esDayController($scope, $location, Notification, esEvent, moment) {
  var _self = this,
    _currentDay;

  function _setCurrentDate() {
    _currentDay = new moment().week(_self.weekOfYear).weekday(_self.dayOfWeek);
    _self.currentDay = _currentDay;
  }

  function _viewDetails(eventId) {
    $location.path('event/' + eventId);
  }

  function _removeEvent(eventId, index) {
    _self.events.splice(index, 1);
    esEvent.remove(eventId);
  }

  _self.$onInit = function() {
    _setCurrentDate();
    _self.popoverTemplate = 'src/modules/es-day/es-event-popover.template.html';
  }

  $scope.$watch(function() {
    return _self.weekOfYear;
  }, function(newVal, oldVal) {
    _setCurrentDate();
    _self.events = esEvent.getByDay(_self.currentDay);
  });


  _self.viewDetails = _viewDetails;
  _self.removeEvent = _removeEvent;
}

esDayController.$inject = ['$scope', '$location', 'Notification', 'esEvent', 'moment'];
