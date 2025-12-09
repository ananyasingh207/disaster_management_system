const mongoose = require("mongoose");

const citizenSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String },

    password: { type: String, required: true }, // hashed

    role: {
      type: String,
      default: "citizen",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Citizen", citizenSchema, "citizens");
