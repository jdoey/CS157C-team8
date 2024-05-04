const checkLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    res.status(401).send("You are not logged in");
    return;
  }
  next();
};

module.exports = { checkLoggedIn };
