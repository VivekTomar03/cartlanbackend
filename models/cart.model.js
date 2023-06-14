const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  userId:{type: String,required:true},
  user:{type: String,required:true},
  imageurl:{type: String,required:true},
  image:{type: String,required:true},
  price:{type: Number,required:true},
  originalprice:{type: Number,required:true},
  title:{type: String,required:true},
  size:{type: Number,required:true},
  quantity:{type: Number,required:true}
});

const CartModel = mongoose.model("cart", cartSchema);
module.exports = CartModel;