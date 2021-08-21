const Center= require ('../models/center')
const geocoder = require('../Utils/geocoder')
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Review = require('../models/review');
var ObjectID = require('mongodb').ObjectID;

var redirectToAdd = async (req, res, message) => {
    //console.log(message)
    
    // hardcoded error message
    req.flash('error', "Add failed, center already exists.");
    return res.redirect('/centers/add');
}

var addCenter = async(req, res) => {
    try{
        await Center.create(req.body);
        return res.redirect('/centers')
    } catch (err)
    {
        return redirectToAdd(req, res, err.message);
    }
};

var findAllCenter = async(request, req, res) => {
    await Center.find({},function(err,results)
    {
        if(err)
        {
            console.log(err)
            return res.status(500).json({error: 'find error'})
        }else
        {
            var userAddr = req.body.address
            if(!userAddr){
                userAddr = (!req.cookies.userAddr) ? 'undefined' : req.cookies.userAddr
            }
            var centers = {title : "Current Centers", centers : results, user: req.user, address: userAddr, distance: 'All'}
            res.render(request,centers)
        }
    })
}

var NearfilterDistance = async(req,res) => {
    const loc = await geocoder.geocode(req.body.address);
    await Center.find(
        {location:
            {$near:
                {
                    $geometry:{ type:"Point", coordinates: [ loc[0].longitude,loc[0].latitude]},
                    $maxDistance: req.body.distance*1000
                }
            }
        },
        function(err,results)
        {
            if(err)
            {
                console.log(err)
                return res.status(500).json({error: 'find error'})
            }else
            {
                var centers = {title : "Current Centers", centers : results, user: req.user, distance: req.body.distance}
                res.render('centerlist',centers)
            }
        }
    )
}

var GeoNearfilterDistance = async (req,res) => {
    const loc = await geocoder.geocode(req.body.address);
    await Center.aggregate([
        {
            $geoNear: {
                near: { type: "Point", coordinates: [ loc[0].longitude,loc[0].latitude]},
                distanceField: "dist.calculated",
                maxDistance: req.body.distance*1000,
                spherical: true
            }
        }
    ],function(err,results)
    {
        if(err)
        {
            console.log(err)
            return res.status(500).json({error: 'find error'})
        }else
        {
            var centers = {title : "Current Centers", centers : results, user: req.user,address: req.body.address, distance: req.body.distance}
            res.render('centerlist',centers)
        }
    })
}

var deleteCenter = async (req,res) => {
   await Center.deleteOne({id: req.body.id}, function(err,results)
   {
       if(err){
           res.send(err.message)
           
       }else{
           res.send("success")
       }
   })
}

var resourceCenter = async (req,res) => {
    await Center.findOne({id: req.params.id}, function(err,results)
    {
        if(err){
            console.log(err)
        }else
        {
            var centers = {title : "Current Centers", centers : results, user: req.user}
            console.log(centers)
            res.render('addresource',centers)
        }
    })
}

var addResource = async (req,res) => {
    //console.log(req.body)
    req.body.type = req.body.type.filter(item => item);
    //console.log(req.body.type);
    if((req.body.type).length===1){
        await Center.updateOne({id:req.params.id},{$addToSet: {"resource": { "type": req.body.type[0], "name": req.body.name,"qty": req.body.qty }}}, function(err,results)
        {
            if(err)
            {
                console.log(err)
            }else
            {
                console.log("success")
                res.redirect('/centers')
            }
        })
    }
    else{
        await Center.updateOne({id:req.params.id},{$addToSet: {"resource": { "type": req.body.type[1], "name": req.body.name,"qty": req.body.qty }}}, function(err,results)
        {
            if(err)
            {
                console.log(err)
            }else
            {
                console.log("success")
                res.redirect('/centers')
            }
        })
    }
}


var newReview =  async (req, res) => {
    // find out which post you are reviewing
    const _id= new ObjectID();
    // get the review text and record post id
     const review = new Review({
     title: req.body.title,
     text: req.body.message,
     user: req.user.username,
     center_id: req.query.id,
     post: _id
    })
    // save review
    await review.save(function(err) {
      if(err) {console.log(err)}
      res.redirect('/centers/view/?id='+req.query.id)
    });
  }
  
// edit resource
var editResources = async(req, res) => {
    console.log(`params is ${req.cid}`)
    await Center.findOne(
        { 
            "_id": ObjectID(req.params.id)
        },{
        resource: {
            "$elemMatch": {
                "_id": ObjectID(req.params.rid)}
            }
        }
    ,function(err,results)
    {
        if(err)
        {
            console.log(err)
            return res.status(500).json({error: 'find error'})
        }else
        {results.resource;
            var center = {title : "Edit Resources", center : results, resource : results.resource[0], user: req.user}
            res.render('editResource', center)
        }
    })
}

// save edit
var editResourcesPost = async(req, res) => {
    await Center.updateOne(
        { 
            "_id": ObjectID(req.params.id),
            "resource._id": ObjectID(req.params.rid)
        },{
            $set: {
                'resource.$.name': req.body.name,
                'resource.$.qty': req.body.qty
            }
        },
        {
            upsert: true
        }
      ,function(err,results)
    {
        if(err)
        {
            console.log(err)
            return res.status(500).json({error: 'update error'})
        }else
        {
            var redir = '/centers/view?id=' + req.params.id;
            res.redirect(redir)
        }
    })
}

var likeCenter = async(req,res) => {
    console.log(req.body.id)
    await Center.updateOne({ "_id": ObjectID(req.params.id)},
        { $addToSet: {'likes': req.body.user } },function(err,results)
        {
            if(err){
                console.log(err)
            }else
            {
                var redir = '/centers/view?id=' + req.params.id;
                res.redirect(redir)
            }
        }
    )
}

var unlikeCenter = async(req,res) => {
    await Center.updateOne({ "_id": ObjectID(req.params.id)},
        { $pull: {'likes': req.body.user } },function(err,results)
        {
            if(err){
                //console.log(err)
            }else
            {
                var redir = '/centers/view?id=' + req.params.id;
                res.redirect(redir)
            }
        }
    )
}

module.exports.addCenter= addCenter
module.exports.findAllCenter = findAllCenter
module.exports.NearfilterDistance = NearfilterDistance
module.exports.GeoNearfilterDistance=GeoNearfilterDistance
module.exports.deleteCenter = deleteCenter
module.exports.resourceCenter = resourceCenter
module.exports.addResource = addResource
module.exports.newReview = newReview;
//module.exports.postReview = postReview;
//module.exports.viewCenter = viewCenter;
module.exports.editResources = editResources;
module.exports.editResourcesPost = editResourcesPost;
module.exports.likeCenter = likeCenter;
module.exports.unlikeCenter = unlikeCenter;
