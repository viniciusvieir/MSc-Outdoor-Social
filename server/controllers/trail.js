const { body, validationResult } = require('express-validator')
const { errorHandler } = require('../utils/error-handling')

class TrailController {
  async trails(req, res) {
    res.send('Functionality not available')
  }
}

module.exports = new TrailController()
