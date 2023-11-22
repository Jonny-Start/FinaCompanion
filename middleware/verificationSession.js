function verifySession(req, res, next) {
  if (req.path == "/login" || req.path == "/" || req.path == "/createAccount" || req.path == "/recoveryPassword") {
    return req.session.userID ? res.redirect("/home") : next();
  }

  if (!req.session.userID) {
    return res.redirect("/login");
  }

  if (req.path == "/codeEmail" && req.method != 'POST') {
    return req.session.validationEmail ? next() : res.redirect("/home");
  }

  if (!!req.session.validationEmail && req.method != 'POST') {
    return res.redirect("/codeEmail");
  }

  next();
}

module.exports = { verifySession };
