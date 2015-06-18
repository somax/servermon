var checker = require('../lib/checker'),
	storage = require('../lib/storage'),
    assert = require('assert');

var testDataOk = {
    "t": "2015-06-05T04:59:23.860Z",
    "id": "testId",
    "data": {
        "mf": 4620697600,
        "mp": 31.11,
        "loadavg": [0.3, 0.6, 0.6],
        "cpu": [{
            "user": 55655940,
            "nice": 0,
            "sys": 58057100,
            "idle": 355761700,
            "irq": 0
        }]
    }
};
var testDataMemOver = {
    "t": "2015-06-05T04:59:23.860Z",
    "id": "testId",
    "data": {
        "mf": 4620697600,
        "mp": 1.11,
        "loadavg": [0.6, 0.6, 0.6],
        "cpu": [{
            "user": 55655940,
            "nice": 0,
            "sys": 58057100,
            "idle": 355761700,
            "irq": 0
        }]
    }
};
var testDataLoadavgOver = {
    "t": "2015-06-05T04:59:23.860Z",
    "id": "testId",
    "data": {
        "mf": 4620697600,
        "mp": 31.11,
        "loadavg": [0.9, 0.6, 0.9],
        "cpu": [{
            "user": 55655940,
            "nice": 0,
            "sys": 58057100,
            "idle": 355761700,
            "irq": 0
        }]
    }
};
var testDataMemOverLoadavgOver = {
    "t": "2015-06-05T04:59:23.860Z",
    "id": "testId",
    "data": {
        "mf": 4620697600,
        "mp": 1.11,
        "loadavg": [0.9, 0.6, 0.9],
        "cpu": [{
            "user": 55655940,
            "nice": 0,
            "sys": 58057100,
            "idle": 355761700,
            "irq": 0
        }]
    }
};

var _wc = storage.get('warningCount');
function resetCount () {
	_wc.testId = 3;
	storage.set('warningCount',_wc);
}


describe('checker.js', function() {
    describe('testDataOk', function() {
        it('should return false', function() {
        	resetCount();
            assert.equal(checker(testDataOk), false);
        });
    });
    describe('testDataMemOver', function() {
        it('should return true', function() {
        	resetCount();
            assert.equal(checker(testDataMemOver), true);
        });
    });
    describe('testDataLoadavgOver', function() {
        it('should return true', function() {
        	resetCount();
            assert.equal(checker(testDataLoadavgOver), true);
        });
    });
    describe('testDataMemOverLoadavgOver', function() {
        it('should return true', function() {
        	resetCount();
            assert.equal(checker(testDataMemOverLoadavgOver), true);
        });
    });
});