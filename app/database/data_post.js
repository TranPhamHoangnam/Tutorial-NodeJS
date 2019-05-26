var mongoose = require('mongoose');

var blog_post = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    created_at: Date,
    updated_at: Date
}, { collection: "posts" })

module.exports = mongoose.model('post_Model', blog_post);