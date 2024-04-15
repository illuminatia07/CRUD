// controllers/userController.js
const bcrypt = require("bcrypt");
const User = require("../models/User");

const userController = {
  login: async (req, res) => {
    try {
      // Extract data from request body
      const { email, password } = req.body;
  req.session.password=password;
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.render("login", {
          errorMessage: "Invalid email or password",
          successMessage: "",
        });
      }
  
      // Set the username in session
      req.session.email = user.email;
      req.session.isAuth=true;
      // Redirect to the home page after successful login
      res.redirect("/home");
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  logout: async (req, res) => {
    try {
      // Destroy the session
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res.status(500).json({ error: "Failed to logout" });
        } else {
          // Redirect to login page after logout
          return res.redirect("/login");
        }
      });
    } catch (error) {
      console.error("Error logging out:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  signup: async (req, res) => {
    try {
      if(req.session.isAuth){
        res.redirect("/home")
      }else{
      // Extract data from request body
      const { username, email, password } = req.body;

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.render("signup", {
          errorMessage: "Email already exists",
          successMessage: "",
        });
      }

      // Hash the password
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Create a new user instance with hashed password
      const newUser = new User({ username, email, password: hashedPassword });

      // Save the user to the database
      await newUser.save();

      // Redirect to login page after successful signup
      res.render("login", {
        errorMessage: "",
        successMessage: "Signed Up Successfully",
      });
    }
    } catch (error) {
      console.error("Error in signup:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  renderHome: async (req, res) => {
    try {
      if(req.session.isAuth){
 // Check if the username is stored in the session
 const email = req.session.email;
 const password = req.session.password;
 
 const user = await User.findOne({email})
 

 if (!user || !bcrypt.compareSync(password, user.password)) {
   return res.render("login", {
     errorMessage: "Credentials has been updated",
     successMessage: "",
   });
 }
 
 // Render the home page
 res.render("home", {username:user.username});
      }else{
        res.redirect("/login")
      }
     
    } catch (error) {
      console.error("Error rendering home page:", error);
      res.status(500).send("Internal Server Error");
    }
  },
  // Other controller methods for getUser, updateUser, deleteUser...
};

module.exports = userController;
