import connectDB from "./db/connectDB.js";
import app from "./app.js";
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("DB Connection Failed \n", error);
  });
