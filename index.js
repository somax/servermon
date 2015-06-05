#!/usr/bin/env node

'use strict';

/**
 * ServerMon 20150602
 * maxiaojun<somaxj@163.com> @ jkr3
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
    example: "'servermon -id serv1' or 'servermon --reaperid serv1'"
}]);


argv.version( _package.version );

// get description from package.json
argv.info(_package.description);

// get options(arguments)
var options = argv.run().options;

// set default 
var port = options.port;
var host = options.host;

// dev 
// todo use NODE_ENV
var reaperId = options.reaperid //|| guid.raw();

if( options.reaper && !reaperId || reaperId === 'true'){
    log.err('Please specify reaperId,Trigger \'servermon -h\' for more details.');
    return
}
// // if no option , print help message.
// if (JSON.stringify(options) === '{}') {
//     argv.help();
//     return;
// }

// // print version
// if (options.version) {
//     // get version from package.json
//     console.log(_package.name + ' Version:' + _package.version)
//     return;
// }

//run as server
if (options.server) {
    servermon.server(port,host);
}

// run as client (reper)
else if (options.reaper) {
    servermon.reaper(reaperId,port,host);
}

else{
    argv.help();
}