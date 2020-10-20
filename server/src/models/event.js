const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  trailId: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  maxParticipants: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Event', EventSchema)
