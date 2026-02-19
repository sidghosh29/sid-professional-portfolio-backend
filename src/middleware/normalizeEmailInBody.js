module.exports = function normalizeEmailInBody(req, res, next) {
  if (req.body?.email != null) {
    req.body.email = String(req.body.email).trim().toLowerCase();
  }
  if (req.body?.password != null) {
    req.body.password = String(req.body.password);
  }
  next();
};
