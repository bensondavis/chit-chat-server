import mongoose from "mongoose";

const init = async () => {
  const dbUrl = process.env.MONGODB_URL;
  return mongoose.connect(dbUrl).then(() => {
    console.log("connected successfully to database");
  });
};

export default init;
