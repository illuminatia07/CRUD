const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');
const session = require('express-session')

router.get('/', (req, res) => {
  res.redirect('/admin/login');
});
// Admin login route without middleware
router.get('/login', adminController.renderLogin);

router.post('/login', adminController.loginPost);

// Admin dashboard route (accessible only to authenticated admins)
router.get('/dashboard', authMiddleware, adminController.renderDashboard);



// Route to display users list (accessible only to authenticated admins)
router.get('/users', authMiddleware, adminController.renderUserList);
router.get('/users/search', authMiddleware, adminController.searchUsers);
router.post('/users/create', authMiddleware, adminController.createUser);
router.post('/users/delete/:userId', authMiddleware, adminController.deleteUser);
router.post('/users/update/:userId', authMiddleware, adminController.updateUser);
router.get('/users/edit/:userId', adminController.renderEditUser);
router.post('/logout', adminController.logout);

module.exports = router;
