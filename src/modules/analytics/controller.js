// modules/analytics/controller.js
const Analytics = require("./model");

exports.trackVisit = async (req, res) => {
  await Analytics.findOneAndUpdate(
    { key: "visits" },
    { $inc: { count: 1 } },
    { upsert: true, new: true },
  );

  res.status(200).json({ success: true });
};
