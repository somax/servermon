(function() {

	var modules = [
		'servermonService.util',
		'servermonService.progressbar'
	];

	loadJS(modules).then(function() {

		angular.module('servermonService', modules);


	});

})();