exports.get_login = (req,res) => {
	var message = req.flash();
	res.locals.title = "Login";
	res.render('login.ejs', {message, user: req.user});
}

exports.get_logout = (req,res) => {
	req.logOut();
	res.redirect('/');
}

