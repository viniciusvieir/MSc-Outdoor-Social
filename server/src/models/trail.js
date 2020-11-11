const mongoose = require('mongoose')

const TrailSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    index: 'text',
  },
  description: {
    type: String,
    required: true,
  },
  activity_type: {
    type: String,
    required: true,
    index: true,
  },
  location: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
    index: true,
    default: 'Unknown',
  },
  length_km: {
    type: Number,
    required: true,
  },
  estimate_time_min: {
    type: Number,
    required: false,
  },
  elevation_gain_ft: {
    type: Number,
    required: false,
  },
  no_of_ratings: {
    type: Number,
    required: true,
    default: 0,
  },
  avg_rating: {
    type: Number,
    required: true,
    default: 0,
  },
  img_url: {
    type: String,
    required: false,
  },
  start: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    elevation: {
      type: Number,
      required: true,
    },
  },
  end: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    elevation: {
      type: Number,
      required: true,
    },
  },
  path: {
    type: [Object],
    required: true,
  },
  bbox: {
    type: [Number],
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

TrailSchema.index({ start: '2dsphere' })
TrailSchema.index({ end: '2dsphere' })

module.exports = mongoose.model('Trail_dev', TrailSchema)
