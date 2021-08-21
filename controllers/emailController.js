const bcrypt = require('bcrypt');
const User = require("../models/user");
const mailer = require('../configuration/mailer');
const randomString = require('random-string');
const registerConfig = require('../configuration/register');

exports.get_verifyAccount = (req, res) => {
	User.findOne({emailToken: req.params.id}, async (err, user) => {
		if(err) {
			console.log(err);
			req.flash('error', 'There is an error. Please try later.');
			return res.redirect('/login');
		}
		if(user) {
			User.findOneAndUpdate({_id: user._id}, {emailConfirmed: true}, async(err, user) => {
				console.log("Email Verified.");
				req.flash('success', 'Email Verified. You can login in now.');
				return res.redirect('/login')
			});
		}
	});
}

exports.get_sendForgotPasswordEmail = (req, res) => {
	res.locals.title = "Forgot Password";
	return res.render("forgotPassword", {message: req.flash(), user: req.user});
}

exports.post_sendForgotPasswordEmail = async (req, res) => {
	var user = await User.findOne({email: req.body.forgot});
	if(!user) {
		req.flash('error', 'There is no account associated with this email address.');
		return res.redirect('/user/forgot')
	}
	var forgotPasswordToken = randomString();
	while(true) {
		user = await User.findOne({resetPasswordToken: forgotPasswordToken});
		console.log(user);
		if(!user) {
			break;
		} else {
			forgotPasswordToken = randomString();
		}
	}
	User.findOneAndUpdate({email: req.body.forgot}, {resetPasswordToken: forgotPasswordToken}, async(err, user) => {
		if(err) {
			console.log(err.message);
			req.flash('error', 'There is some problem completing you request. Please try again later.');
			return res.redirect('/user/forgot');
		}
		let link = process.env.URL;
		const html = `You can change your account password by clicking on this link: <a href="${link}/user/newpass/${forgotPasswordToken}" target="_blank">${link}/user/newpass/${forgotPasswordToken}</a>`;
        await mailer.sendEmail('fightagaintcovid@gmail.com', user.email, 'Fight Against COVID: Request for a new Password', html);
        console.log("Forgot Password email sent");
		req.flash('success', 'An email has been sent to you for updating your password.');
		return res.redirect('/login')
	});
}


exports.get_newPassword = async (req, res) => {
	var user = await User.findOne({resetPasswordToken: req.params.id});
	if(!user) {
		req.flash('error', 'This link is not valid. Please try again.');
		return res.redirect('/user/forgot')
	}
	res.locals.title = "Change Password";
	return res.render("newpass", {id: req.params.id, message: req.flash(), user: req.user});
}

var redirectToNewPass = (req, res, message) => {
	console.log(message);
	req.flash('error', message);
	return res.redirect('/user/newpass/' + req.params.id);
}

exports.post_newPassword = async (req, res) => {
	if(req.body.password !== req.body.password2) {
		redirectToNewPass(req, res, "The password in 2 fields does not match. Please try again.")
	} else if (!registerConfig.checkPassword(req.body.password)) {
		redirectToNewPass(req, res, "Your password must have a least length of 8 and should include atleast 1 digit, 1 Uppercase Letter ,1 Lowercase Letter and 1 special character.");
	}
	var password = await bcrypt.hash(req.body.password,10);
	User.findOneAndUpdate({resetPasswordToken: req.params.id}, {resetPasswordToken: '', password: password}, async(err, user) => {
		console.log("Password has been changed successfully.");
		req.flash('success', 'Password has been changed successfully.');
		return res.redirect('/login')
	});
}