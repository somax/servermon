var net = require('net'),
	log = require('./log');

var socketClient = function(_port,_host,_ReConnectTime) {
	var self = this;

	this.PORT = _port || 1337;
	this.HOST = _host || '127.0.0.1';
	this._ReConnectTime = _ReConnectTime || 2000;

	this._client = new net.Socket();

	this._connect = function _connect() {
		log.info('Connecting...')
		self._client.connect({port:self.PORT, host:self.HOST});
	}
	this._client.on('connect', function() {
		log.info('Connected');
		this.write('Hello, server! Love, Client.');
	})

	this._client.on('data', function(data) {
		log.info('Received: ' + data);
	});

	this._client.on('close', function() {
		log.info('Connection closed');
		reConnect();
	});

	this._client.on('error', function(err) {
		log.info('Connection error', err);
	});

	function reConnect(_this) {
		log.info('reconnect after ' + self._ReConnectTime / 1000 + ' scond');
		setTimeout(self._connect, self._ReConnectTime);
	}
}

socketClient.prototype.sendData = function (data) {
	if(this._client.writable){
		if(typeof data === 'object'){
			data = JSON.stringify(data)
		}
		this._client.write(data);
	}
}

socketClient.prototype.connect = function() {
	this._connect();
}

module.exports = socketClient;