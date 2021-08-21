const User = require("../models/user");
const Center= require ('../models/center')
const registerConfig = require("../configuration/register");

exports.get_verifiedAccount = (req, res) => {
    if(req.user.type !== '') {
        req.flash('error', 'Your application is already in progress. A member of our team will contact you shortly.');
        return res.redirect('/');
    }
    res.locals.title = "Register as Verified User";
	return res.render('registerVerified.ejs', {message: req.flash(), user: req.user});
}

exports.post_verifiedAccount = (req, res) => {
    var files = [];
    console.log(req)
    if (req.files != undefined){
        for (let i = 0 ; i < req.files.length ; i++) {
            let file  = req.files[i];
            files.push(req.body.url.toString() + file.filename);
        }
    }
    User.findOneAndUpdate({_id: req.user._id}, {
        instagram: req.body.insta,
        facebook: req.body.facebook,
        tiktok: req.body.tiktok,
        docLinks: files,
        mobile: req.body.phone,
        type: req.body.type
    }, async(err, user) => {
        console.log(user)
        console.log("Verified User Information Updated.");
        req.flash('success', 'Your information has been successfully submitted. A team member will review the application and you will get an update once you got approved.');
        return res.redirect('/')
    });
}

exports.get_profile = (req, res) => {
    res.locals.title = "Profile";
    res.render('profile', {message: req.flash(), user: req.user, page: "Profile"})
}

exports.edit_get_profile = (req, res) => {
    res.locals.title = "Edit Profile";
    res.render('profile', {message: req.flash(), user: req.user, page: "Edit Profile"})
}

exports.edit_post_profile = async (req, res) => {
    var userObj = {
        name: req.body.name
    };
    if(req.body.password != "") {
        if(req.body.password !== req.body.password2) {
            req.flash('error', 'The Passwords you provided does not match. Please try again.');
            return res.redirect('/user/profile/edit');
        } else if(!registerConfig.checkPassword(req.body.password)){
            req.flash('error', 'Your password must have a least length of 8 and should include atleast 1 digit, 1 Uppercase Letter ,1 Lowercase Letter and 1 special character.');
            return res.redirect('/user/profile/edit');
        } else {
            userObj.password = await registerConfig.hashPassword(req.body.password);
        }
    }
    if(req.user.verifiedUser === true) {
        userObj.instagram = req.body.instagram,
        userObj.facebook = req.body.facebook,
        userObj.tiktok = req.body.tiktok,
        userObj.mobile = req.body.phone
    }
    console.log(userObj);
    User.findOneAndUpdate({_id: req.user._id}, userObj, async (err, user) => {
        if(err) {
			console.log(err.message);
			req.flash('error', 'There is some problem completing you request. Please try again later.');
			return res.redirect('/user/profile/edit');
		}
        req.flash('success', 'Profile Successfully Modified')
        res.redirect('/user/profile')
    });
}

exports.edit_post_profile_image = async (req, res) => {
    console.log(req);
    if(req.user.profilePic != "") {
        var path = require('path').resolve(__dirname, '../public/documents/') + "/" + req.user.profilePic;
        require('fs').unlink(path, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    User.findOneAndUpdate({_id: req.user._id}, { profilePic: req.file.filename}, async (err, user) => {
        if(err) {
			console.log(err.message);
			req.flash('error', 'There is some problem completing you request. Please try again later.');
			return res.redirect('/user/profile/edit');
		}
        req.flash('success', 'Profile Successfully Modified')
        res.redirect('/user/profile')
    });
}

exports.get_profile_social = async (req, res) => {
    var user = await User.findOne({username: req.params.user}, (err, user) => {
        if(err) {
            console.log(err);
        }
    });
    if(!user || user.verifiedUser !== true) {
        req.flash('error', 'Sorry there is no verified user with username ' + req.params.user + ".")
        return res.redirect("/")
    }
    var centers = await Center.find({user: user.username});
    var totalCenters = centers.length;
    var totalLikes = 0;
    for(let i = 0 ; i < centers.length; i++) {
        totalLikes += centers[i].likes.length;
    }
    res.locals.title = "Social Profile";
    res.render('socialProfile', {message: req.flash(), user: req.user, page: "Profile", socialUser: user, likes: totalLikes, resources: totalCenters});
}