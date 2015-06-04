var util = require('util'),
	chalk = require('chalk');

var color = {};

var log = function() {
	_log('log', arguments);
}

var alias = 'log info debug warn err'.split(' ');
var colors = 'white green cyan yellow black.bgRed'.split(' ');

for (var i = 0; i < alias.length; i++) {
	var a = alias[i];
	color[a] = eval('chalk.' + colors[i]);
	log[a] = (function(_a) {
		return function() {
			_log(_a, arguments)
		}
	})(a)
}

function _log(type, args) {
	args = Array.prototype.slice.call(args);
	args.unshift('['+type.toUpperCase()+']');
	for (var i = 0; i < args.length; i++) {
		var arg = args[i];
		if(typeof arg === 'object'){
			arg = JSON.stringify(arg);
		}
		args[i] = color[type](arg)
	};

	util.log.apply(util,args);
	console.log('');
}

module.exports = log;