const centerConfig = require("../configuration/center")
const Center= require ('../models/center')
const review = require('../models/review');
const User = require('../models/user');
var ObjectID = require('mongodb').ObjectID;

exports.show_Center = async (req,res) => {
    console.log("from center")
    console.log(req.cookies)
    centerConfig.findAllCenter('centerlist',req, res)
}

exports.filter_distance =async (req,res) => {
    res.cookie('userAddr', req.body.address, { httpOnly: true });
    if(req.body.distance == "All")
    {
        centerConfig.findAllCenter('centerlist',req, res)
    }else
    {
        centerConfig.GeoNearfilterDistance(req,res)
    }
}

exports.add_Center = async (req,res,next) => {
    req.body.address += req.body.city+req.body.region+req.body.country
	req.body.user = req.user.username
    centerConfig.addCenter(req,res)
}

exports.map_allCenter = async (req,res,next) => {
    centerConfig.findAllCenter('map',req, res)
}

exports.delete_Center = async (req,res,next) => {
    centerConfig.deleteCenter(req,res)
}

exports.resource_Center = async (req,res,next) => {
    centerConfig.resourceCenter(req,res)
}

exports.add_Resource = async (req,res,next) => {
    centerConfig.addResource(req,res)
}


// specific center page
exports.viewCenter = async(req, res) => {
    await Center.findOne({ "_id": ObjectID(req.query.id) },async function(err,results)
    {
        if(err)
        {
            console.log(err)
            return res.status(500).json({error: 'find error'})
        }else
        {
            console.log(results)
            var user = await User.findOne({username: results.user});
            console.log(user);
            review.find({center_id: req.query.id}, (err, review_list) => {
                if(err) {
                    console.log(err);
                }
                var center = {title : "Viewing Center", center : results, user: req.user, reviews: review_list, total_likes: results.likes.length, author: user }
                res.render('center', center)
                //res.render('', {message: req.flash(), user: req.user.username, reviews: review_list, center: req.query.id});
            });
        }
    })
}


exports.postReview = async(req, res) => {
    console.log(res)
	if(req.body.title==null & req.body.message==null){
		const obj = JSON.parse(JSON.stringify(req.body)); 
  		const obj_id = Object.keys(obj)[0];
  		const obj_val = String(obj[Object.keys(obj)[0]]);
		//const db = client.db(dbName);
		//const collection = db.collection('reviews');
		//console.log('id: ' + obj_id + ' type: ' + typeof obj_id);
		review.findOneAndUpdate(
			{ "_id": ObjectID(obj_id)},
			{ $push: { "replies": {"user": req.user.username, "text_reply": obj_val}  } }, function(err, data) {
				if (err) {
					console.log(err);
					req.flash("error", "There is an error processing your request. Please try again")
				}
				//console.log(data.result.nModified + " document(s) updated");
				res.redirect('/centers/view?id='+req.query.id)
			});
	}
	else{
		centerConfig.newReview(req,res)
	}
}

// edit resources for this center
exports.edit_Resources = async (req,res) => {
    centerConfig.editResources(req, res);
}
// edit resources for this center
exports.edit_Resources_Post = async (req,res) => {
    centerConfig.editResourcesPost(req, res);
}

exports.like_Center = async (req,res) =>{
	centerConfig.likeCenter(req,res);
}

exports.unlike_Center = async (req,res) =>{
	centerConfig.unlikeCenter(req,res);
}
