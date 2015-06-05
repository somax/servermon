var Reporter = require('../lib/reporter');
var assert = require("assert");
var reporter = new Reporter();

var _count = 0;
var _data;
reporter.use(function(data, next) {
	data.newData = 'new data'
	_count++;
	console.log('---- from middleware 1 --- ')
	next();

})

reporter.use(function(data, next) {
	GotSomeError;
	next();
})

reporter.use(function(data, next) {
	_count++;
	console.log('---- from middleware 2 --- ')
	console.log(data)
	_data = data
	next();
})

reporter.report({
	data: 'test data'
});

describe('reporter', function() {
	describe('middleware call count', function() {
		it('should be 2', function() {
			assert.equal(_count, 2);
		})
	})
	describe('transport data', function() {
		it('should be "test data"', function() {
			assert.equal(_data.data, 'test data');
		})
	})
	describe('add newData', function() {
		it('should be "new data"', function() {
			assert.equal(_data.newData, 'new data');
		})
	})
})