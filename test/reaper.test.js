var Reaper = require('../lib/reaper'),
	assert = require('assert');
var reaper = new Reaper('testReaper');

var result,resultAll;
describe('Reaper',function(){
	beforeEach(function(done){
		result = reaper.reap();
		resultAll = reaper.reap('all');
		done();
	});

	describe('reap',function () {
		it('id should be “testReaper”',function(){
			assert.equal(result.id,'testReaper');
		});
		it('reap should be no os',function(){
			assert.equal(result.hasOwnProperty('os'),false);
		});
		it('reap all should be has os',function(){
			assert.equal(resultAll.hasOwnProperty('os'),true);
		});

	});
});
