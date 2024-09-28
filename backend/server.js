const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

//Models
require("./models/User");
require("./models/Task");


//Routes
const userRouter = require("./routes/userRouter");
const todoRouter = require("./routes/todoRouter");


//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const authorizeLogin = require("./middlewares/authorizeLogin");


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("db connected..."))
  .catch((err) => {
    console.log("error while connecting db", err);
    process.exit(1);
  });

//Api's
app.use(userRouter);
app.use("/task", authorizeLogin, todoRouter);


app.listen(process.env.PORT, () => {
  console.log("server started at port", process.env.PORT);
});