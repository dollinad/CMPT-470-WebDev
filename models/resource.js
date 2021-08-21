const mongoose = require('mongoose')

var ResourceSchema = new mongoose.Schema({
    type:{
      type: String,
      require: true,
    },
    name:{
      type: String,
      require: true,
    },
    qty:{
      type: Number,
      require: true,
      min: 0
    }
  }, { collection : 'resource' });

  module.exports= ResourceSchema
