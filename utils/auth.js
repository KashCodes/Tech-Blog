// Provides rule that only allows certain aspects of blog to those who have the authority, AKA someone logged in
const withAuth = (req, res, next) => {
  if (!req.session.user_id) {
    res.redirect('/login');
  } else {
    next();
  }
};

module.exports = withAuth;