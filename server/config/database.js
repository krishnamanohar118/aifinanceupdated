import mongoose from "mongoose";

export async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    console.warn(
      "MongoDB is not configured: MONGODB_URI is missing. The API will run without a database.",
    );
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    return false;
  }
}
