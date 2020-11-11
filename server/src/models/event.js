const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  trailId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trail',
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
  duration_min: {
    type: Number,
    required: true,
  },
  max_participants: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Event', EventSchema)
