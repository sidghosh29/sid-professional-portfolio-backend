const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true },
    count: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Analytics", analyticsSchema);
