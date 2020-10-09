const { body, validationResult } = require('express-validator')
const { errorHandler } = require('../utils/error-handling')

const User = require('../models/user')

class AuthController {
  async signIn(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { email, password } = req.body

    const user = await User.findOne({
      where: { email },
      attributes: ['id, email, password'],
    })

    if (!user)
      // user not found by email
      return res.status(401).json(errorHandler(['Invalid email or password']))

    if (user.verifyPassword(password, user.password)) {
      return res.json(user.generateTokenPayload())
    } else {
      return res.status(401).json(errorHandler(['Invalid email or password']))
    }
  }

  async signUp(req, res) {
    res.send('Functionality not available')
  }

  // VALIDATION
  get validators() {
    return {
      signIn: [body('email').isEmail(), body('password').not().isEmpty()],
      signUp: [body('email').isEmail(), body('password').not().isEmpty()],
    }
  }
}

module.exports = new AuthController()
