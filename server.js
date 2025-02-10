import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Initialize middleware
app.use(express.json({ extended: false }));

// MongoDB Connection URI from .env file
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ Connected to MongoDB successfully"))
  .catch((error) => {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  });

// Article Schema (moved from db.js)
const articleSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    lowercase: true, // Automatically convert to lowercase
  },
  comments: [
    {
      username: { type: String, required: true },
      text: { type: String, required: true },
    },
  ],
});

// Create Model
const Article = mongoose.model("Article", articleSchema);

// Routes
app.get("/api/articles/:name", async (req, res) => {
  try {
    const articleName = req.params.name.toLowerCase();
    const article = await Article.findOne({ name: articleName });

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
        comments: [],
      });
    }

    res.status(200).json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({
      message: "Error connecting to database",
      error: error.message,
    });
  }
});

// Add comments to an article
app.post("/api/articles/:name/add-comments", async (req, res) => {
  try {
    const { username, text } = req.body;
    const articleName = req.params.name.toLowerCase();

    // Input validation
    if (!username || !text) {
      return res.status(400).json({
        message: "Username and text are required",
      });
    }

    // Find and update the article
    const updatedArticle = await Article.findOneAndUpdate(
      { name: articleName },
      {
        $push: {
          comments: { username, text },
        },
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validation on update
      }
    );

    if (!updatedArticle) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.status(200).json(updatedArticle);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      message: "Error updating article",
      error: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
