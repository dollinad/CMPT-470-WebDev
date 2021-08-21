var express = require('express');
const { checkAuthentication, checkNotAuthenticated } = require('../configuration/authCheck');
var router = express.Router();
var emailController = require('../controllers/emailController');
var userController = require('../controllers/userController');
const multer = require("multer");

var Storage = multer.diskStorage({
    destination: require('path').resolve(__dirname, '../public/documents'),
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + require('path').extname(file.originalname));
    }
});

var upload = multer({
    storage: Storage
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/verify/:id', checkNotAuthenticated, emailController.get_verifyAccount);

router.get('/forgot', checkNotAuthenticated, emailController.get_sendForgotPasswordEmail);

router.post('/forgot', checkNotAuthenticated, emailController.post_sendForgotPasswordEmail);

router.get('/newpass/:id', checkNotAuthenticated, emailController.get_newPassword);

router.post('/newpass/:id', checkNotAuthenticated, emailController.post_newPassword);

router.get('/getverified', checkAuthentication, userController.get_verifiedAccount);

router.post('/getverified', upload.array('file'), checkAuthentication, (req, res) => {
  userController.post_verifiedAccount(req,res)
});

router.get('/profile', checkAuthentication, userController.get_profile);

router.get('/profile/edit', checkAuthentication, userController.edit_get_profile);

router.post('/profile/edit', checkAuthentication, userController.edit_post_profile);

router.post('/profile/edit/image', upload.single('file'), checkAuthentication, async (req, res) => {
  userController.edit_post_profile_image(req, res)
});

router.get('/profile/:user', userController.get_profile_social);

module.exports = router;
