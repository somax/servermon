/**
 * reporter middleware mailer
 * send warning mail
 * 20150605
 *
 *
 *
 */
var nodemailer = require('nodemailer'),
    wellknown = require('nodemailer-wellknown'),
    storage = require('./storage'),
    config = require('../config.json').mailer,
    log = require('./log');

var storage_status = storage.get('status'); 

var b64 = 'base64',
    ai = 'ascii';

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport(_(config));

var mailer = {};
mailer.config = {};


function mailBodyParse(data) {
    return JSON.stringify(data);
}

function createOptions(content) {
    log.debug('create mail options', content);

    // var _content = (typeof content === 'object') ? JSON.stringify(content) : content;
    var _content;
    if(typeof content === 'object'){
        if(content.hasOwnProperty('id')){
           _content = JSON.stringify(storage_status[content.id]);
        }
    }else{
        _content = content;
    }

    var mailOptions = {
        from: 'jkr3_servermon<jkr3_servermon@163.com>', // sender address
        to: 'jkr3_servermon@163.com', // list of receivers
        subject: 'servermon reporter (' + new Date() + ')', // Subject line
        text: _content, // plaintext body
        html: '<h1>ServerMon Reporter</h1><code>' + _content + '</code>' // html body
    };
    return mailOptions;
}

function sendMail(options) {
    log.info('Sending mail...');
    log.debug(options);

    // return 
    transporter.sendMail(options, function(error, info) {
        if (error) {
            return log.err(error);
        }
        log.info('Message sent: ' + info.response);

    });
}

function _(config) {
    var buf = new Buffer(config.auth.pass+'==', b64);
    config.auth.pass = buf.toString(ai);
    return config;
}

mailer.send = function(data) {
    var text = (typeof data !== "string") ? mailBodyParse(data) : data;
    sendMail(createOptions(data));
};

module.exports = function(checker) {
    return function(data, next) {
        var isCheck = checker(data);
        log.debug('<><>isCheck?', isCheck);
        if (isCheck) {
            mailer.send(data);          
        }
        next();
    };
};