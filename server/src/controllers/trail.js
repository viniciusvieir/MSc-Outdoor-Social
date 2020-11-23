const { query, param, validationResult } = require('express-validator')
const { errorHandler } = require('../utils/error-handling')
const { PythonShell } = require('python-shell')

const Trail = require('../models/trail')
const Event = require('../models/event')

class TrailController {
  async trails(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { q: query, fields, limit, skip } = req.query

    // search for nearest places to a point
    if (query && query.near && query.near.lat && query.near.lon) {
      const project = {}

      if (fields) {
        fields.split(/,|;/g).forEach((field) => {
          project[field] = true
        })
      } else {
        project.path = false
      }

      const latLon = query.near
      delete query.near

      const trails = await Trail.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [latLon.lat, latLon.lon],
            },
            query: query || {},
            maxDistance: 1_000 * 1_000,
            key: 'start',
            spherical: true,
            distanceField: 'distance_meters',
          },
        },
        { $project: project },
      ])
        .limit(limit || 20)
        .skip(skip || 0)
      return res.json(trails)
    }

    const trails = await Trail.find(query || {})
      .limit(limit || 20)
      .skip(skip || 0)
      .select((fields && fields.replace(/,|;/g, ' ')) || '-path')
      .lean()

    if (fields && fields.includes('outing_count')) {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      for (let i = 0; i < trails.length; i++) {
        trails[i].outing_count = await Event.find({
          trailId: trails[i]._id,
          date: {
            $gte: date.toLocaleString(),
          },
        }).countDocuments()
      }
    }

    res.json(trails)
  }

  async trailById(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { id } = req.params
    const { fields } = req.query

    const trail = await Trail.findById(id)
      .select((fields && fields.replace(/,|;/g, ' ')) || '-path')
      .lean()

    // Parses path to client format
    if (trail && trail.path) {
      trail.path = trail.path.map((loc) => ({
        latitude: loc.coordinates[0],
        longitude: loc.coordinates[1],
      }))
    }

    // Finds recommended trails if fields include `recommended` attribute
    if (trail && fields && fields.includes('recommended')) {
      const script = new PythonShell('../Recommendation/similar-trails.py', {
        args: [id],
      })
      script.on('message', async (message) => {
        const items = message.split(',')
        if (items.length > 0) {
          trail.recommended = await Trail.find({
            _id: {
              $in: items,
            },
          }).select('name img_url avg_rating')
        }
        res.json(trail)
      })
    } else {
      res.json(trail)
    }
  }

  // VALIDATION
  get validators() {
    return {
      trails: [
        query('q')
          .optional()
          .isString()
          .customSanitizer((value) => {
            try {
              return JSON.parse(value)
            } catch (e) {
              return null
            }
          }),
        query('fields').optional().isString(),
        query('limit').optional().isInt().toInt(),
        query('skip').optional().isInt().toInt(),
      ],
      trailById: [
        param('id').isString().isLength(24),
        query('fields').optional().isString(),
      ],
    }
  }
}

module.exports = new TrailController()
