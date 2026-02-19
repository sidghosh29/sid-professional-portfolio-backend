const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      // hashed
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Admin", adminSchema);
// In Mongoose, the model name is mapped to a MongoDB collection
// named by lowercasing + pluralizing it (e.g., Admin → admins)
// unless you explicitly set the collection name.
