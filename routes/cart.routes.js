const express = require("express");
const CartModel = require("../models/cart.model");
const cartRouter = express.Router();

cartRouter.get("/", async (req, res) => {
    try {
        const Cart=await CartModel.find({userId:req.body.userId})
        res.status(200).send(Cart);
    } catch (err) {
        res.status(400).send({"err":err.message});
    }
});

cartRouter.post("/add", async (req, res) => {
  req.body.quantity=1;
    
  try {
    const Cart = new CartModel(req.body);
    await Cart.save();
    res.status(200).send({ "msg": "Product added to the cart"});
  } catch (err) {
    res.status(400).send({ "msg": err.message });
  }
});

cartRouter.patch("/update/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await CartModel.findByIdAndUpdate({_id:id}, req.body);
    res.status(200).send({ "msg": "Cart updated successfully"});
  } catch (err) {
    res.status(400).send({ "msg": err.message });
  }
});

cartRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await CartModel.findByIdAndDelete({_id:id});
    res.status(200).send({ "msg": "Product deleted from the cart" });
  } catch (err) {
    res.status(400).send({ "msg": err.message });
  }
});

module.exports = cartRouter;