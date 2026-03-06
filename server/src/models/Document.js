const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  signature: {
  imagePath: String,
  x: Number,
  y: Number,
  signedAt: Date
},
});

module.exports = mongoose.model("Document", documentSchema);