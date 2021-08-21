var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Comment = require('../models/comment');
var ObjectID = require('mongodb').ObjectID;
var newComment =  async (req, res) => {
  // find out which post you are commenting
  const _id= new ObjectID();
  // get the comment text and record post id
   const comment = new Comment({
   title: req.body.title,
   text: req.body.message,
   user: req.user.username,
   post: _id
  })
  // save comment
  await comment.save(function(err) {
    if(err) {console.log(err)}
    res.redirect('/discussion_board')
  });
}

module.exports.newComment = newComment;