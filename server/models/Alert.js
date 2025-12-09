const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema(
  {
    message: String,
    region: String,
    type: String,
    severity: String,
    expiresAt: Date,

    active: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", AlertSchema);
