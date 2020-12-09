const mongoose = require('mongoose')

const ParticipantSchema = new mongoose.Schema({
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
  lastLocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
    },
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
})

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
    type: [ParticipantSchema],
    default: [],
    required: true,
  },
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
