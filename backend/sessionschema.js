const mongoose = require("mongoose");
const sessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    messages: [
      {
        role: { type: String, enum: ["user", "bot"], required: true },
        content: { type: String, required: true },
      },
    ],
  });
  module.exports = mongoose.model.session || mongoose.model("session", sessionSchema);
  