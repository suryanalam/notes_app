import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import app from "./app.js";

// Config the dotenv to track ENV variables
dotenv.config({
  path: "./.env",
}); 

// DB Connection
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("DB Connection Failed !! \n", error);
  });
