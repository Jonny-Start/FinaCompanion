function verifySession(req, res, next) {
  if (req.path == "/login" || req.path == "/" || req.path == "/createAccount") {
    return req.session.userID ? res.redirect("/home") : next();
  }

  if (!req.session.userID) {
    return res.redirect("/login");
  }

  if (req.path == "/codeEmail") {
    return req.session.validationEmail ? next() : res.redirect("/home");
  }

  if (!!req.session.validationEmail) {
    return res.redirect("/codeEmail");
  }

  next();
}

module.exports = { verifySession };
