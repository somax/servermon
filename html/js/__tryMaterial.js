(function() {

	angular.module('__tryMaterial', [])
		.factory('__tryMaterial', tryMaterial);



		/**
		 * todo 测试功能用,完成后删除
		 */
		function tryMaterial() {
			angular.module('tryMaterial', [])
				.run(['$q','$http',function($q,$http){
					window.http = $http;
					window.q = $q;
				}])
				.controller('tryCtrl', ['$scope',function($scope) {

				}]);
		}
		

})();