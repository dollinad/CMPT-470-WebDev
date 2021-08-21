const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
const geocoder = require('../Utils/geocoder')
const resourceSchema = require('./resource')

const CenterSchema = new mongoose.Schema({
    site:{
        type:String,
        require: true,
        minLength: 1,
    },
    address:{
        type: String,
        require: true
    },
    user:{
      type : String,
      minLength: 6,
      maxLength: 20
    },
    likes:[String],
    location: {
        type: {
          type: String,
          enum: ['Point'],
        },
        coordinates: {
          type: [Number],
        },
        formattedAddress: 
        {
          type: String,
          unique: true,
        },
        city: String,
        country: String
      },
      resource: [resourceSchema],
      createdAt:
      {
          type:Date,
          default:Date.now
      }
});

CenterSchema.pre('save',async function(next)
{
  console.log(`this address is ${this.address}`)
  const location = await geocoder.geocode(this.address);
  this.location = { 
    type: "Point",
    coordinates: [location[0].longitude, location[0].latitude],
    formattedAddress: location[0].formattedAddress,
    city:location[0].city,
    country:location[0].country
  }
  this.address=undefined;
  next()
})

CenterSchema.index({"location":"2dsphere"})
CenterSchema.plugin(AutoIncrement, {inc_field: 'id'});
module.exports = mongoose.model('Center',CenterSchema)