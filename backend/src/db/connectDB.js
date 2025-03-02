import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const db = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`DB Connected !! DB HOST: ${db.connection.host}`);
  } catch (error) {
    console.log("DB Connection Failed !! \n", error);
    process.exit(1);
  }
};

export default connectDB;
