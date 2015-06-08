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
};

var next = function() {};

// 没有正确返回
describe('reporter_mailer', function() {
	this.timeout(5000);
	describe('send mail (wait 3000ms...)', function() {
		it('should successful', function(done) {
			reporter_mailer(testData, next);
    		setTimeout(done, 3000);
		});

	});
});

