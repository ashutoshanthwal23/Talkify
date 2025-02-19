const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  avatar: {
    type: String,
    required: false,
  },

  phone: {
    type: String,
  },

  email: {
    type: String
  },
  
  activated: {
    type: Boolean,
    required: false,
    default: false
  }
}, { 
  timestamps: true,
  toJSON: { getters: true }
 })

module.exports = mongoose.model('User', userSchema)