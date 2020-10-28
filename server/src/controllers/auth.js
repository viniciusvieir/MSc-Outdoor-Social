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
      attributes: ['id', 'email', 'password'],
    })

    if (!user)
      // user not found by email
      return res.status(401).json(errorHandler(['Invalid email or password']))

    //user.verifyPassword(password, user.password)
    if (user.verifyPassword(password)) {
      return res.json(user.generateTokenPayload())
    } else {
      return res.status(401).json(errorHandler(['Invalid email or password']))
    }
  }

  async signUp(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { email, password, name, gender } = req.body

    const checkIfExists = await User.findOne({
      where: { email },
      attributes: ['id'],
    })

    // if user exists return error
    if (checkIfExists)
      return res.status(401).json(errorHandler(['User already exists']))

    const user = await User.create({
      name,
      dob: new Date(),
      gender,
      email,
      password,
    })

    return res.json(user.generateTokenPayload())
  }

  async privateRoute(req, res) {
    res.json({ success: true })
  }

  // VALIDATION
  get validators() {
    return {
      // body('email').isEmail(),
      signIn: [body('password').not().isEmpty()],
      signUp: [
        // body('email').isEmail(),
        body('password').not().isEmpty(),
        body('name').not().isEmpty().trim().escape(),
        body('gender').isIn(['F', 'M']),
      ],
    }
  }
}

module.exports = new AuthController()
