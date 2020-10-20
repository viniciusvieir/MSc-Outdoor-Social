const { body, validationResult } = require('express-validator')
const { errorHandler } = require('../utils/error-handling')

const Event = require('../models/event')

class EventController {
  async events(req, res) {
    const { trailId } = req.query
    const events = await Event.find({
      trailId,
    })

    res.json(events)
  }

  async createEvent(req, res) {}
}

module.exports = new EventController()
