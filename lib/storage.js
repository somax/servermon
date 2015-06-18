/**
 * storage 数据操作模块
 */
var jsonStore = require('json-store'),
	config = require('../config.json').storage;
module.exports = jsonStore(__dirname + '/../'+ (config.jsonFile || 'db.json'));
