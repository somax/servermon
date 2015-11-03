(function(angular) {

	var modules = ['DbService'];
	loadJS(modules).then(function(){

		angular.module('servermonCtrl',modules)
			.controller('MainCtrl', MainCtrl);

			/**
			 * 主控制器
			 * @param {service} $mdSidenav
			 * @param {service} LogsDb    日志数据源
			 * @param {service} $q
			 * @param {service} $scope
			 * @param {service} $timeout
			 * @param {service} $interval
			 */
			function MainCtrl($mdSidenav, LogsDb, $q, $rootScope,$scope, $timeout, $interval, $mdDialog) {



				$rootScope.$on('test',function(e,def,config){
					console.log('>>on test>>',e,def,config);
				});

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
						select: [5000, 15000, 30000, 60000, 300000]
					}
				};

				// 自动刷新数据
				var freashTime;

				function freashData() {
					console.log('freashData...');
					mc.navigateTo(mc.currentId, null, true);

					if (mc.settings.autoFreash.enabled) {
						$timeout.cancel(freashTime);
						freashTime = $timeout(function() {
							freashData();
						}, mc.settings.freashInterval.value);
					}
				}
				mc.freashData = freashData;

				$scope.$watch('settings.autoFreash.enabled', function(val) {
					if (val) {
						freashData();
					} else {
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
				var canceller, cancelTime;
				mc.navigateTo = function(navToName, event, noCache) {

					if (!navToName) {
						return;
					}

					if (canceller) {
						canceller.resolve();
					}
					canceller = $q.defer();

					LogsDb.get(navToName, {
						timeout: canceller.promise,
						cache: !noCache
					}).success(function(data, status, headers, config) {
						console.debug('Logs load success:', data);
						mc.data = data;

						// 解析数据给图表用
						var _xAxis = [],
							seriesData = {},
							_mp = [],
							_loadavg1 = [],
							_loadavg5 = [],
							_loadavg15 = [];
						var _data = data.data;

						for (var i = _data.length - 1; i >= 0; i--) {
							var _d = _data[i].data;
							_xAxis.unshift(_data[i].t);
							_mp.unshift(Math.round(100 - _d.mp));
							_loadavg1.unshift(_d.loadavg[0]);
							_loadavg5.unshift(_d.loadavg[1]);
							_loadavg15.unshift(_d.loadavg[2]);
						}

						var _cpuNum = data.os.cpus.length;

						var opt = angular.copy(preOption);
						opt.title.text = navToName;
						opt.xAxis[0].data = _xAxis;
						opt.series[0].data = _mp;
						opt.series[1].data = _loadavg1;
						opt.series[2].data = _loadavg5;
						opt.series[3].data = _loadavg15;
						opt.series[4].data = [_cpuNum];

						mc.option = opt;

						mc.progressVal = 100;

					})
						.error(function(data, status, headers, config) {

							console.error(arguments);
							mc.settings.autoFreash.enabled = false;
							mc.progressShow = false;
							$interval.cancel(cancelTime);

							$mdDialog
								.show($mdDialog.alert({
									title: '哎哟',
									content: (status === 0) ? '网络连接中断了！' : '无法从服务器获取数据了!',
									ok: '知道了'
								}));

						});

					console.log(navToName, event);
					// $mdSidenav('left').close();

					mc.currentId = navToName;

					// 进度条
					mc.progressVal = 1;

					// 进度条动画控制
					$timeout(function() {
						if (mc.progressVal < 100) {
							mc.progressShow = true;

							cancelTime = $interval(function() {
								if (mc.progressVal >= 100) {
									$interval.cancel(cancelTime);
									cancelTime = null;
									$timeout(function() {
										mc.progressShow = false;
									}, 300);
								} else {
									mc.progressVal += (mc.progressVal < 80) ? 2 : 0.1;
								}

							}, 100);
						}
					});

				};


				// chart options
				var preOption = {
					title: {
						text: '...',
						subtext: 'ServerMon',
						x: 5
					},
					tooltip: {
						trigger: 'axis'
					},
					dataZoom: {
						show: true,
						realtime: false
					},
					legend: {
						data: ['Mem%', 'LoadAvg1', 'LoadAvg5', 'LoadAvg15', 'LoadMax'],
						y: '50'
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
					}, {
						type: 'value',
						name: 'Mem',
						max: 100
					}],
					grid: {
						y: 100,
					},
					series: [{
						name: 'Mem%',
						type: 'line',
						yAxisIndex: 1,
						data: [],
						symbol: 'none',
						itemStyle: {
							normal: {
								areaStyle: {
									type: 'default'
								}
							}
						},
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
						symbol: 'none',
						itemStyle: {
							normal: {
								areaStyle: {
									type: 'default'
								}
							}
						}
					}, {
						name: 'LoadAvg5',
						type: 'line',
						data: [],
						symbol: 'none',
						itemStyle: {
							normal: {
								areaStyle: {
									type: 'default'
								}
							}
						}
					}, {
						name: 'LoadAvg15',
						type: 'line',
						data: [],
						symbol: 'none',
						itemStyle: {
							normal: {
								areaStyle: {
									type: 'default'
								}
							}
						}
					}, {
						name: 'LoadMax',
						type: 'line',
						data: [],
						symbol: 'none',
						markLine: {
									data: [{
										type: 'max',
										name: 'CPU 满负荷参考线'
									}]
								}
						// itemStyle: {normal: {areaStyle: {type: 'default'}}},

					}]
				};

				mc.option = angular.copy(preOption);
			}

			MainCtrl.$inject = ['$mdSidenav', 'LogsDb', '$q', '$rootScope','$scope', '$timeout', '$interval', '$mdDialog'];

	});
	

})(angular);