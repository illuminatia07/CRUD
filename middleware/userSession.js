const userSession = (req, res, next) => {
    
    if (req.session.isAuth) {
        next(); // Proceed to the next middleware
    } else {
        res.redirect('/login'); // Redirect to the admin login page
    }
};

module.exports = userSession;
