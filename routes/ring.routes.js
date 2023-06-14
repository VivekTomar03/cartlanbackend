const express = require("express");
const RingModel = require("../models/ring.model");
const { adminAuth } = require("../middlewares/authorization");
const ringRouter = express.Router();

ringRouter.get("/", async (req, res) => {
    let sort,page,limit,from,till,rings;
    
    if(req.query.sort==="asc"){
      sort=1;
    }else if(req.query.sort==="desc"){
      sort=-1;
    }

    let type=req.query.type
    let sortObj={};
    sortObj[type]=sort;

    page= +req.query.page;
    limit= +req.query.limit;

    from= +req.query.from;
    till= +req.query.till;

    delete req.query.sort;
    delete req.query.type;
    delete req.query.page;
    delete req.query.limit;
    delete req.query.from;
    delete req.query.till;

    try {
      if(sort && type && from>0 && till>0){
        rings=await RingModel.find({$and:[req.query,{$and:[{price: {$gte: from}},{price: {$lte: till}}]}]}).sort(sortObj);;
      }else if(from>0 && till>0){
        rings=await RingModel.find({$and:[req.query,{$and:[{price: {$gte: from}},{price: {$lte: till}}]}]});
      }else if(sort && type){
        rings=await RingModel.find(req.query).sort(sortObj);
      }else{
        rings=await RingModel.find(req.query)
      }

      if(page>0 && limit>0){
        rings=rings.slice((page-1) * limit, page * limit)
      }else if(page<0 || limit<0){
        rings=[];
      }

      res.status(200).send(rings);
    } catch (err) {
        res.status(400).send({"err":err.message});
    }
});

ringRouter.get("/:id", async (req, res) => {
    try {
        const ring=await RingModel.findOne({_id:req.params.id})
        res.status(200).send(ring);
    } catch (err) {
        res.status(400).send({"err":err.message});
    }
});

ringRouter.use(adminAuth);

ringRouter.post("/add", async (req, res) => {
  try {
    const ring = new RingModel(req.body);
    await ring.save();
    res.status(200).send({ "msg": "Product added successfully"});
  } catch (err) {
    res.status(400).send({ "msg": err.message });
  }
});

ringRouter.patch("/update/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await RingModel.findByIdAndUpdate({_id:id}, req.body);
    res.status(200).send({ "msg": "Product updated successfully"});
  } catch (err) {
    res.status(400).send({ "msg": err.message });
  }
});

ringRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await RingModel.findByIdAndDelete({_id:id});
    res.status(200).send({ "msg": "Product deleted successfully" });
  } catch (err) {
    res.status(400).send({ "msg": err.message });
  }
});

module.exports = ringRouter;