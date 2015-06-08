#!/usr/bin/env node

'use strict';

/**
 * ServerMon 20150602
 * maxiaojun<somaxj@163.com> @ jkr3
 *
 * index.js
 * 这是入口文件，主要配置可选参数
 */

var 
    argv = require('argv'),
    _package = require('./package.json'),
    Servermon = require('./lib/servermon'),
    log = require('./lib/log'),
    guid = require('guid');

var servermon = new Servermon();

//define options
argv.option([{
    name: 'reaper',
    short: 'r',
    type: 'boolean',
    description: 'Run as reaper.',
    example: "'servermon -r' or 'servermon --reaper'"
}, {
    name: 'server',
    short: 's',
    type: 'boolean',
    description: 'Run as server.',
    example: "'servermon -s' or 'servermon --server'"
}, {name: 'host',
    short: 'H',
    type: 'string',
    description: 'Specify the server\'s hostname. (default: 127.0.0.1)',
    example: "'servermon -r -H 127.0.0.1' or 'servermon --reaper --host=127.0.0.1'"
},{    name: 'port',
    short: 'p',
    type: 'int',
    description: 'Specify the port. (default: 1337)',
    example: "'servermon -s -p 1337' or 'servermon --server --port=1337' or 'servermon -r -p 1337' or 'servermon --reaper --port=1337'"
}, {
    name: 'reaperid',
    short: 'n',
    type: 'string',
    description: 'Specify the reaper\'s id.',
    example: "'servermon -n serv1' or 'servermon --reaperid=serv1'"
}, {
    name: 'interval',
    short: 'i',
    type: 'int',
    description: 'Specify the reaper\'s interval.',
    example: "'servermon -i 5000' or 'servermon --interval=5000'"
}]);


argv.version( _package.version );

// get description from package.json
argv.info(_package.description);

// get options(arguments)
var options = argv.run().options;

// set default 
var port = options.port;
var host = options.host;
var interval = options.interval;

// dev 
// todo use NODE_ENV
var reaperId = options.reaperid; //|| guid.raw();

// if( options.reaper && !reaperId || reaperId === 'true'){
//     log.err('Please specify reaperId,Trigger \'servermon -h\' for more details.');
//     return
// }


//run as server
if (options.server) {
    servermon.server(port,host);
}

// run as client (reper)
else if (options.reaper) {
    servermon.reaper(reaperId,port,host,interval);
}

else{
    argv.help();
}