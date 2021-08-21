const express = require('express');
const passport = require('passport');

const authentication = require('../configuration/authCheck');
const loginController = require('../controllers/loginController');
const registerController = require('../controllers/registerController');
const commentController = require('../controllers/commentController');
const indexController = require('../controllers/indexController')
const centerController = require('../controllers/centerController');
const nearmeConfig = require("../configuration/nearme")

var centerRouter = require('./centers');
var nearmeRouter = require('./nearme');
var router = express.Router();

/* GET home page. */

router.get('/', authentication.checkAuthentication, (req, res, next) => {
  res.locals.title = "Fight Against COVID";
  indexController.getSummary(req,res);
});

router.get('/stats',authentication.checkAuthentication,indexController.getStats);

router.post('/stats',authentication.checkAuthentication,indexController.postStats);

router.get('/discussion_board', authentication.checkAuthentication, commentController.get_board);

router.post('/discussion_board', authentication.checkAuthentication, commentController.post_board); 

// routing to centers
router.use('/centers',authentication.checkAuthentication, centerRouter)

//router.get('/review',authentication.checkAuthentication, centerController.get_board)
//router.post('/review',authentication.checkAuthentication, centerController.post_board)

router.get('/login', authentication.checkNotAuthenticated, loginController.get_login);

router.post('/login', authentication.checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true 
}));

router.get('/register', authentication.checkNotAuthenticated, registerController.get_register);

router.post('/register', authentication.checkNotAuthenticated, registerController.post_register);

router.post('/logout', loginController.get_logout)
// resources near me
router.use('/nearMe', authentication.checkAuthentication, nearmeRouter)

module.exports = router;
