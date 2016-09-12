'use strict';

angular.module('esCore.storage')
  .factory('esStorage', esStorageService);

  function esStorageService() {
  	function _getData(key) {
      var dataList = localStorage.getItem(key);
      return !!dataList && JSON.parse(dataList);
    }

    function _setData(key, data) {
      localStorage.setItem(key, JSON.stringify(data));
    }

    return {
      get: _getData,
      set: _setData
    }
  }
