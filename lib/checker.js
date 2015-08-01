/**
 * checker
 * 检查器，满足条件返回 true
 * 检查策略：
 *     内存剩余量% 持续 <checker_cfg.count> 次小于 <checker_cfg.freememPercent> 
 *     或者
 *     CPU负载持续 <checker_cfg.count> 次大于 <checker_cfg.loadavg>
 *     返回 true
 *     
 * 注意：
 *     不是每次超过阈值都会返回true，而是通过 warningCount 来累计连续警告次数，
 *     当 warningCount 超过, checker_cfg.count 的设置值，才会返回一次 true，
 *     随后计数将从新开始。
 *
 * 1、用来检查 内存占用是否超过阈值
 * 2、todo 检查cpu负载
 *
 *
 * @type {boolean} 
 */
var log = require('log'),
    storage = require('./storage'),
    checker_cfg = require('../config.json').checker;


var checker = function(data) {

    if (!data.data) {
        return false;
    }

    var _id = data.id;
    var _count = 0;
    var _storageCount = storage.get('warningCount') || {};
    var _check_mp = checker_cfg.freeMemPercent || 2;
    var _check_loadAvg = checker_cfg.loadAvg || 0.7;
    var _mp,_loadAvg;
    log.debug('<< got warningCount', _storageCount, _storageCount.hasOwnProperty(_id));

    // 从存储中读取 count
    if (_storageCount.hasOwnProperty(_id)) {
        _count = _storageCount[_id];
        log.debug('_count', _count);
    }

    try{
        _mp = data.data.mp;
        _loadAvg = data.data.loadavg[2] / data.data.cpu.length;
        
    }catch(err){
        log.err('数据格式错误！',err);
    }

    // 判断剩余内存小于限定量或者 负载（15分钟）大于限定量
    if ( _mp < _check_mp || _loadAvg > _check_loadAvg) {
        _count++;
    } else {
        _count = 0;
    }

    // warning计数，连续则累计，否则重置（= 0）。
    log.debug('=====>>>>>> check memory percent:', data.data.mp, _count);
    var isCheck = _count > (checker_cfg.count || 3);
    if (isCheck) {
        _storageCount[_id] = 0;
    } else {
        _storageCount[_id] = _count;
    }
    log.debug('save ', _storageCount, _count);
    storage.set('warningCount', _storageCount);

    return isCheck;
};

module.exports = checker;