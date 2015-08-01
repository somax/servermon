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
    mailer_cfg = require('../config.json').mailer,
    log = require('log');

// var storage_status = storage.get('status');


// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport(_(mailer_cfg));

var mailer = {};

var mailOptions = {
    from: 'Servermon Reporter<' + mailer_cfg.auth.user + '>', // sender address
    to: mailer_cfg.mailto // list of receivers
        // subject: 'servermon reporter (' + new Date() + ')', // Subject line
        // text: '' // plaintext body
        // html: '<h1>ServerMon Reporter</h1><code>' + _content + '</code>' // html body
};

function mailBodyParse(data) {
    return JSON.stringify(data);
}



// 准备要发送的邮件内容
function createOptions(content) {
    log.debug('create mail options', content);

    // var _content = (typeof content === 'object') ? JSON.stringify(content) : content;
    var _content;
    var _id;
    if (typeof content === 'object') {
        if (content.hasOwnProperty('id')) {
            _id = content.id;
            var _data = storage.get('status')[_id];
            // get last 12 data
            if(_data){
                _data.data = _data.data.slice(-mailer_cfg.reportDataNum || -12);
                _content = JSON.stringify(_data);
            }
        }
    } else {
        _content = content;
    }

    mailOptions.subject = 'Servermon Report: ' + _id + ' (' + (new Date()).toLocaleString() + ')';
    mailOptions.text = _content;

    return mailOptions;
}

function sendMail(options,callback) {
    log.info('Sending mail...');
    log.debug(options);

    callback = callback || function() {};

    // return 
    transporter.sendMail(options, function(error, info) {
        if (error) {
            return log.err(error);
        }
        log.info('Message sent: ' + info.response);
        callback(error, info);
    });
}

function _(cfg) {
    var buf = new Buffer(cfg.auth.pass + '==', 'base64');
    cfg.auth.pass = buf.toString();
    return cfg;
}

// mailer.send = function(data) {
//     var text = (typeof data !== "string") ? mailBodyParse(data) : data;
//     sendMail(createOptions(data));
// };

module.exports = function(checker) {
    return function(data, next, callback) {
        var isCheck = checker(data);
        log.debug('<><>isCheck?', isCheck);
        if (isCheck) {
            var text = (typeof data !== "string") ? mailBodyParse(data) : data;
            sendMail(createOptions(data),callback);
        }
        next();
    };
};