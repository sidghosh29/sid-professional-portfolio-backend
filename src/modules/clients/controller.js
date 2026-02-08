const Client = require("./model.js");

exports.getClients = async (req, res, next) => {
  try {
    const clients = await Client.find()
      .sort({ createdAt: 1 })
      //   .select("name logoUrl")
      .lean();

    return res.status(200).json({ success: true, data: clients });
  } catch (error) {
    next(error);
  }
};

exports.createClient = async (req, res, next) => {
  try {
    const { name, logoUrl } = req.body;

    if (!name || !logoUrl) {
      return res
        .status(400)
        .json({ success: false, error: "Name and logoUrl are required" });
    }

    const newClient = await Client.create({
      name: name.trim(),
      logoUrl: logoUrl.trim(),
    });
    return res.status(201).json({ success: true, data: newClient });
  } catch (error) {
    next(error);
  }
};
