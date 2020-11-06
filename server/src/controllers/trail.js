const { query, param, validationResult } = require('express-validator')
const { errorHandler } = require('../utils/error-handling')
const { spawn } = require('child_process')

const Trail = require('../models/trail')

class TrailController {
  async trails(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { q: query, fields, limit, skip } = req.query

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

    if (trail && trail.path) {
      trail.path = trail.path.map((loc) => ({
        latitude: loc.coordinates[0],
        longitude: loc.coordinates[1],
      }))
    }

    if (trail && fields.includes('recommended')) {
      const python = spawn('python', [
        '../Recommendation/similar-trails.py',
        id,
      ])
      python.stdout.on('data', async (data) => {
        const items = String.fromCharCode
          .apply(null, data)
          .replace(/(\r\n|\n|\r)/gm, '')
          .split(',')

        trail.recommended = await Trail.find({
          _id: {
            $in: items,
          },
        }).select('name img_url avg_rating')

        res.json(trail)
      })
    } else {
      res.json(trail)
    }
  }

  // FIX
  async trailsFix(req, res) {
    const trails = require('../../trails.json')

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
        estimate_time_min,
        id: trail.id,
        name: trail.name,
        location: trail.location,
        difficulty: trail.difficulty || 'Unknown',
        length_km: trail.length_km,
        description: trail.description,
        activity_type: trail.activityType,
        elevation_gain_ft: trail.elevationGain_ft,
        no_of_ratings: trail.no_of_ratings,
        avg_rating: trail.avgRating,
        img_url: trail.imgUrl,
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
