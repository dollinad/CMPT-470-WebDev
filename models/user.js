const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


var UserSchema = new mongoose.Schema({
	name: {
		type : String
	},
	username: {
		type : String,
		required : true,
		unique: true,
		minLength: 6,
		maxLength: 20
	},
	email: {
		type : String,
		required : true,
		unique: true
	},
	password: {
		type : String
	},
	emailConfirmed: {
		type : Boolean,
		required : true,
		default : false
	},
	emailToken: {
		type : String
	},
	resetPasswordToken: {
		type : String,
		default: ''
	},
	linkExpires: {
		type : Number,
		default:''
	},
	verifiedUser: {
		type : Boolean,
		required : true,
		default : false
	},
	instagram: {
		type: String,
		default: ''
	},
	facebook: {
		type: String,
		default: ''
	},
	tiktok: {
		type: String,
		default: ''
	},
	docLinks: {
		type : [String],
		default: []
	},
	mobile: {
		type: String,
		default: ''
	},
	type: {
		type: String,
		default: ''
	},
	profilePic: {
		type: String,
		default: ''
	}
});

// This adds some methods to the UserSchema
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);