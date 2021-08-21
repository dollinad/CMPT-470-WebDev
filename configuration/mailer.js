const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
		user: process.env.EMAIL,
		pass: process.env.PASSWORD
    }
});

var sendEmail = (from, to, subject, html) => {
    console.log("I am here")
    return new Promise((resolve, reject) => {
        transporter.sendMail({from, subject, to, html}, (err, info) =>{
            if (err) {
                reject(err);
            }
            resolve(info);
        });
    });
}

module.exports = {
    sendEmail
}