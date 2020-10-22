const { query, body, validationResult } = require('express-validator')
const { errorHandler } = require('../utils/error-handling')

const Trail = require('../models/trail')

class TrailController {
  async trails(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { q: query, params, limit, skip } = req.query

    const trails = await Trail.find(query || {})
      .limit(limit || 20)
      .skip(skip || 0)
      .select((params && params.replace(/,|;/g, ' ')) || '-path')
    res.json(trails)
  }

  // FIX
  async trailsFix(req, res) {
    const trails = require('./trails.json')

    const trailsValidated = trails.map((trail) => {
      const currentPath = trail.geoLoc.coordinates[0]

      const path = currentPath.map((coordinates) => {
        return {
          type: 'Point',
          coordinates: [coordinates[0], coordinates[1]],
          elevation: coordinates[2],
        }
      })

      let estimate_time_min = null
      if (trail.estimateTime.includes(' h ')) {
        const items = trail.estimateTime.split(' h ')
        const hours = parseInt(items[0])
        const min = parseInt(items[1].replace(' m'))
        estimate_time_min = hours * 60 + min
      } else if (trail.estimateTime.includes(' m')) {
        const min = parseInt(trail.estimateTime.replace(' m'))
        estimate_time_min = min
      }

      return {
        id: trail.id,
        name: trail.name,
        location: trail.location,
        difficulty: trail.difficulty,
        length_km: trail.length_km,
        estimate_time_min,
        description: trail.description,
        activity_type: trail.activityType,
        elevation_gain_ft: trail.elevationGain_ft,
        avg_rating: trail.avgRating,
        img_url: trail.imgUrl,
        start: path[0],
        end: path[path.length - 1],
        path,
        bbox: {
          type: 'Polygon',
          coordinates: [
            [
              [trail.geoLoc.bbox[0], trail.geoLoc.bbox[1]],
              [trail.geoLoc.bbox[0], trail.geoLoc.bbox[3]],
              [trail.geoLoc.bbox[2], trail.geoLoc.bbox[3]],
              [trail.geoLoc.bbox[2], trail.geoLoc.bbox[1]],
              [trail.geoLoc.bbox[0], trail.geoLoc.bbox[1]],
            ],
          ],
        },
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
        query('params').optional().isString(),
        query('limit').optional().isInt().toInt(),
        query('skip').optional().isInt().toInt(),
      ],
    }
  }
}

module.exports = new TrailController()
