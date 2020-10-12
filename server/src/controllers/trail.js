const { body, validationResult } = require('express-validator')
const { errorHandler } = require('../utils/error-handling')

const Trail = require('../models/trail')

class TrailController {
  async trails(req, res) {
    res.send('Functionality not available')
  }

  async createTrail(req, res) {
    Trail.create({
      name: 'Test',
      location: 'Test location',
      imageUrl: 'testurl',
    })
  }
}

module.exports = new TrailController()
