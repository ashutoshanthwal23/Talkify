const mongoose = require("mongoose");

const encryptSchema = new mongoose.Schema({
  encryptedData: {
    type: String,
    required: true
  },
  iv: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },

}, { timestamps: true })

module.exports = mongoose.model('Encrypt', encryptSchema)
