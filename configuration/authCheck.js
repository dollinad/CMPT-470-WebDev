var checkAuthentication = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

var checkNotAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }
    return next();
}

var checkVerifiedUser = (req, res, next) => {
    if(req.user.verifiedUser) {
        return next();
    }
    res.redirect('/')
}

module.exports = {
    checkAuthentication,
    checkNotAuthenticated,
    checkVerifiedUser
}