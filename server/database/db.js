
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Remove deprecated options as they're no longer needed in newer MongoDB driver versions
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
};

export default connectDB;