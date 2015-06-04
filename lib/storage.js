var jsonStore = require('json-store');
var db = jsonStore(__dirname + '/db.json');

var storage = db;

module.exports = storage;