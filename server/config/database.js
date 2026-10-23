
import mongoose from "mongoose";

export async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  const start = Date.now();

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    console.log(
      `MongoDB connected in ${Date.now() - start} ms`
    );

    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}
