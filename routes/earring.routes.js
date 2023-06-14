const express = require("express");
const EarringModel = require("../models/earring.model");
const { adminAuth } = require("../middlewares/authorization");
const earringRouter = express.Router();

earringRouter.get("/", async (req, res) => {
  let sort,page,limit,from,till,earrings;
    
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
        earrings=await EarringModel.find({$and:[req.query,{$and:[{price: {$gte: from}},{price: {$lte: till}}]}]}).sort(sortObj);;
      }else if(from>0 && till>0){
        earrings=await EarringModel.find({$and:[req.query,{$and:[{price: {$gte: from}},{price: {$lte: till}}]}]});
      }else if(sort && type){
        earrings=await EarringModel.find(req.query).sort(sortObj);
      }else{
        earrings=await EarringModel.find(req.query)
      }

    if(page>0 && limit>0){
      earrings=earrings.slice((page-1) * limit, page * limit)
    }else if(page<0 || limit<0){
      earrings=[];
    }

    res.status(200).send(earrings);
  } catch (err) {
      res.status(400).send({"err":err.message});
  }
});

earringRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const earring=await EarringModel.findOne({_id:id})
        res.status(200).send(earring);
    } catch (err) {
        res.status(400).send({"err":err.message});
    }
});

earringRouter.use(adminAuth);

earringRouter.post("/add", async (req, res) => {
  try {
    const earring = new EarringModel(req.body);
    await earring.save();
    res.status(200).send({ "msg": "Product added successfully"});
  } catch (err) {
    res.status(400).send({ "msg": err.message });
  }
});

earringRouter.patch("/update/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await EarringModel.findByIdAndUpdate({_id:id}, req.body);
    res.status(200).send({ "msg": "Product updated successfully"});
  } catch (err) {
    res.status(400).send({ "msg": err.message });
  }
});

earringRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await EarringModel.findByIdAndDelete({_id:id});
    res.status(200).send({ "msg": "Product deleted successfully" });
  } catch (err) {
    res.status(400).send({ "msg": err.message });
  }
});

module.exports = earringRouter;