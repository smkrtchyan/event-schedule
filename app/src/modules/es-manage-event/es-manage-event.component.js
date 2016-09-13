'use strict';

angular.module('esManageEvent')
  .component('esManageEvent', {
    templateUrl: 'src/modules/es-manage-event/es-manage-event.template.html',
    controller: esManageEventController
  });

  function esManageEventController ($scope, $routeParams, $location, esEvent, moment) {
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


      $scope.$watchCollection(function() { return _self.event }, 
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
          end: +new Date(_self.event.end),
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

      function _beforeTimePick($dates, $view) {
        var i, activeDate, now = moment();

        for (i = 0; i < $dates.length; i++) {

          activeDate = moment($dates[i].localDateValue());

          if($view == 'day'){
            activeDate.hour(now.hour()).minute(now.minute() + 1);
          }
          else if($view == 'hour'){
            activeDate.minute(now.minute() + 1)
          }

          if (activeDate.isBefore( now )) {
            $dates[i].selectable = false;
          }

          // console.log('view', $view);
          // console.log('utc', moment($dates[i].utcDateValue).utc().locale(), '-', activeDate.locale());
          // console.log('std', moment($dates[i].utcDateValue).format());
          // console.log('now', now.format() );
          // console.log('act', activeDate.format());
          // console.log('dat', moment($dates[i].localDateValue()).format() );
          // console.log('--------------', $dates[i].selectable);
        }
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
      _self.beforeTimePick = _beforeTimePick;
  }

  esManageEventController.$inject = ['$scope', '$routeParams', '$location', 'esEvent', 'moment'];
