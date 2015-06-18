(function() {
	angular.module('servermonService.test2', [])
		.factory('serviceTest2', serviceTest2);

	function serviceTest2() {
		return 'serviceTest2';
	}
})();