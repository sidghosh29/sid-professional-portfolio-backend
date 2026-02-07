const Message = require("./model.js");
const { sendContactEmail } = require("../../utils/mailer.js");

exports.contact = async (req, res, next) => {
  try {
    // Avoid mass assignment by only extracting expected fields
    const { name, email, message } = req.body;
    await Message.create({ name, email, message });
    await sendContactEmail({ name, email, message });
    console.log("Message sent");

    return res.status(201).json({
      success: true,
      message: "Message received",
    });
  } catch (err) {
    next(err);
  }
};
