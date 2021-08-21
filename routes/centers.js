var express = require('express');
var router = express.Router();
var centerController = require('../controllers/centerController');
var authCheck = require('../configuration/authCheck');

router.get('/', authCheck.checkVerifiedUser, centerController.show_Center)

router.post('/', authCheck.checkVerifiedUser, centerController.filter_distance)

router.get('/add', authCheck.checkVerifiedUser, function(req, res, next) {
    res.render('addcenter', {message: req.flash(), user: req.user});
});

router.get('/map',centerController.map_allCenter)

router.post('/add', authCheck.checkVerifiedUser, centerController.add_Center)

router.delete('/:id', authCheck.checkVerifiedUser, centerController.delete_Center)

router.get('/id=:id/resources', authCheck.checkVerifiedUser, centerController.resource_Center)

router.post('/id=:id/resources', authCheck.checkVerifiedUser, centerController.add_Resource)

// specific center page
router.get('/view',centerController.viewCenter)
router.post('/view',centerController.postReview)

// edit resource
router.get('/edit/:id/:rid',centerController.edit_Resources)
// save edit
router.post('/edit/:id/:rid',centerController.edit_Resources_Post)

router.post('/:id',function(req,res,next)
{
    if(req.body.action == "like"){
        centerController.like_Center(req,res)
    }
    else{
        centerController.unlike_Center(req,res)
    }
})


module.exports = router;
