const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  content: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("Document", DocumentSchema);
