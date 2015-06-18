(function() {

	angular.module('servermonService.test1', [])
		.factory('serviceTest1', serviceTest1);

	function serviceTest1() {
		return 'serviceTest1';
	}

})();