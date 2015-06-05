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

var status = storage.get('status') || {};


var reporterStorage = function(data, next) {
	saveStatus(data);
	log.debug('---- from middleware storge --- ')
	next();
}

var MaxStoreNum = 100;
function saveStatus(data) {
	try {
		// todo ignore message
		if(typeof data ==='string')return;

		var id = data.id;
		// if(!id)return;
		if(!status.hasOwnProperty(id)){
			status[id] = [];
		}
		
		var sta = status[id];

		sta.push(data);

		// status.push(data);

		if (sta.length > MaxStoreNum) {
			sta.shift();
		}

		sta.LastSaveTime = new Date();

		// save to storage
		// status.set(id);
		storage.set('status', status);
		log.debug('= status.length', sta.length);
	} catch (error) {
		log.error(error);
	}

}

module.exports = reporterStorage;