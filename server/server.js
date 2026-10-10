import dotenv from "dotenv";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";

// Load environment variables
dotenv.config({
  path: new URL("../.env", import.meta.url)
});

// Check Gemini API key
console.log(
  "Gemini API key loaded:",
  !!process.env.GEMINI_API_KEY
);

const port = Number(process.env.PORT) || 5000;

// Connect to database
connectDatabase();

// Start server
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});