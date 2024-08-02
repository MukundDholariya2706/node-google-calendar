const mongoose = require("mongoose");

let authenticationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: false,
    },
    refresh_token: {
      type: String,
      required: false,
    },
    access_token: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Authentication = mongoose.model(
  "authentication",
  authenticationSchema,
  "authentication"
);

module.exports = Authentication;
