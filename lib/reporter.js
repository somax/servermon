'use strict';

var log = require('./log'),
	storage = require('./reporter-storage');


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
				fn(data, next)
			} catch (err) {
				log.err('[Reporter Middleware Error]',err,data,fn)
				next()
			}
		}

		this.stack[0](data, next)
	}

	_reporter.use = function (fn) {
		this.stack.push(fn);
		return this;
	}

}


module.exports = reporter;