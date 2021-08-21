const mongoose = require('mongoose');

var ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true, 
        requirement: true
    },
    text:{
        type: String, 
        trim: true,
        required : true
    },
    date: {
        type: Date, 
        default: Date.now
    },
    user:{
        type: String, 
        required: true
    }, 
    center_id: {
        type: String,
        required: true
    },
    replies:[{user: String, text_reply: String}]
});

//CommentSchema.virtual('url').get(function(){
//   return '/post/' + this._id
// })

module.exports = mongoose.model('reviews', ReviewSchema);