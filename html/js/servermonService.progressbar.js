(function() {

	angular.module('servermonService.progressbar', [])
		.factory('ProgressBar', ProgressBar);



		// todo 抽离出公用
		function ProgressBar() {
			return {
				start: function() {

				},
				done: function() {

				}
			};
		}
		

})();