const { query, param, validationResult } = require('express-validator')
const { errorHandler } = require('../utils/error-handling')
const { PythonShell } = require('python-shell')
const axios = require('axios').default

const Trail = require('../models/trail')
const Event = require('../models/event')

class TrailController {
  async trails(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { q: query, fields, limit, skip } = req.query

    let trails = []

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

      trails = await Trail.aggregate([
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
    } else if (query && query.recommendation) {
      const { id: userId } = req.context
      if (!userId) return res.json(errorHandler('Token not provided'))

      const recommendedTrails = await axios.get(
        `http://localhost:3030/${userId}`
      )
      console.log(recommendedTrails.data)

      trails = await Trail.find({
        _id: {
          $in: recommendedTrails.data,
        },
      })
        .select((fields && fields.replace(/,|;/g, ' ')) || '-path')
        .lean()
    } else {
      trails = await Trail.find(query || {})
        .limit(limit || 20)
        .skip(skip || 0)
        .select((fields && fields.replace(/,|;/g, ' ')) || '-path')
        .lean()
    }

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

  async rateTrail(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { id: userId } = req.context
    const { id: trailId } = req.params
    const { rating } = req.body

    const trail = await Trail.findById(trailId).select('ratings')
  }

  // FIX
  async trailsFix(req, res) {
    const trails = require('../../../trails.json')

    const trailsValidated = trails.map((trail) => {
      const currentPath = trail.geoLoc.coordinates[0]

      const path = currentPath.map((coordinates) => {
        return {
          type: 'Point',
          coordinates: [coordinates[1], coordinates[0]],
          elevation: coordinates[2],
        }
      })

      let estimate_time_min = null
      if (trail.estimateTime.includes(' h ')) {
        const items = trail.estimateTime.split(' h ')
        const hours = isNaN(parseInt(items[0])) ? 0 : parseInt(items[0])
        const min = isNaN(parseInt(items[1].replace(' m')))
          ? 0
          : parseInt(items[1].replace(' m'))
        estimate_time_min = hours * 60 + min
      } else if (trail.estimateTime.includes(' m')) {
        const min = parseInt(trail.estimateTime.replace(' m'))
        estimate_time_min = min
      }

      if (isNaN(estimate_time_min)) {
        console.log(trail)
      }

      return {
        path,
        id: trail.id,
        name: trail.name,
        location: trail.location,
        county: trail.county,
        difficulty: trail.difficulty.toLowerCase() || 'unknown',
        length_km: trail.length_km,
        description: trail.description,
        activity_type: trail.activityType,
        estimate_time_min: estimate_time_min || -1,
        elevation_gain_ft: trail.elevationGain_ft,
        no_of_ratings: trail.no_of_ratings,
        avg_rating: trail.avgRating,
        img_url: trail.img_url,
        start: path[0],
        end: path[path.length - 1],
        bbox: trail.geoLoc.bbox,
      }
    })

    await Trail.insertMany(trailsValidated)

    res.json({ success: 123 })
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
