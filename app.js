// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');

// Import routes
const userRoutes = require('../Week-6 Technical/routes/userRoutes');
const adminRoutes = require('../Week-6 Technical/routes/adminRoutes');
const flash = require('connect-flash');


// Create an instance of the Express application
const app = express();

// Configure session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Middleware configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Connect to the database
mongoose.connect('mongodb://localhost:27017/CRUD')
.then(() => {
  console.log('Connected to the database');
})
.catch((err) => {
  console.error('Error connecting to the database', err);
});

app.use(flash());

// User routes
app.use('/', userRoutes);

// Admin routes
app.use('/admin', adminRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
