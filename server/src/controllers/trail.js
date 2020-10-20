const { body, validationResult } = require('express-validator')
const { errorHandler } = require('../utils/error-handling')

const Trail = require('../models/trail')

class TrailController {
  async trails(req, res) {
    const { limit, skip } = req.query
    const trails = await Trail.find()
      .limit(parseInt(limit) || 20)
      .skip(parseInt(skip) || 0)
    res.json(trails)
  }
}

module.exports = new TrailController()
