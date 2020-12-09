const { query, body, validationResult } = require('express-validator')
const { errorHandler } = require('../utils/error-handling')
const { ddmmyyhhmm, eventDuration } = require('../utils/date-handling')

const Trail = require('../models/trail')
const Event = require('../models/event')
const UserMongo = require('../models/user.mongo')

class EventController {
  async events(req, res) {
    const { trailId } = req.params
    const { fields } = req.query

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const events = await Event.find({
      trailId,
      date: { $gte: today },
    })
      .select((fields && fields.replace(/,|;/g, ' ')) || '-chat -trailId')
      .lean()

    for (let i = 0; i < events.length; i++) {
      const participants = events[i].participants.length
      const duration = eventDuration(events[i].duration_min)
      const peopleGoing =
        participants > 1 ? `${participants} people going` : '1 person going'
      const maxParticipants = `${events[i].max_participants} max`

      events[i].subtitle = `${duration} • ${peopleGoing} • ${maxParticipants}`
    }

    res.json(events)
  }

  async event(req, res) {
    const { eventId } = req.params
    const { fields } = req.query

    const event = await Event.findById(eventId)
      .select((fields && fields.replace(/,|;/g, ' ')) || '-chat')
      .lean()
    res.json(event)
  }

  async createEvent(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { id: userId, name } = req.context
    const { trailId } = req.params
    const {
      title,
      description,
      date,
      duration_min,
      max_participants,
    } = req.body

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (date < today)
      return res.status(400).json(errorHandler('Date cannot be in the past'))

    const trail = await Trail.findById(trailId).select('estimate_time_min')
    if (!trail) return res.status(403).json(errorHandler('Trail not found'))

    const user = await UserMongo.findOne({ userId }).select('profileImage')

    const event = await Event.create({
      userId,
      trailId,
      title,
      description,
      date,
      duration_min: duration_min || trail.estimate_time_min,
      max_participants,
      participants: [
        {
          userId,
          name,
          profileImage: user.profileImage,
          lastLocation: null,
        },
      ],
    })

    res.json({ eventId: event.id, success: true })
  }

  async updateEvent(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { id: userId } = req.context

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
      { _id: eventId, userId },
      { title, description, date, duration_min, max_participants }
    )

    const event = await Event.findById(eventId)
    res.json(event)
  }

  async deleteEvent(req, res) {
    const { id: userId } = req.context
    const { eventId } = req.params
    await Event.deleteOne({ _id: eventId, userId })
    res.json({ success: true })
  }

  async joinEvent(req, res) {
    const { id: userId, name } = req.context
    const { eventId } = req.params

    const joined = await Event.findOne({
      _id: eventId,
      participants: { $elemMatch: { userId } },
    }).countDocuments()

    if (!joined) {
      const user = await UserMongo.findOne({ userId }).select('profileImage')
      await Event.updateOne(
        { _id: eventId },
        {
          $push: {
            participants: {
              userId,
              name,
              profileImage: user.profileImage,
              lastLocation: null,
            },
          },
        }
      )
    }

    res.json({ success: !joined })
  }

  async leaveEvent(req, res) {
    const { id: userId } = req.context
    const { eventId } = req.params

    await Event.updateOne(
      { _id: eventId },
      {
        $pull: {
          participants: {
            userId,
          },
        },
      }
    )
    res.json({ success: true })
  }

  async eventsCreatedByUser(req, res) {
    const { id: userId } = req.context
    const events = await Event.find({ userId })
    res.json(events)
  }

  async eventsJoinedByUser(req, res) {
    const { id: userId } = req.context
    const events = await Event.find({
      participants: { $elemMatch: { userId } },
    })
    res.json(events)
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
