var net = require('net'),
	log = require('./log');

// var Events = require('events');
var Guid = require('guid');

var SocketServer = function(_port,_host) {

	var self = this;

	this.PORT = _port || 1337;
	this.HOST = _host || '';
	this._server = net.createServer();

	this._server.on('connection', serverHandler(this._server));

	// log(this._server);
};

// SocketServer.prototype = new Events();

SocketServer.prototype.on = function() {
	this._server.on.apply(this._server, arguments);
};

SocketServer.prototype.sendData = function(data) {
	this._server.emit('sendData', data);
		// this.emit('sendData', data)
};


function serverHandler(_server) {

	return function(socket) {
		socket.uid = Guid.raw();

		log.info('client connected');


		socket.on('close', function() {
			log.info('client disconnected');
			_server.removeListener('sendData', sendData);
		});
		socket.on('data', function(data) {
			var _data = data.toString();
			log.info('Received from: ', this.uid, _data);

			try {
				_data = JSON.parse(_data);
			} catch (e) {
			}
			_server.emit('data', _data);
		});
		socket.on('error', function(err) {
			log.err('Error: ' + err);

		});

		socket.write('hello\r\n');


		// 
		_server.on('sendData', sendData);

		function sendData(data) {
				socket.write(socket.uid);
				socket.write(data);
				log.debug('++++++>> send >>>', data);
			}
			// sendData('hello again!\r\n');

		socket.pipe(socket);


		// function sendData(data) {

		// 	c.write(data);
		// 	setTimeout(sendData, 2000, data);
		// }}
	};
}

// server.listen(1337, '127.0.0.1');

SocketServer.prototype.start = function(callback) {
	this._server.listen(this.PORT,this.HOST, callback);
	log.info('http://'+(this.HOST||'0.0.0.0')+':'+this.PORT);
};

module.exports = SocketServer;