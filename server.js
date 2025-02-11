import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors"; // Add CORS for API access

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config();

// Initialize express
const app = express();
const PORT = process.env.PORT || 8000;

// Initialize middleware
app.use(cors()); // Add CORS middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Article Schema
const articleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    comments: [
      {
        username: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }, // Add timestamp to comments
      },
    ],
  },
  {
    timestamps: true, // Add timestamps to articles
  }
);

// Create Model
const Article = mongoose.model("Article", articleSchema);

// API Routes
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

app.post("/api/articles/:name/add-comments", async (req, res) => {
  try {
    const { username, text } = req.body;
    const articleName = req.params.name.toLowerCase();

    if (!username || !text) {
      return res.status(400).json({
        message: "Username and text are required",
      });
    }

    const updatedArticle = await Article.findOneAndUpdate(
      { name: articleName },
      {
        $push: {
          comments: { username, text },
        },
      },
      {
        new: true,
        runValidators: true,
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

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "my-app/build")));

  // Any route that is not api will be redirected to index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "my-app/build", "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something broke!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Start server
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
