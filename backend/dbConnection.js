import mongoose from "mongoose";

const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("db connected successfully"))
    .catch((err) => {
      console.log("error while connecting db", err);
      process.exit(1);
    });
}

export default dbConnection;
