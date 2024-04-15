// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userSession = require("../middleware/userSession");
// Render login page
router.get("/login", (req, res) => {
  if(req.session.isAuth){
    res.redirect("/home")
  }else{
    res.render('login', { errorMessage: '', successMessage: '' });  // Render the login page using EJS
  }
  
});

router.post("/login", userController.login); // Handle login POST request

// Render signup page
router.get("/signup", (req, res) => {
  if(req.session.isAuth){
    res.redirect("/home")
  }else{
    res.render("signup", { errorMessage: "", successMessage: "" }); // Pass errorMessage and successMessage as null initially
  }
  
});

// Handle signup POST request
router.post("/signup", userController.signup);

// Render home page
router.get("/home",userSession, userController.renderHome);

router.post("/logout",userSession, userController.logout);

// Define other user routes (e.g., getUser, updateUser, deleteUser)

module.exports = router;
