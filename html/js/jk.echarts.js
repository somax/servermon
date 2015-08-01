(function() {
    'use strict';
    /**
     *  echarts 相关组件
     *  让 echarts 可以 angular 的方式使用
     *  Last modify 2015.6.15
     *
     *  更多信息参考: http://echarts.baidu.com/doc/doc.html
     *
     *  @example
     *  html:
     *      <div style="height:500px;"
     *          echarts="chartInstance"
     *          option="chartData"
     *          loading="loading"
     *          on="events"
     *          notMerge="true"
     *      ></div>
     *
     *  js:
     *      $http.get('path/to/data').success(function (_data) {
     *          $scope.chartData=EchartsData.pie($scope.pie,_data,pieConf);
     *      });
     *      $scope.loading = {'text':'加载中...'};
     *      $scope.events = {eventName,eventListener}
     */

    angular.module('jk.echarts', [])
        .directive('echarts', echartsDirective);


    function echartsDirective($window) {
        return {
            scope: {
                echarts: '=', //返回echart实例对象，方便直接调用echart API
                option: '=', //传入 echart 的配置与数据
                notMerge: '=', //指定更新opiton是否使用合并的方式
                on: '=', //绑定event回调函数集合，
                loading: '=', //设定 echart loading
                static: '=' //静态模式，适用于不会动态变更数据的场合
            },
            link: function(scope, element, attrs) {

                // 获取echart对象
                // 默认使用 macarons 配色方案
                var _chart = scope.echarts = echarts.init(element[0], 'macarons');
                _chart.name = attrs.echarts;

                // 设置数据
                var unWatchOption = scope.$watch('option', function(_option) {
                    if (_option) {
                        // console.log( scope.echarts,_option);
                        _chart.setOption(_option, scope.notMerge);
                        _chart.hideLoading();
                        if (scope.static) {
                            unWatchOption();
                            unWatchLoading();
                        }
                    }
                });

                // 显示loading
                var unWatchLoading = scope.$watch('loading', function(_isLoading) {
                    if (_isLoading) {
                        _chart.showLoading(_isLoading);
                    } else {
                        _chart.hideLoading();
                    }
                });

                // 自动调整尺寸
                scope.$watch(function() {
                    return element[0].clientWidth + element[0].clientHeight;
                }, function() {
                    _chart.resize();
                });

                // 绑定事件
                if (scope.on) {
                    for (var event in scope.on) {
                        _chart.on(echarts.config.EVENT[event], scope.on[event]);
                    }
                }

                $window.addEventListener('resize', _chart.resize);

                //注销echart控件,清除动画定时器。
                scope.$on('$destroy', function() {
                    _chart.dispose();
                });
            }
        };
    }
    echartsDirective.$inject = ['$window'];

})();