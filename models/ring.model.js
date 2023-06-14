const mongoose = require("mongoose");

const ringSchema = mongoose.Schema({
  imageurl:{type: String,required:true},
  image:{type: String,required:true},
  price:{type: Number,required:true},
  originalprice:{type: Number,required:true},
  title:{type: String,required:true},
  size:{type: Number,required:true},
});

const RingModel = mongoose.model("ring", ringSchema);
module.exports = RingModel;