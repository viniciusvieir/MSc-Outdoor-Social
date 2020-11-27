const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    require: true,
  },
  dob: {
    type: Date,
    require: true,
  },
  gender: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  profileImage: {
    type: String,
    require: false,
  },
})

module.exports = mongoose.model('user', UserSchema)
