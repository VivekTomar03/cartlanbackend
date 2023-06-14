const mongoose = require("mongoose");

const earringSchema = mongoose.Schema({
  imageurl:{type: String,required:true},
  image:{type: String,required:true},
  price:{type: Number,required:true},
  originalprice:{type: Number,required:true},
  title:{type: String,required:true},
  size:{type: Number,required:true},
});

const EarringModel = mongoose.model("earring", earringSchema);
module.exports = EarringModel;