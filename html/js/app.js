
(function (global) {
	'use strict';

	var app = global.servermonApp = global.servermonApp || {}; 

	var __appname = app.appname = 'servermonApp';

	var modules = [
		'servermon',
		'servermonService',
		'servermonCtrl',
		'DbService',
		'jk.echarts'
	];

	loadJS(modules)
		.then(tryMaterial) // todo 测试功能用,完成后删除
		.then(init)
		.then(bootstrap);

	/**
	 * 初始化
	 * @return {[type]} [description]
	 */
	function init() {
		console.info(__appname + ' init');

		angular.module(__appname, ['ngMaterial','tryMaterial'].concat(modules))
			.config(Config)
			.controller('MainCtrl', MainCtrl)
			.factory('ProgressBar',ProgressBar)
			.filter('memsize',memsize)
			.filter('timeFormat',timeFormat);


		/**
		 * memsize 
		 * @return {filter} 返回格式化后的内存数据
		 */
		function memsize() {
				return function(oSize){
					return Math.round(oSize / 10737418.24) / 100;
				};
		}

		/**
		 * 格式化时间
		 * @return {string}
		 */
		function timeFormat(){
			return function (v) {
				var r;
				var S =1000,
					M = 60 * S,
					H = 60 * M,
					D = H * 24;

				function _parse(v,m,n){
					return parseInt(v%m/n);
				}
				function ms(t) {
					return _result(_parse(t,S,1),'毫秒');
				}
				function s(t){
					return _result(_parse(t,M,S),'秒');
				}
				function m(t){
					return _result(_parse(t,H,M),'分钟');
				}
				function h(t){
					return _result(_parse(t,D,H),'小时');
				}
				function d (t) {
					return _result(_parse(t,Infinity,D),'天');
				}
				function _result(v,u){
					return (v) ? v + ' ' + u + ' ' : '';
				}
                return d(v) + h(v) + m(v) + s(v) + ms(v) ;
            };
		}

		// todo 抽离出公用
		function ProgressBar(){
			return {
				start:function () {
					
				},
				done:function () {
					
				}
			};
		}


		/**
		 * angular 全局配置
		 * @param {[type]} $mdThemingProvider [description]
		 * @param {[type]} $mdIconProvider    [description]
		 */
		function Config($mdThemingProvider, $mdIconProvider) {


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
		}

		/**
		 * 主控制器
		 * @param {[type]} $mdSidenav [description]
		 * @param {[type]} LogsDb     [description]
		 * @param {[type]} $q         [description]
		 * @param {[type]} $scope     [description]
		 * @param {[type]} $timeout   [description]
		 * @param {[type]} $interval  [description]
		 */
		function MainCtrl( $mdSidenav, LogsDb, $q,$http,$scope,$timeout,$interval,$mdDialog) {
			var mc = this;
			// mc.currentId = null;

			mc.isSidenavLocked = false;

			LogsDb.list().then(function(res) {
				mc.serverList = res.data;
				mc.navigateTo(mc.serverList[0]);
			});

			mc.toggleLeft = function() {
				$mdSidenav('left').toggle();
			};

			$scope.settings = mc.settings = {
                autoFreash: {
                    name: '自动刷新',
                    enabled: true,
                },
                freashInterval: {
                    name: '刷新间隔',
                    value: 30000,
                    select: [5000, 15000, 30000,60000,300000]
                }
			};

			// 自动刷新数据
			var freashTime;
			function freashData() {
				console.log('freashData...');
				mc.navigateTo(mc.currentId,null,true);

				if(mc.settings.autoFreash.enabled){
					$timeout.cancel(freashTime);
					freashTime = $timeout(function () {
						freashData();
					},mc.settings.freashInterval.value);
				}
			}
			mc.freashData = freashData;

			$scope.$watch('settings.autoFreash.enabled',function (val) {
				if(val){
					freashData();
				}else{
					$timeout.cancel(freashTime);
					console.info('auto freash closed');
				}
			});
			// $scope.$watch('settings.freashInterval',function (val) {
			// 	if(val){
			// 		freashData();
			// 	}
			// });

			// 切换被监控机器
			var canceller,cancelTime;
			mc.navigateTo = function(navToName, event, noCache) {

				if(!navToName){
					return;
				}

				if(canceller){
					canceller.resolve();
				}
				canceller = $q.defer();

				LogsDb.get(navToName,{timeout:canceller.promise,cache: !noCache })
				.success(function(data, status, headers, config) {
					console.log('success:',data);
					mc.data = data;

					var _xAxis=[],seriesData={},_mp=[],
						_loadavg1=[],_loadavg5=[],_loadavg15=[];
					var _data = data.data;


					for (var i = _data.length - 1; i >= 0; i--) {
						var _d = _data[i].data;
						_xAxis.push(_data[i].t);
						_mp.push(Math.round(100 - _d.mp));
						_loadavg1.push(_d.loadavg[0]);
						_loadavg5.push(_d.loadavg[1]);
						_loadavg15.push(_d.loadavg[2]);
					}

					var _cpuNum = data.os.cpus.length;
					mc.option = { 
						title:{text:navToName},
						xAxis:[{
							data :_xAxis
						}],
						// yAxis: [{
						// 	max:_cpuNum * 2 + 0.1
						// }],
						series:[
							{data : _mp},
							{data : _loadavg1},
							{data : _loadavg5},
							{data : _loadavg15},
							{data :[_cpuNum],
							 markLine: {
								data: [{
									type:'max',
									name: '满负荷参考线'
								}]
							}}
						]
					};	

				mc.progressVal = 100;

				})
				.error(function(data, status, headers, config){

					console.error(arguments);
					mc.settings.autoFreash.enabled = false;
					mc.progressShow = false;
					$interval.cancel(cancelTime);

					$mdDialog
					        .show( $mdDialog.alert({
						        title: '哎哟',
						        content:(status===0)? '网络连接中断了！': '无法从服务器获取数据了!',
						        ok: '知道了'
						      }) );

				});

				console.log(navToName,event);
				// $mdSidenav('left').close();

				mc.currentId = navToName;

				// 进度条
				mc.progressVal = 1;
				
				$timeout(function () {
					if(mc.progressVal<100){
						mc.progressShow = true;

						cancelTime = $interval(function () {
							if(mc.progressVal>=100){
								$interval.cancel(cancelTime);
								cancelTime = null;
								$timeout(function(){mc.progressShow = false;},300);
							}else{
								mc.progressVal += (mc.progressVal<80)?2:0.1;
							}

						},100);
					}
				});

			};

			
			// mc.download = function (url) {
			// 	$http.get(url);
			// };

			// chart options
			mc.option = {
					title: {
						text: 'test',
						subtext: 'ServerMon',
						x:5
					},
					tooltip: {
						trigger: 'axis'
					},
					dataZoom:{
						show:true,
						realtime:false
					},
					legend: {
						data: ['Mem%', 'LoadAvg1','LoadAvg5','LoadAvg15','LoadMax'],
						y:'50'
					},
					toolbox: {
						show: true,
						feature: {
							// mark: {
							// 	show: true
							// },
							dataView: {
								show: true,
								readOnly: false
							},
							magicType: {
								show: true,
								type: ['line', 'bar']
							},
							restore: {
								show: true
							},
							saveAsImage: {
								show: true
							}
						}
					},
					calculable: true,
					xAxis: [{
						type: 'category',
						boundaryGap: false,
						data: [0]
					}],
					yAxis: [{
						type: 'value',
						name: 'LoadAvg',
						axisLabel: {
							formatter: '{value}'
						}
					},{
						type: 'value',
						name: 'Mem',
						max:100
					}],
					grid:{
						y:100,
					},
					series: [{
						name: 'Mem%',
						type: 'line',
						yAxisIndex:1,
						data: [],
						symbol:'none',
						itemStyle: {normal: {areaStyle: {type: 'default'}}},
						markPoint: {
							data: [{
								type: 'max',
								name: '最大值'
							}, {
								type: 'min',
								name: '最小值'
							}]
						},
						// markLine: {
						// 	data: [{
						// 		type: 'average',
						// 		name: '平均值'
						// 	}]
						// }
					}, {
						name: 'LoadAvg1',
						type: 'line',
						data: [],
						symbol:'none',
						itemStyle: {normal: {areaStyle: {type: 'default'}}},
						// markPoint: {
						// 	data: [{
						// 		type: 'max',
						// 		name: '最大值'
						// 	}]
						// },
						// markLine: {
						// 	data: [{
						// 		type: 'average',
						// 		name: '平均值'
						// 	}]
						// }
					}, {
						name: 'LoadAvg5',
						type: 'line',
						data: [],
						symbol:'none',
						  itemStyle: {normal: {areaStyle: {type: 'default'}}},
						// markPoint: {
						// 	data: [{
						// 		name: '周最低',
						// 		value: -2,
						// 		xAxis: 1,
						// 		yAxis: -1.5
						// 	}]
						// },
						// markLine: {
						// 	data: [{
						// 		type: 'average',
						// 		name: '平均值'
						// 	}]
						// }
					}, {
						name: 'LoadAvg15',
						type: 'line',
						data: [],
						symbol:'none',
						itemStyle: {normal: {areaStyle: {type: 'default'}}},
						// markPoint: {
						// 	data: [{
						// 		name: '周最低',
						// 		value: -2,
						// 		xAxis: 1,
						// 		yAxis: -1.5
						// 	}]
						// },
						// markLine: {
						// 	data: [{
						// 		type: 'average',
						// 		name: '平均值'
						// 	}]
						// }
					},{
						name: 'LoadMax',
						type: 'line',
						data: [],
						symbol:'none'

						// itemStyle: {normal: {areaStyle: {type: 'default'}}},

					}
					]
				};
		}

		

	}


	/**
	 * 启动应用
	 * @return {[type]} [description]
	 */
	function bootstrap() {
		console.info(__appname + ' bootstrap');

		angular.element(document).ready(function() {
			angular.bootstrap(document, [__appname]);
			console.info(__appname + ' ready');
		});
	}





	/**
	 * todo 测试功能用,完成后删除
	 */
	function tryMaterial() {
		angular.module('tryMaterial', [])
			.controller('tryCtrl', function($scope) {
				
			});
	}

})(window);