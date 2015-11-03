(function(global) {
	'use strict';

	var app = global.servermonApp = global.servermonApp || {};

	var __appname = app.appname = 'servermonApp';

	var modules = [
		// 'servermon',
		// 'DbService',
		'servermonService',
		// 'servermonService.util',
		// 'servermonService.progressbar',
		'servermonCtrl',
		'jk.echarts'
	];

	loadJS(modules)
		.then(tryMaterial) // todo 测试功能用,完成后删除
		.then(init)
		.then(bootstrap);

	/**
	 * 初始化
	 */
	function init() {
		console.info(__appname + ' init');

		angular.module(__appname, ['ngMaterial', 'tryMaterial'].concat(modules))
			.config(Config);

		/**
		 * angular 全局配置
		 * @param {service} $mdThemingProvider
		 * @param {service} $mdIconProvider
		 */
		function Config($mdThemingProvider, $mdIconProvider, $httpProvider) {


			$mdIconProvider
				.defaultIconSet("./assets/svg/avatars.svg", 128)
				.icon("menu", "./assets/svg/menu.svg", 24)
				.icon("share", "./assets/svg/share.svg", 24)
				.icon("pc", "./assets/svg/pc.svg", 24)
				.icon("cached", "./assets/svg/ic_cached_white_24px.svg", 24)
				.icon("file_download", "./assets/svg/ic_file_download_black_24px.svg", 24)
				.icon("pin", "./assets/svg/pin_white_24px.svg", 24)
				.icon("pin_down", "./assets/svg/pin_down_white_24px.svg", 24)
			// .icon("google_plus", "./assets/svg/google_plus.svg", 512)
			// .icon("hangouts", "./assets/svg/hangouts.svg", 512)
			// .icon("twitter", "./assets/svg/twitter.svg", 512)
			// .icon("phone", "./assets/svg/phone.svg", 512)
			;

			$mdThemingProvider.theme('default')
			// .primaryPalette('brown')
			.accentPalette('red');

			window.httpProvider = $httpProvider;

			function testInterceptors($q,$rootScope) {
			  return {
			  	request: function(config) {
			       console.log('-=-=-=',config);

			       var def = $q.defer();
			       def.promise.then(function(){alert('okok')},function(){alert('errrrrr')})
			       $rootScope.$emit('test',def,config);
			       window.config = config;
			       window.def = def;

			       return config;
			    },
			    // response: function(response) {

			    //    return response;
			    // }
			  };
			}
			testInterceptors.$inject = ['$q','$rootScope'];

			$httpProvider.interceptors.push(testInterceptors);



		}
		Config.$inject = ['$mdThemingProvider', '$mdIconProvider','$httpProvider'];

	}

	/**
	 * 启动 Angular 应用
	 */
	function bootstrap() {
		console.info(__appname + ' bootstrap');

		angular.element(document).ready(function() {
			angular.bootstrap(document, [__appname],{ strictDi:true});
			console.info(__appname + ' ready');
		});
	}



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

})(window);