// modules/admin/controller.js
const Admin = require("./model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin)
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, admin.password);
  if (!ok)
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });

  const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ success: true, token });
};

exports.register = async (req, res) => {
  const { email, password, signupKey } = req.body;

  if (!process.env.ADMIN_SIGNUP_KEY) {
    return res.status(500).json({
      success: false,
      message: "ADMIN_SIGNUP_KEY is not configured",
    });
  }
  if (!signupKey || signupKey !== process.env.ADMIN_SIGNUP_KEY) {
    return res.status(403).json({
      success: false,
      message: "Forbidden Request",
    });
  }
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await Admin.findOne({ email: normalizedEmail });

  if (existing) {
    return res.status(409).json({
      success: false,
      message: "Admin with this email already exists",
    });
  }

  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const admin = await Admin.create({
    email: normalizedEmail,
    password: hashedPassword,
  });

  return res.status(201).json({ success: true });
};
