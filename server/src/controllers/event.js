const { body, validationResult } = require('express-validator')
const { errorHandler } = require('../utils/error-handling')

const Event = require('../models/event')

class EventController {
  async events(req, res) {
    const { trailId } = req.params
    const events = await Event.find({
      trailId,
    })

    res.json(events)
  }

  async createEvent(req, res) {
    const { userId } = req.context
    const { trailId } = req.params
    const { title, description, date, maxParticipants } = req.body

    const event = await Event.create({
      userId,
      trailId,
      title,
      description,
      date,
      maxParticipants,
    })

    res.json({ eventId: event.id, success: true })
  }

  async updateEvent(req, res) {
    const { userId } = req.context
    const { eventId } = req.params
    const { title, description, date, maxParticipants } = req.body

    await Event.updateOne(
      { eventId },
      { title, description, date, maxParticipants }
    )

    res.json({ success: true })
  }

  async deleteEvent(req, res) {
    const { userId } = req.context
    const { eventId } = req.params

    await Event.deleteOne({ eventId })

    res.json({ success: true })
  }
}

module.exports = new EventController()
