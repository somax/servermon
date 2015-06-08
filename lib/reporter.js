/**
 * reporter 20150606 maxiaojun<somaxj@163.com>
 * reporter 以中间件的方式运作，本身不会对数据做任何处理 
 * 所有的数据分析处理依赖于 use 进来的中间件
 */
var log = require('./log');

function reporter() {
	var _reporter = this;

	_reporter.stack = [];
	_reporter.index = 0;

	_reporter.report = function(data) {
		log.debug('report >>>', data);

		// var data = data;

		function next() {
			var fn = _reporter.stack[++_reporter.index];

			if (!fn){
				_reporter.index = 0;
				return;
			}

			try {
				fn(data, next);
			} catch (err) {
				log.err('[Reporter Middleware Error]',err,'\n[data:]\n',data,'\n[fn:]\n',fn);
				next();
			}
		}

		this.stack[0](data, next);
	};

	_reporter.use = function (fn) {
		this.stack.push(fn);
		return this;
	};

}


module.exports = reporter;