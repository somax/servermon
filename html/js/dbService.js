(function() {
	angular.module('DbService', [])
		.service('LogsDb', ['$http',LogsDb]);

	function LogsDb($http) {
		return {
			get: function(id,opt) {
				return $http.get('/api/status?q='+id, opt);
			},
			list:function(opt){
				return $http.get('/api/list', opt||{});
			}
		};
	}

})();