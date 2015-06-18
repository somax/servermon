(function () {
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
    .directive('echarts', function ($window) {
        return{
            scope:{
                echarts:'=',    //返回echart实例对象，方便直接调用echart API
                option:'=',     //传入 echart 的配置与数据
                notMerge:'=',   //指定更新opiton是否使用合并的方式
                on:'=',         //绑定event回调函数集合，
                loading:'=',    //设定 echart loading
                static:'='      //静态模式，适用于不会动态变更数据的场合
            },
            link: function (scope, element, attrs) {

                // 获取echart对象
                // 默认使用 macarons 配色方案
                var _chart = scope.echarts = echarts.init(element[0],'macarons');
                _chart.name = attrs.echarts;

                // 设置数据
                var unWatchOption = scope.$watch('option', function (_option) {
                    if(_option){
                        // console.log( scope.echarts,_option);
                        _chart.setOption(_option,scope.notMerge);
                        _chart.hideLoading();
                        if(scope.static){
                            unWatchOption();
                            unWatchLoading();
                        }
                    }
                });

                // 显示loading
                var unWatchLoading = scope.$watch('loading', function (_isLoading) {
                    if(_isLoading){
                        _chart.showLoading(_isLoading);
                    }else{
                        _chart.hideLoading();
                    }
                });

                // 自动调整尺寸
                scope.$watch(function () {
                    return element[0].clientWidth + element[0].clientHeight;
                }, function () {
                    _chart.resize();
                });

                // 绑定事件
                if(scope.on){
                    for (var event in scope.on) {
                        _chart.on(echarts.config.EVENT[event], scope.on[event]);
                    }
                }

                $window.addEventListener('resize', _chart.resize);

                //注销echart控件,清除动画定时器。
                scope.$on('$destroy', function () {
                    _chart.dispose();
                });
            }
        };
    })
    .factory('EchartsData', function (StringToTime) {
        return {
            //标准型
            parse:function  (option,data,conf) {
                var time,legend=[],serdata=[];
                legend=data.z.data;
                angular.forEach(data.values,function(v,i){
                    var dataFragment={} ;

                    if(conf.hasOwnProperty(v.name)){
                        dataFragment=angular.copy(conf[v.name]);
                        dataFragment.data=v.data;
                    }else{
                        dataFragment= angular.copy(conf['default']);
                        dataFragment.name=v.name;
                        dataFragment.data=v.data;
                    }
                    serdata.push(dataFragment);

                });
                var okoption= angular.copy(option);
                okoption.legend.data=legend;
                okoption.yAxis[0].data=data.x.data;
                okoption.series=serdata;
                return okoption;
            },
            //饼图
            pie:function(option,_data,conf,_date){
//            将数据处理为饼图模式
                //判断是否需要转换时间
                if(_date){
                    _data.x.data=StringToTime( _data.x.data,_date);
                }
                //将数据转换成图表所需格式
                var data=[],y=[];
                angular.forEach(_data.x.data,function(legendv,legendi){
                    data.push({name: legendv, value: _data.values.data[legendi]});
                });


                var Specialdata={},legend=[],Tempdata={'default':[]},serdata=[];
                //判断是否为多圈饼，不是不做多循环
                if(!conf.hasOwnProperty('SpecialType')) {
                    //简单饼图
                    Tempdata={default:[]} ;
                    angular.forEach(data,function(v,i){
                        Tempdata.default.push(v);
                        legend.push(v.name);
                    });
                    var dataFragment ;
                    dataFragment=angular.copy(conf['default']);
                    dataFragment.data= Tempdata['default'];
                    serdata.push(dataFragment);

                }
                else{
                    //多圈饼图
                    //初始临时容器和区分数据为那个圈的
                    angular.forEach( conf.SpecialType,function(v,i){
                        angular.forEach( v,function(name,type){
                            Specialdata[name]=i;
                        });
                        Tempdata[i]=[];
                    });
                    //数据获取后台数据编译进入临时的容器Tempdata，同时生成 legend
                    angular.forEach(data,function(v,i){

                        if(!Specialdata.hasOwnProperty(v.name)){
                            Tempdata.default.push(v);
                        }else{
                            Tempdata[Specialdata[v.name]].push(v);

                        }
                        legend.push(v.name);
                    });
//               将临时的容器Tempdata 转为片段准备放入okoption
                    angular.forEach( Tempdata,function(v,i) {
                        var dataFragment ;
//                console.log(v);
                        if(v.length!==0){
                            dataFragment=angular.copy(conf[i]);
                            dataFragment.data= Tempdata[i];
                            serdata.push(dataFragment);

                        }
                        else{
                            delete(Tempdata[i]);
                        }
                    }) ;
                }
                var okoption= angular.copy(option);
                okoption.legend.data=legend;
                okoption.series=serdata;
                return okoption ;
            }
        };
    });

})();

