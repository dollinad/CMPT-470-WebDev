const mongoose = require('mongoose');

if(process.env.MONGO_URL) { 
    mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true});
} else {
    mongoose.connect('mongodb://localhost/fightagainstcovid', {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true});
}
var db = mongoose.connection;