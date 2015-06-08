var log = require('./log'),
    storage = require('./storage'),
    checker_cfg = require('../config.json').checker;


var checker = function(data) {

    if (!data.data) {
        return false;
    }

    var _id = data.id;
    log.info('----- from checker ----', data, _id);
    var count = 0;
    var storageCount = storage.get('warningCount') || {};

    log.debug('<< got warningCount', storageCount, storageCount.hasOwnProperty(_id));

    if (storageCount.hasOwnProperty(_id)) {
        count = storageCount[_id];
        log.debug('count', count);
    }

    if (data.data.mp < checker_cfg.freemem_percent || 2) {
        count++;
    } else {
        count = 0;
    }

    log.debug('=====>>>>>> check memory percent:', data.data.mp, count);
    var isCheck = count > 10;
    if (isCheck) {
        storageCount[_id] = 0;
    } else {
        storageCount[_id] = count;
    }
    log.debug('save ', storageCount, count);
    storage.set('warningCount', storageCount);

    return isCheck;
};

module.exports = checker;