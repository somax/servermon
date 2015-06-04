var util = require('util');

var log = function () {
	util.log.apply(util,arguments)
}

module.exports = log;