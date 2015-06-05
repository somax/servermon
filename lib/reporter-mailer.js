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
    log = require('./log');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: '163',
    auth: {
        user: 'jkr3_servermon@163.com',
        pass: 'vxvostasuiluvgxc'
    }
});

var mailer = {}
mailer.config = {};

function mailBodyParse(data) {
    return JSON.stringify(data)
}

function createOptions(content) {
    log.debug('create mail options', content)
    if (typeof content === 'object') {
        content = JSON.stringify(content)
    }
    var mailOptions = {
        from: 'jkr3_servermon<jkr3_servermon@163.com>', // sender address
        to: 'jkr3_servermon@163.com', // list of receivers
        subject: 'servermon reporter (' + new Date() + ')', // Subject line
        text: content // plaintext body
            // html: '<b>Hello world ✔</b>' // html body
    };
    return mailOptions;
}

function sendMail(options) {
    log.info('Sending mail...')
    log.debug(options)

    transporter.sendMail(options, function(error, info) {
        if (error) {
            return log.err(error);
        }
        log.info('Message sent: ' + info.response);

    });
}

mailer.send = function(data) {
    var text = (typeof data !== "string") ? mailBodyParse(data) : data;
    sendMail(createOptions(data));
}

module.exports = function(checker){
    return function(data, next) {
        if (!data.data) return;

        var _id = data.id;
        log.info('----- from reporter-mailer ----', data, _id)
        var count = 0;
        var storageCount = storage.get('warningCount') || {};

        log.debug('<< got warningCount', storageCount, storageCount.hasOwnProperty(_id))

        if (storageCount.hasOwnProperty(_id)) {
            count = storageCount[_id];
            log.debug('count', count)
        }

        if (data.data.mp < 0.5) {
            count++;
        } else {
            count = 0;
        }

        log.debug('=====>>>>>> mailer check memory percent:', data.data.mp, count)
        if (count > 10) {
            mailer.send(data);
            storageCount[_id] = 0;
        } else {
            storageCount[_id] = count;
        }

        storage.set('warningCount', storageCount);

        next();
    }
}