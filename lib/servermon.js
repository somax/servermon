'user stirct';

/**
 *
 */

var
    Reaper = require('./reaper'),
    Reporter = require('./reporter'),
    log = require('./log'),
    storage = require('./storage'),
    reporter_storage = require('./reporter-storage'),
    reporter_mailer = require('./reporter-mailer'),
    checker = require('./checker.js'),
    config = require('../config.json');

var servermon = function() {

};


// Run as Server 
servermon.prototype.server = function(port, host) {

    log.info('mail:',config.mailer.mailto);

    var reporter = new Reporter();

    // middleware storage
    // for save data to storage
    reporter.use(reporter_storage);

    // if checker() return true then send mail
    reporter.use(reporter_mailer(checker));

    // init SocketServer
    var SocketServer = require('./socket-server');
    var server = new SocketServer(port, host);

    server.start(function() {
        log.info('Servermon run as server');
    });

    //test sendback to reaper
    server.on('connection', function() {
        server.sendData('Data from server!');
    });

    server.on('data', function(data) {
        log.debug('<<< got data <<', typeof data);
        reporter.report(data);
    });
    // 
};


// Run as Reaper (Client)
/**
 * servermon.reaper() Reap os info and send to server
 * @param  {string} id    the reaperid , by defalut Reaper will us os.hostname,
 * @param  {int} port     server's port
 * @param  {string} host  server's host
 * @param  {int} interval the dreap data
 * @return {null}          
 */
servermon.prototype.reaper = function(id, port, host, interval) {
    interval = interval || config.reaper.interval || 600000;

    log.info('Servermon run as reaper.');

    var SocketClient = require('./socket-client');

    var client = new SocketClient(port, host);
    var reaper = new Reaper(id);

    client.on('connect', function() {
        log.debug('localAddress', client._client.address());
        log.debug('address', client._client.isConnected);
        reportData('all');
    });
    client.on('close', function() {
        // body...
    });
    client.connect();

    // get data / 2s
    var reportData = function(opt) {
        log('report data>>');
        // reap server status
        var data = reaper.reap(opt);

        // send to server
        client.sendData(data);
        if (client.isConnected) {
            setTimeout(reportData, interval);
        }
    };

    // reportData();
};

module.exports = servermon;