A RESTful API built with MongoDB, Express, and Node.js for managing blog articles and comments.

## 🚀 Features

- Article management with duplicate prevention
- Comment system for articles
- MongoDB integration with Mongoose
- Error handling and validation
- RESTful API endpoints

## 🛠️ Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv for environment variables

## ⚙️ Installation

1. Clone the repository:
```bash
git clone https://github.com/mustafoyev-202/MERN_BLOG_APP
cd blog
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add:
```bash
MONGO_URI=your_mongodb_connection_string
PORT=8000
```

4. Initialize the database:
```bash
node db.js
```

5. Start the server:
```bash
node server.js
```

## 📝 API Endpoints

### Get Article
```
GET /api/articles/:name
```
Returns article information and comments.

#### Response
```json
{
  "name": "article-name",
  "comments": [
    {
      "username": "user1",
      "text": "Great article!"
    }
  ]
}
```

### Add Comment
```
POST /api/articles/:name/add-comments
```

#### Request Body
```json
{
  "username": "user1",
  "text": "This is a comment"
}
```

#### Response
Returns the updated article with the new comment.

## 🗄️ Database Schema

### Article
```javascript
{
  name: { type: String, unique: true, required: true, lowercase: true },
  comments: [{
    username: { type: String, required: true },
    text: { type: String, required: true }
  }]
}
```

## 🔒 Error Handling

The API includes error handling for:
- Database connection issues
- Invalid article names
- Missing comments data
- Duplicate articles
- Server errors

## 💻 Development

### Project Structure
```
├── server.js      # Main application file
├── db.js          # Database configuration
├── .env           # Environment variables
└── README.md      # Documentation
```

### Running in Development Mode
```bash
npm run dev
```

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.
