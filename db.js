import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// MongoDB Connection URI from .env file
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Avoid infinite waiting
    });
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

// Schema and Model
const articleSchema = new mongoose.Schema({
  name: { type: String, unique: true }, // Prevent duplicate entries
  comments: { type: Array, default: [] },
});

const Article = mongoose.model("Article", articleSchema);

// Insert Data (Prevent Duplicates)
const insertData = async () => {
  try {
    const articles = [
      { name: "learn-react", comments: [] },
      { name: "learn-node", comments: [] },
      { name: "my-thoughts-on-learning-react", comments: [] },
    ];

    for (const article of articles) {
      await Article.updateOne(
        { name: article.name }, // Search condition
        { $setOnInsert: article }, // Insert only if not exists
        { upsert: true } // Create if missing
      );
    }

    console.log("✅ Data inserted successfully");
  } catch (error) {
    console.error("❌ Error inserting data:", error);
  } finally {
    mongoose.connection.close(); // Close DB connection
  }
};

// Run functions
connectDB().then(insertData);
