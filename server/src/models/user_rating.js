const mongoose = require('mongoose')

const UserRatingSchema = new mongoose.Schema({
  userID: {
    type: Number,
    required: true,
  },
  reviews: {
    type: [Object],
    default: [],
    required: true,
  },
})

module.exports = mongoose.model('user_rating', UserRatingSchema, 'user_rating')
