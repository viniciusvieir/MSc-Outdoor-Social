const { body, validationResult } = require('express-validator')
const { errorHandler } = require('../utils/error-handling')

const UserPsql = require('../models/user.psql')
const UserMongo = require('../models/user.mongo')
const UserRating = require('../models/user_rating')

class AuthController {
  async signIn(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { email, password } = req.body

    const user = await UserPsql.findOne({
      where: { email: email.toLowerCase() },
      attributes: ['id', 'email', 'name', 'password'],
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

    const { email, password, name, dob, gender } = req.body

    const checkIfExists = await UserPsql.findOne({
      where: { email: email.toLowerCase() },
      attributes: ['id'],
    })

    // if user exists return error
    if (checkIfExists)
      return res.status(401).json(errorHandler(['User already exists']))

    const user = await UserPsql.create({
      name,
      dob,
      gender,
      email: email.toLowerCase(),
      password,
    })

    const randomId = Math.floor(Math.random() * Math.floor(1000)) + 1
    const profileImage = `https://picsum.photos/id/${randomId}/200/200`

    await UserMongo.create({
      dob,
      profileImage,
      userId: user.id,
      name: user.name,
      gender: user.gender,
      email: user.email,
    })

    await UserRating.create({
      userID: user.id,
    })

    return res.json(user.generateTokenPayload())
  }

  // VALIDATION
  get validators() {
    return {
      signIn: [body('email').isEmail(), body('password').not().isEmpty()],
      signUp: [
        body('email').isEmail(),
        body('password').not().isEmpty(),
        body('name').not().isEmpty().trim().escape(),
        body('dob').isDate().toDate(),
        body('gender').isIn(['M', 'F', 'TM', 'TF', 'NC', 'O', 'NA']),
      ],
    }
  }
}

module.exports = new AuthController()
