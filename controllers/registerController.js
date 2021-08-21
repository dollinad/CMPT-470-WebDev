const registerConfig = require("../configuration/register");

exports.get_register = (req,res) => {
	res.locals.title = "Register";
	res.render('register.ejs', {message: req.flash(), user: req.user});
}

exports.post_register = (req,res) => {
	registerConfig.registerUser(req,res)
}