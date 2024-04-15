// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  updatedTime: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false } 
});

const User = mongoose.model('User', userSchema);

module.exports = User;
