var reporter_storage = require('../lib/reporter-storage');
var storage = require('../lib/storage');
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


describe('reporter_storage', function() {
	describe(' add testData', function() {
		var status = storage.get('status');

		it('length should be 1', function() {
			reporter_storage(testData, next);
			assert.equal(storage.get('status').testId.data.length, 1)
		})
		it('add data should be success', function() {
			assert.deepEqual(storage.get('status').testId.data[0], testData)
		})

		it('reset data',function () {
			var status = storage.get('status')
			delete status.testId;
			storage.set('status', status);
		})

	})
})