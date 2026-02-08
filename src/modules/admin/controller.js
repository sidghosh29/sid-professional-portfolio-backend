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
