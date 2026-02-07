module.exports = function validateContact(req, res, next) {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Invalid name",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email",
    });
  }

  if (message.trim().length < 5) {
    return res.status(400).json({
      success: false,
      message: "Message too short",
    });
  }

  // sanitize
  req.body.name = name.trim();
  req.body.email = email.trim();
  req.body.message = message.trim();

  next();
};
