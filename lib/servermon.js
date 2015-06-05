'user stirct';

/**
 * 
 */

var 
	Reaper = require('./reaper'),
    Reporter = require('./reporter'),
    log = require('./log'),
    reporter_storage = require('./reporter-storage')
    reporter_mailer = require('./reporter-mailer');

var servermon = function(){

}

servermon.prototype.server = function (port,host) {
	var reporter = new Reporter();

// todo remove this when done
    reporter.use(function(data,next){
        log.debug('++++++++++ middleware log >>> ',data)
        next();
    })

    // middleware 
    // add free memory percent 
   	reporter.use(function (data, next) {
		if(!data.data)return;
		data.data.mp = parseInt(data.data.mf / data.data.mt * 10000) / 100;
		next();
	})

	// middleware storage
	// for save data
    reporter.use(reporter_storage);


    var SocketServer = require('./socket-server');
    var server = new SocketServer(port,host);

    server.start(function() {
        log.info('Servermon run as server');
    });

    //test sendback to reaper
    server.on('connection', function() {
        server.sendData('test data from server!')
    })


    server.on('data',function (data) {
        log.debug('<<< got data <<',typeof data)
        reporter.report(data);

    })
    // 
}

servermon.prototype.reaper = function (id,port,host){
	var SocketClient = require('./socket-client');

    // var client = new SocketClient();
    var client = new SocketClient(port, host)

    client.connect();

    log(SocketClient)

    var reaper = new Reaper(id);

// get data / 2s
    var reportData = function() {
        log('report data>>');
        // reap server status
        var data = reaper.reap();

        // send to server
        client.sendData(data);
        setTimeout(reportData, 2000);
    }

    reportData();
}

module.exports = servermon;