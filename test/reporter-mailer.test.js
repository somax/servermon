var reporter_mailer = require('../lib/reporter-mailer');
var assert = require("assert");



var testData = {
	"t": "2015-06-05T04:59:23.860Z",
	"id": "testId",
	"data": {
		"mf": 46206976,
		"mt": 8589934592,
		"cpu": [{
			"user": 55655940,
			"nice": 0,
			"sys": 58057100,
			"idle": 355761700,
			"irq": 0
		}]
	}
}

var next = function() {};

describe('reporter_mailer', function() {
	this.timeout(2000);
	describe('send mail', function() {
		it('should successful', function(done) {
			reporter_mailer(testData, next);
    		setTimeout(done, 1000);
		})

	})
})

