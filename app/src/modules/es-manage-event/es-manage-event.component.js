'use strict';

angular.module('esManageEvent')
  .component('esManageEvent', {
    templateUrl: 'src/modules/es-manage-event/es-manage-event.template.html',
    controller: esManageEventController
  });

function esManageEventController($scope, $routeParams, $location, esEvent, moment) {
  var _self = this,
    _defaults = {
      name: 'Untitled event'
    };

  _self.event = {};
  _self.action = {};
  _self.eventId = $routeParams.eventId;


  function _isValidForm() {
    var isValid = false;

    if (!!(_self.event.start)) {
      if (_self.event.isAllDay) {
        isValid = true;
      } else if (!!(_self.event.end) && moment(_self.event.end).isAfter(_self.event.start)) {
        isValid = true;
      }
    }
    return isValid;
  }


  $scope.$watchCollection(function() {
      return _self.event },
    function(newVal, oldVal) {
      _self.isValid = _isValidForm();
    })


  function _resetEvent() {
    _self.event = {}
  }

  function _addEvent() {
    var _event = {
      uid: +new Date(),
      name: _self.event.name || _defaults.name,
      start: +new Date(_self.event.start),
      end: !!(_self.event.end) ? +new Date(_self.event.end) : null,
      isAllDay: !!(_self.event.isAllDay),
      desc: _self.event.desc || null
    }

    esEvent.add(_event);
    $location.path('calendar');
  }

  function _updateEvent() {
    var _event = {
      uid: +new Date(),
      name: _self.event.name || _defaults.name,
      start: +new Date(_self.event.start),
      end: +new Date(_self.event.end),
      isAllDay: !!(_self.event.isAllDay),
      desc: _self.event.desc || null
    }

    esEvent.update(_self.action.eventId, _event);
    $location.path('calendar');
  }

  function _back() {
    _self.event = _self.action.eventOldValue || {};
    $location.path('calendar');

  }

  function _startDateBeforeRender($dates, $view) {
    var selectedDate;

    if (_self.event.end) {
      selectedDate = moment(_self.event.end);

      $dates.filter(function(date) {
        return date.localDateValue() >= selectedDate.valueOf()
      }).forEach(function(date) {
        date.selectable = false;
      })
    }

    _disableOldDates($dates, $view);
  }

  function _endDateBeforeRender($dates, $view) {
    var selectedDate;

    if (_self.event.start) {
      selectedDate = moment(_self.event.start).subtract(1, $view).add(1, 'minute');

      $dates.filter(function(date) {
        return date.localDateValue() <= selectedDate.valueOf()
      }).forEach(function(date) {
        date.selectable = false;
      })
    }

    _disableOldDates($dates, $view);
  }

  function _startDateOnSetTime() {
    $scope.$broadcast('start-date-changed');
  }

  function _endDateOnSetTime() {
    $scope.$broadcast('end-date-changed');
  }

  function _disableOldDates(dates, view) {
    var activeDate,
        now = moment(),
        minuteRange = 1;

    dates.filter(function(date) {
      activeDate = moment(date.localDateValue());

      if (view == 'day') {
        activeDate.hour(now.hour()).minute(now.minute() + minuteRange);
      } else if (view == 'hour') {
        activeDate.minute(now.minute() + minuteRange)
      } else if (view == 'month') {
        activeDate.date(now.date()).hour(now.hour()).minute(now.minute() + minuteRange);
      } else if (view === 'year') {
        activeDate.month(now.month()).date(now.date()).hour(now.hour()).minute(now.minute() + minuteRange);
      }

      return activeDate.isBefore(now);

    }).forEach(function(date) {
      date.selectable = false;
    })
  }

  function _init() {
    var selectedEventId = +$routeParams.eventId;

    if (!!selectedEventId) {

      _self.action = {
        type: 'edit',
        title: 'Update event',
        eventId: selectedEventId,
        eventOldValue: {}
      };

      angular.extend(_self.action.eventOldValue, esEvent.getById(selectedEventId).event);
      _self.event = _self.action.eventOldValue;
    } else {
      _self.action.type = 'add';
      _self.action.title = "Add new event";
      _resetEvent();
    }
  }

  _self.$onInit = function() {
    _init();
  }

  // Bindable methods
  _self.addEvent = _addEvent;
  _self.updateEvent = _updateEvent;
  _self.resetEvent = _resetEvent;
  _self.back = _back;
  _self.startDateBeforeRender = _startDateBeforeRender;
  _self.endDateBeforeRender = _endDateBeforeRender
  _self.endDateOnSetTime = _endDateOnSetTime
  _self.startDateOnSetTime = _startDateOnSetTime
}

esManageEventController.$inject = ['$scope', '$routeParams', '$location', 'esEvent', 'moment'];
