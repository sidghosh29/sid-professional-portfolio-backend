const jwt = require("jsonwebtoken");
// Helper to generate tokens
const generateTokens = (adminId) => {
  const accessToken = jwt.sign({ adminId }, process.env.JWT_SECRET, {
    expiresIn: "15m", // Short-lived
  });
  const refreshToken = jwt.sign({ adminId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d", // Long-lived
  });
  return { accessToken, refreshToken };
};

module.exports = { generateTokens };
