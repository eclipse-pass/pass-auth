export default function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  if (req.xhr) {
    return res.status(401).send('You are not authenticated');
  }

  res.redirect(process.env.AUTH_LOGOUT_REDIRECT);
}
