



var nodemailer = require('nodemailer');
var wellknown = require('nodemailer-wellknown');
// var config = wellknown('QQ');
// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: '163',
    auth: {
        user: 'jkrthree@163.com',
        pass: 'jkr3.255.32.403'
    }
});


var mailer={}
mailer.config = {};

function mailBodyParse(data) {
    return JSON.stringify(data)
}

function createOptions(content) {
	if(typeof content === 'object'){
		content = JSON.stringify(content)
	}
    var mailOptions = {
        from: 'jkrthree<jkrthree@163.com>', // sender address
        to: 'somaxj@qq.com', // list of receivers
        subject: '服务器状态报告', // Subject line
        text: content // plaintext body
        // html: '<b>Hello world ✔</b>' // html body
    };
    return mailOptions;
}


function sendMail(options) {
    transporter.sendMail(options, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

    });
}


mailer.send = function (data) {
	var text = (typeof data !== "string")?mailBodyParse(data):data
	console.log('sending mail ...',data)

	sendMail(createOptions(data))

}

module.exports = function(data,next){
    // todo send mail
}