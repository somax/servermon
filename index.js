#!/usr/bin/env node

'use strict';

/**
 * ServerMon 20150602
 * somaxj@163.com
 */

var 
    // Reaper = require('./lib/reaper'),
    // Reporter = require('./lib/reporter'),
    argv = require('argv'),
    _package = require('./package.json'),
    // log = require('./lib/log'),
    // mailer = require('./lib/reporter-mailer');
    Servermon = require('./lib/servermon');

var servermon = new Servermon();

//define options
argv.option([{
    name: 'reaper',
    short: 'r',
    type: 'boolean',
    description: 'Run as reaper.',
    example: "'servermon --reaper' or 'servermon -c'"
}, {
    name: 'server',
    short: 's',
    type: 'boolean',
    description: 'Run as server.',
    example: "'servermon --server' or 'servermon -s'"
}, {
    name: 'port',
    short: 'p',
    type: 'int',
    description: 'Specific the port. use whith --server or --client.',
    example: "'servermon --port=1337' or 'servermon -p 1337'"
}, {
    name: 'version',
    short: 'v',
    type: 'string',
    description: 'print servermon\'s version.',
    example: "'servermon --version' or 'servermon -v'"
}]);

// get description from package.json
argv.info(_package.description);

var options = argv.run().options;

var port = options.port || 1337;



// if no option , print help message.
if (JSON.stringify(options) === '{}') {
    argv.help();
    return;
}

// print version
if (options.version) {
    // get version from package.json
    console.log(_package.name + ' Version:' + _package.version)
    return;
}

//run as server
if (options.server) {
    servermon.server();
    // var reporter = new Reporter();
    // reporter.use(function(data,next){
    //     log('++++++++++ middleware log >>> ',data)
    //     next();
    // })

    // var SocketServer = require('./lib/socket-server');
    // var server = new SocketServer(port);

    // server.start(function() {
    //     log('Servermon run as server, port: ' + port);
    // });

    // //test 
    // server.on('connection', function() {
    //     server.sendData('test data from server!')
    // })


    // server.on('data',function (data) {
    //     log('<<< got data <<')
    //     reporter.report(data);

    // })
    // 

}

// run as client (reper)
if (options.reaper) {

    servermon.reaper();
    // var SocketClient = require('./lib/socket-client');

    // // var client = new SocketClient();
    // var client = new SocketClient(port, '127.0.0.1')

    // client.connect();

    // log(SocketClient)

    // var reaper = new Reaper();

    // var reportData = function() {
    //     log('report data>>');
    //     // reap server status
    //     var data = reaper.reap();

    //     // send to server
    //     client.sendData(data);
    //     setTimeout(reportData, 2000);
    // }

    // reportData();


}