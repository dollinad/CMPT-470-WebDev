const mongoose = require('mongoose');
const passwordValidator = require('password-validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const randomString = require('random-string');
const mailer = require('../configuration/mailer');

var checkUsername = (username) => {
    if(username.length < 6 || username.length > 20) {
        return false
    }
    return true
}

var checkPassword = (password) => {
    var passwordCheck =  new passwordValidator();
    //TODO: Commented for dev purposes.
    // passwordCheck
    //     .is().min(8)                                    
    //     .is().max(20)                                  
    //     .has().uppercase()                              
    //     .has().lowercase()
    //     .has().symbols()                              
    //     .has().digits()                                 
    //     .has().not().spaces();
    // return passwordCheck.validate(password)
    return true;
}

var hashPassword = async (password) => {
    return await bcrypt.hash(password,10);
}

var redirectToRegister = async (req, res, message) => {
    req.flash('error', message);
    return res.redirect('/register');
}

var registerUser = async (req, res)  => {
    try{
        var name = req.body.name;
        var username = req.body.username;
        if(!checkUsername(username)) {
            return redirectToRegister(req, res, "Username should have a minimum length of 6 and maximum of 20.")
        }
        var email = req.body.email;
        var password = req.body.password;
        var password2 = req.body.password2;
        if(password !== password2) {
            return redirectToRegister(req, res, "Those Passwords didn\'t match. Please try again.");
        }
        if(!checkPassword(req.body.password)) {
            return redirectToRegister(req, res, "Your password must have a least length of 8 and should include atleast 1 digit, 1 Uppercase Letter ,1 Lowercase Letter and 1 special character.");
        }
        else {
            const hashedPassword = await bcrypt.hash(password,10);
            var emailToken = randomString();
            var newUser = new User({name: name, username: username, email: email ,password:hashedPassword, emailToken:emailToken, linkExpires: new Date().getTime() + 3600000});
            await User.register(newUser, req.body.password, async (err, user) => {
                if(err) {
                    console.log(err);
                    return redirectToRegister(req, res, err.message);
                }
                else {
                }
                    console.log("New User Saved");
                    let link = process.env.URL;
                    const html = `Verify your account by clicking this link: <a href="${link}/user/verify/${emailToken}" target="_blank">${link}/user/verify/${emailToken}</a>`;
                    await mailer.sendEmail('fightagaintcovid@gmail.com', email, 'Fight Against COVID: Verify your Email', html);
                    console.log("Verification email sent");
                    return res.render('register.ejs', {
                        message: "Success! Check your email for the verification link.",
                        user: req.user
                    });
            });
        }
    } catch (e){
        console.log(e)
        return res.redirect('/register');
    }
}


module.exports.registerUser = registerUser;
module.exports.checkUsername = checkUsername;
module.exports.checkPassword = checkPassword;
module.exports.hashPassword = hashPassword;