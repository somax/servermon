/**
 * reporter-storge.js
 * The reporter middleware
 */

// todo - suport multi storage

var 
	// jsonStore = require('json-store'),
	// storage = jsonStore(__dirname + '/storage.json'),
	storage = require('./storage'),
	log = require('./log');

var storage_status = storage.get('status') || {};


var reporterStorage = function(data, next) {
	log.debug('---- from middleware storge --- ',data);
	saveStatus(data);
	next();
};

var MaxStoreNum = 3;
function saveStatus(data) {
	// try {
		// todo ignore message
		if(typeof data ==='string'){
			return;
		}

		var id = data.id;
		// if(!id)return;
		if(!storage_status.hasOwnProperty(id)){
			storage_status[id] = {data:[]};
		}

		var _status = storage_status[id];

		
		if(data.hasOwnProperty('os')){
			_status.os = data.os;
		}

		var _data = _status.data;
		_data.push(data);

		// status.push(data);

		if (_data.length > MaxStoreNum) {
			_data.shift();
		}

		_status.time = new Date();

		// save to storage
		// status.set(id);
		storage.set('status', storage_status);
	// } catch (error) {
	// 	log.err(error);
	// }

}

module.exports = reporterStorage;