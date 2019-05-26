var mongoose = require('mongoose');

var blog_codeto = new mongoose.Schema({
    email: String,
    password: String,
    first_name: String,
    last_name: String,
    created_at: Date,
    update_at: Date
}, { collection: "user" })

module.exports = mongoose.model('user_Model', blog_codeto);