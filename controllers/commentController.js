const commentConfig = require("../configuration/comment");
// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');
// var url;
// if(process.env.MONGO_URL) { 
//     url = process.env.MONGO_URL;
// } else {
//     url = 'mongodb://localhost/fightagainstcovid';
// }
// const client = new MongoClient(url);
// const dbName = 'fightagainstcovid'
const comment = require("../models/comment");
var ObjectID = require('mongodb').ObjectID;

exports.get_board = async (req,res) => {
	res.locals.title = "Discussion Board";
	// const db = client.db(dbName);
	// const collection = db.collection('comments');
	// var comments  = collection.find({});
	// console.log(comments)
	comment.find({}, (err, comments_list) => {
		if(err) {
			console.log(err);
		}
		console.log(comments_list)
		res.render('discussion_board.ejs', {message: req.flash(), user: req.user, comments: comments_list});
	});
	//res.render('discussion_board.ejs', {message: req.flash(), user: req.user.username, comments: comments_list});
}

exports.post_board = (req,res) => {
	if(req.body.title==null & req.body.message==null){
		const obj = JSON.parse(JSON.stringify(req.body)); 
		const obj_id = Object.keys(obj)[0];
		const obj_val = String(obj[Object.keys(obj)[0]]);
		// const db = client.db(dbName);
		// const collection = db.collection('comments');
		console.log('id: ' + obj_id + ' type: ' + typeof obj_id);
		comment.findOneAndUpdate(
			{ "_id": ObjectID(obj_id)},
			{ $push: { "replies": {"user": req.user.username, "text_reply": obj_val}  } }, function(err, data) {
				if (err) {
					console.log(err);
					req.flash("error", "There is an error processing your request. Please try again")
				}
				console.log("Comment Updated");
				res.redirect('/discussion_board')
			});
	}
	else{
		commentConfig.newComment(req,res)
	}
	
	
}

// client.connect(function(err) {
// 	assert.equal(null, err);
// 	console.log("Successfully connected to the mongodb database");
// })