var Reaper = require('./reaper'),
    Reporter = require('./reporter'),
    // argv = require('argv'),
    // _package = require('./json'),
    log = require('./log'),
    mailer = require('./reporter-mailer');

var servermon = function(){

}

servermon.prototype.server = function () {
	var reporter = new Reporter();
    reporter.use(function(data,next){
        log('++++++++++ middleware log >>> ',data)
        next();
    })

    var SocketServer = require('./lib/socket-server');
    var server = new SocketServer(port);

    server.start(function() {
        log('Servermon run as server, port: ' + port);
    });

    //test 
    server.on('connection', function() {
        server.sendData('test data from server!')
    })


    server.on('data',function (data) {
        log('<<< got data <<')
        reporter.report(data);

    })
    // 
}

servermon.prototype.reaper = function (){
	var SocketClient = require('./lib/socket-client');

    // var client = new SocketClient();
    var client = new SocketClient(port, '127.0.0.1')

    client.connect();

    log(SocketClient)

    var reaper = new Reaper();

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