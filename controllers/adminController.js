const bcrypt = require("bcrypt");
const User = require("../models/User");

const adminController = {
  loginPost: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.render("admin/adminLogin", {
          errorMessage: "Invalid email or password",
        });
      }
      if (user.isAdmin) {
        // If the user is an admin, check the password
        if (bcrypt.compareSync(password, user.password)) {
          req.session.user = user;
          req.session.isAdmin = true;
          return res.redirect("/admin/dashboard");
        } else {
          // If password is incorrect
          return res.render("admin/adminLogin", {
            errorMessage: "Invalid email or password",
          });
        }
      } else {
        // If the user is not an admin
        return res.render("admin/adminLogin", {
          errorMessage: "You are not an admin",
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      return res.status(500).send("Internal Server Error");
    }
  },
  renderLogin: (req, res) => {
    if (req.session.isAdmin) {
      res.redirect("/admin/dashboard");
    } else {
      res.render("admin/adminLogin", { errorMessage: "", successMessage: "" });
    }
  },

  renderDashboard: async (req, res) => {
    try {
      if (req.session.isAdmin) {
        const users = await User.find({});
        const successMessage = req.session.successMessage || ""; // Set successMessage to an empty string if it's not defined in the session
        res.render("admin/adminPanel", { users, successMessage }); // Pass successMessage to the view
      } else {
        res.redirect("/admin/login");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  renderUserList: async (req, res) => {
    try {
      const users = await User.find({ isAdmin: false }, "email username"); // Exclude admin user and retrieve email and username fields
      res.render("userlist", { users });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  searchUsers: async (req, res) => {
    try {
      // Get the search query from request parameters
      const query = req.query.query;
      // Search for users excluding the admin user
      const users = await User.find(
        {
          $and: [
            { isAdmin: false },
            { $or: [{ username: { $regex: query, $options: "i" } }] },
          ],
        },
        "email username"
      );

      // Check if no user matches the search query
      if (users.length === 0) {
        // If no user found, render adminPanel with noUserFound flag
        return res.render("admin/adminPanel", { users, noUserFound: true });
      }

      // Render the adminPanel page with the search results
      return res.render("admin/adminPanel", { users });
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  createUser: async (req, res) => {
    const { name, email, password } = req.body;

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).send("User already exists");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user object
      const newUser = new User({
        email,
        password: hashedPassword,
        username: name,
      });

      // Save the new user to the database
      await newUser.save();

      // Set successMessage in session
      req.session.successMessage = "User added successfully";

      // Redirect to admin panel
      res.redirect("/admin/dashboard");
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  deleteUser: async (req, res) => {
    try {
      // Extract the user id from the request parameters
      const userId = req.params.userId;

      // Delete the user from the database by ID
      await User.findByIdAndDelete(userId);

      // Set success message
      req.session.successMessage = "User deleted successfully";

      // Redirect back to the admin panel
      res.redirect("/admin/dashboard");
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  renderEditUser: async (req, res) => {
    try {
        if(req.session.isAdmin){
            const userId = req.params.userId;
            const user = await User.findById(userId);
            if (!user) {
              return res.status(404).send("User not found");
            }
            res.render("editUser", { user });  
        }else{
            res.redirect("/admin/login");
        }
      
    } catch (error) {
      console.error("Error rendering edit user form:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  editUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const { username, email, password } = req.body;

      // Find the user by ID
      let user = await User.findById(userId);

      if (!user) {
        return res.status(404).send("User not found");
      }

      // Update user fields
      user.username = username;
      user.email = email;

      if (password) {
        // If password is provided, hash and update it
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }

      // Save the updated user
      await user.save();

      req.session.successMessage = "User updated successfully";
      res.redirect("/admin/dashboard");
    } catch (error) {
      console.error("Error editing user:", error);
      res.status(500).send("Internal Server Error");
    }
  },
  updateUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const { username, email } = req.body;
      let pass=req.body.password;
      const hashedPassword = await bcrypt.hash(pass, 10);
      const password = hashedPassword;
      // Update user document in the database
      await User.findByIdAndUpdate(userId, { username, email, password });

      req.session.successMessage = "User updated successfully";
      res.redirect("/admin/dashboard");
    } catch (error) {
      console.error("Error updating user:", error);
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
          return res.redirect("/admin/login");
        }
      });
    } catch (error) {
      console.error("Error logging out:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = adminController;
