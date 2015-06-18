var util = require('util'),
	chalk = require('chalk');

var color = {};
var isDev = process.env.NODE_ENV === 'dev';

var log = function() {
	_log('log', arguments);
};

var alias = 'log info debug warn err'.split(' ');
var colors = 'inverse green cyan yellow black.bgRed'.split(' ');

for (var i = 0; i < alias.length; i++) {
	var a = alias[i];
	color[a] = eval('chalk.' + colors[i]);
	log[a] = (function(_a) {
		return function() {
			_log(_a, arguments);
		};
	})(a);
}

function _log(type, args) {
	if(type === 'debug' && !isDev){
		return;
	}
	args = Array.prototype.slice.call(args);
	args.unshift('[' + type.toUpperCase() + ']');

	args[0] = color[type](args[0]);

	util.log.apply(util, args);
	console.log('');
}

module.exports = log;