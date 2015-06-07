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
    reporter_mailer = require('./reporter-mailer');

var servermon = function() {

};

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

    if (data.data.mp < 1.4) {
        count++;
    } else {
        count = 0;
    }

    log.debug('=====>>>>>> mailer check memory percent:', data.data.mp, count);
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

// Run as Server 
servermon.prototype.server = function(port, host) {
    var reporter = new Reporter();

    // middleware 
    // add free memory percent 
    // reporter.use(function(data, next) {
    //     log.debug('------ middleware log >>> ', data);

    //     if (!data.data) {
    //         return;
    //     }
    //     data.data.mp = parseInt(data.data.mf / data.data.mt * 10000) / 100;

    //     log.debug('------ middleware log add [mp] ', data);

    //     next();
    // });

    // middleware storage
    // for save data
    reporter.use(reporter_storage);
    // for sending mail

    reporter.use(reporter_mailer(checker));


    var SocketServer = require('./socket-server');
    var server = new SocketServer(port, host);

    server.start(function() {
        log.info('Servermon run as server');
    });

    //test sendback to reaper
    server.on('connection', function() {
        server.sendData('test data from server!');
    });


    server.on('data', function(data) {
        log.debug('<<< got data <<', typeof data);
        reporter.report(data);

    });
    // 
};


// Run as Reaper (Client)
servermon.prototype.reaper = function(id, port, host, interval) {
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
            setTimeout(reportData, interval || 5000);
        }
    };

    // reportData();
};

module.exports = servermon;