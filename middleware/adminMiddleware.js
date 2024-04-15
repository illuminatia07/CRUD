// adminMiddleware.js

const checkAdminAccess = (req, res, next) => {
    const user = req.session.user;
    if (user && user.isAdmin) {
        next(); // Proceed to the next middleware or route handler
    } else {
        req.flash('error', 'You are not an admin'); // Set flash error message
        res.redirect('/admin/login');
    }
};

module.exports = checkAdminAccess;
