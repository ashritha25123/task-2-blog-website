const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/simple-blog', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Define Post schema
const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Post = mongoose.model('Post', postSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', async (req, res) => {
    const posts = await Post.find({});
    res.render('index.ejs', { posts });
});

app.get('/newpost', (req, res) => {
    res.render('newpost.ejs');
});

app.post('/newpost', async (req, res) => {
    const { title, content } = req.body;
    const post = new Post({ title, content });
    await post.save();
    res.redirect('/');
});

app.get('/post/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('post.ejs', { post });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
