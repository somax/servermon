(function() {

	angular.module('servermonService.util', [])
		.filter('memsize', memsize)
		.filter('timeFormat', timeFormat);

		/**
		 * 格式化内存
		 * @return {filter} 返回格式化后的内存数据
		 */
		function memsize() {
			return function(oSize) {
				return Math.round(oSize / 10737418.24) / 100;
			};
		}
		
		/**
		 * 格式化时间
		 * @return {string}
		 */
		function timeFormat() {
			return function(v) {
				var r;
				var S = 1000,
					M = 60 * S,
					H = 60 * M,
					D = H * 24;

				function _parse(v, m, n) {
					return parseInt(v % m / n);
				}

				function ms(t) {
					return _result(_parse(t, S, 1), '毫秒');
				}

				function s(t) {
					return _result(_parse(t, M, S), '秒');
				}

				function m(t) {
					return _result(_parse(t, H, M), '分钟');
				}

				function h(t) {
					return _result(_parse(t, D, H), '小时');
				}

				function d(t) {
					return _result(_parse(t, Infinity, D), '天');
				}

				function _result(v, u) {
					return (v) ? v + ' ' + u + ' ' : '';
				}
				return d(v) + h(v) + m(v) + s(v) + ms(v);
			};
		}

})();