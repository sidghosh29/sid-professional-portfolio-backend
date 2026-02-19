// modules/admin/controller.js
const Admin = require("./model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateTokens } = require("../../utils/token.util");

const isProduction = process.env.NODE_ENV === "production";

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

  // const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
  //   expiresIn: "1d",
  // });

  // Generate both tokens
  const { accessToken, refreshToken } = generateTokens(admin._id);

  // Send Refresh Token as HTTPOnly Cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction, // true in production
    sameSite: isProduction ? "none" : "lax", // 'none' for cross-site in production, 'lax' for development
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({ success: true, accessToken });
};

exports.refresh = (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "No refresh token" });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err)
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });

    // Issue new Access Token
    const accessToken = jwt.sign(
      { adminId: decoded.adminId },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.json({ success: true, accessToken });
  });
};

exports.logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
  res.json({ success: true, message: "Logged out" });
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

  return res
    .status(201)
    .json({ success: true, message: "Admin registered successfully" });
};
