(function() {

	var modules = [
		'servermonService.test1',
		'servermonService.test2'
	];

	loadJS(modules).then(function() {

		function serviceTest(serviceTest2) {
			return function() {
				return 'serviceTest'+ serviceTest2;
			};
		}

		angular.module('servermonService', modules)
			.factory('serviceTest', serviceTest);
	});

})();