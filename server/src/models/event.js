const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
})

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
  participants: {
    type: [Object],
    default: [],
    required: true,
  }, // [{ type: Schema.Types.ObjectId, ref: 'User' }]
  chat: {
    type: [ChatSchema],
    required: true,
    default: [],
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
