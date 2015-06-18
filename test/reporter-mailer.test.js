function checker(data) {
	return true;
}
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

var storage = require('../lib/storage');

var reporter_mailer = require('../lib/reporter-mailer')(checker);
var assert = require("assert");


var next = function() {};

// 没有正确返回
describe('reporter_mailer', function() {
	this.timeout(10000);
	beforeEach(function(done) {
		var status = storage.get('status') || {};

		status.testId = {
			os: {hostname:'test'},
			data: [testData,testData]
		};

		storage.set('status', status);
		done();
	});
	describe('send mail (wait...)', function() {
		it('should successful', function(done) {
			reporter_mailer(testData, next, function(err,info) {
				if(!err){
					done();
				}
			});
		});

	});
});