// Middleware to check if user is authenticated
function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    req.session.returnTo = req.originalUrl;
    return res.redirect("/auth/login");
  }
}

// Middleware to check if user is admin
function requireAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === "admin") {
    return next();
  } else {
    return res.status(403).render("error", {
      title: "Access Denied",
      message: "You do not have permission to access this page.",
      error: {},
    });
  }
}

// Middleware to redirect if already logged in
function redirectIfLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    if (req.session.user.role === "admin") {
      return res.redirect("/admin/dashboard");
    } else {
      return res.redirect("/user/dashboard");
    }
  }
  return next();
}

module.exports = {
  requireAuth,
  requireAdmin,
  redirectIfLoggedIn,
};
