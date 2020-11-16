const { query, body, validationResult } = require('express-validator')
const { errorHandler } = require('../utils/error-handling')

const Trail = require('../models/trail')
const Event = require('../models/event')
const User = require('../models/user')

class EventController {
  async events(req, res) {
    const { trailId } = req.params
    const { fields } = req.query

    const events = await Event.find({
      trailId,
    }).lean()

    // for (let i = 0; i < events.length; i++) {
    //   console.log(events[i].userId)
    //   const user = await User.findByPk(events[i].userId, {
    //     attributes: ['name'],
    //   })
    //   events[
    //     i
    //   ].subtitle = `${events[0].date} • ${events[0].duration_min} • ${events[0].max_participants} • ${user.name}`
    // }

    res.json(events)
  }

  async createEvent(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { id: userId } = req.context
    const { trailId } = req.params
    const {
      title,
      description,
      date,
      duration_min,
      max_participants,
    } = req.body

    const trail = await Trail.findById(trailId).select('estimate_time_min')
    if (!trail) return res.status(403).json(errorHandler('Trail not found'))

    const event = await Event.create({
      userId,
      trailId,
      title,
      description,
      date,
      duration_min: duration_min || trail.estimate_time_min,
      max_participants,
    })

    res.json({ eventId: event.id, success: true })
  }

  async updateEvent(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { id: userId } = req.context
    // TODO: check if user owns the event

    const { eventId } = req.params
    const {
      title,
      description,
      date,
      duration_min,
      max_participants,
    } = req.body

    if (!title && !description && !date && !duration_min && !max_participants)
      return res.status(403).json(errorHandler('Nothing to update'))

    await Event.updateOne(
      { eventId },
      { title, description, date, duration_min, max_participants }
    )

    const event = await Event.findById(eventId)

    res.json(event)
  }

  async deleteEvent(req, res) {
    const { id: userId } = req.context
    // TODO: check if user owns the event
    const { eventId } = req.params
    await Event.deleteOne({ eventId })
    res.json({ success: true })
  }

  // VALIDATION
  get validators() {
    return {
      events: [query('fields').optional().isString()],
      createEvent: [
        body('title'),
        body('description'),
        body('date').toDate(),
        body('duration_min').optional().isInt().toInt(),
        body('max_participants').isInt().toInt(),
      ],
      updateEvent: [
        body('title').optional(),
        body('description').optional(),
        body('date').optional().toDate(),
        body('duration_min').optional().isInt().toInt(),
        body('max_participants').optional().isInt().toInt(),
      ],
    }
  }
}

module.exports = new EventController()
