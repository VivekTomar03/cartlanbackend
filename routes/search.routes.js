const express = require("express");
const RingModel = require("../models/ring.model");
const EarringModel = require("../models/earring.model");
const searchRouter = express.Router();

searchRouter.get("/", async (req, res) => {
    try {
        let q=req.query.q;
        let page= +req.query.page;
        let limit= +req.query.limit;

        // delete req.query.sort;
        // delete req.query.type;
        delete req.query.page;
        delete req.query.limit;
        delete req.query.q;

        if(req.query.size){
            req.query.size= +req.query.size;
        }else if(req.query.price){
            req.query.price= +req.query.price;
        }else if(req.query.originalprice){
            req.query.originalprice= +req.query.originalprice;
        }

        const rings=await RingModel.aggregate([
            {
              $search: {
                index: "searchRings",
                text:{
                  query:q,
                  path:{
                    'wildcard':'*'
                  }
                }
              }
            },
            {
                $match: req.query
            }
            
        ]);

        const earrings=await EarringModel.aggregate([
            {
              $search: {
                index: "searchEarrings",
                text:{
                  query:q,
                  path:{
                    'wildcard':'*'
                  }
                }
              }
            },
            {
                $match: req.query
            }
            
        ]);

        let products=[...rings,...earrings]

        if(page>0 && limit>0){
            products=products.slice((page-1) * limit, page * limit)
        }else if(page<0 || limit<0){
            products=[];
        }

      res.status(200).send(products);
    } catch (err) {
        res.status(400).send({"err":err.message});
    }
});

module.exports = searchRouter;