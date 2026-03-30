import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) return true;
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB ga muvaffaqiyatli ulandik! 🍃");
  } catch (error) {
    console.log("MongoDB ulanishida xatolik: ", error);
  }
};

export default connectMongoDB;