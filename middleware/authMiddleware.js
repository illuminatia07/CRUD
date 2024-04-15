// authMiddleware.js

const authMiddleware = (req, res, next) => {
    
    if (req.session.isAdmin) {
        next(); // Proceed to the next middleware
    } else {
        res.redirect('/admin/login'); // Redirect to the admin login page
    }
};

module.exports = authMiddleware;
