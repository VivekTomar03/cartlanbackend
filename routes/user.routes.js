const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");
const { adminAuth } = require("../middlewares/authorization");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { name, email, gender, password} = req.body;

  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        res.status(400).send({"err":err})
      } else {
        const existing = await UserModel.findOne({ email });
        if (existing||email==='dixit@admin.com') {
          res.status(200).send({ "msg": "User already exist" });
        } else {
          let user = new UserModel({
            name,
            email,
            gender,
            password: hash,
          });
          await user.save();
          res.status(200).send({ "msg": "Registered Successfully"});
        }
      }
    });
  } catch (err) {
    res.status(400).send({"err":err.message});
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (_, result) => {
        if (result) {
          const token = jwt.sign({ userId: user._id, user:user.name }, process.env.key);
          res.status(200).send({
            "msg": `Login Successfull`,
            "token": token,
          });
        } else {
          res.status(200).send({ "msg": "Wrong Password" });
        }
      });
    } else if(email==="dixit@admin.com",password==='dixit'){
      const token = jwt.sign({payload:"admin"}, process.env.key);
      res.status(200).send({
        "msg": `Welcome Admin !`,
        "admin":true,
        "token": token,
      });
    }else {
      res.status(200).send({ "msg": `${email} does not exist.` });
    }
  } catch (err) {
    res.status(400).send({ "err": err.message });
  }
});

userRouter.use(adminAuth);

userRouter.get("/", async (req, res) => {
  try {
    const users=await UserModel.find(req.query);
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send({"err":err.message});
  }
});

userRouter.get("/:id", async (req, res) => {
  try {
      const user=await UserModel.findOne({_id:req.params.id})
      res.status(200).send(user);
  } catch (err) {
      res.status(400).send({"err":err.message});
  }
});

userRouter.patch("/update/:id", async (req, res) => {
  const id = req.params.id;

  try {
    if(req.body.password){
      bcrypt.hash(req.body.password, 5, async (err, hash) => {
        req.body.password=hash;
        await UserModel.findByIdAndUpdate({_id:id}, req.body);
        res.status(200).send({ "msg": "User updated successfully"});
      });
    }else{
      await UserModel.findByIdAndUpdate({_id:id}, req.body);
      res.status(200).send({ "msg": "User updated successfully"});
    }

  } catch (err) {
    res.status(400).send({ "msg": err.message });
  }
});

userRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await UserModel.findByIdAndDelete({_id:id});
    res.status(200).send({ "msg": "User deleted successfully" });
  } catch (err) {
    res.status(400).send({ "msg": err.message });
  }
});

module.exports = userRouter;