const express = require("express");
const connection = require("./config/db");
const cors = require("cors");
const userRouter = require("./routes/user.routes");
const ringRouter = require("./routes/ring.routes");
const earringRouter = require("./routes/earring.routes");
const cartRouter = require("./routes/cart.routes");
const {userAuth} = require("./middlewares/authorization");
const searchRouter = require("./routes/search.routes");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/rings", ringRouter);
app.use("/earrings", earringRouter);
app.use("/search",searchRouter)
app.use(userAuth);
app.use("/cart", cartRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
  }
});