const { body, validationResult } = require('express-validator')
const { errorHandler } = require('../utils/error-handling')

const User = require('../models/user.psql')

class UserController {
  async user(req, res) {
    const user = await User.findByPk(req.context.id, {
      attributes: ['id', 'name', 'dob', 'gender', 'email'],
    })
    res.json(user)
  }

  async changeUserInfo(req, res) {
    // const errors = validationResult(req)
    // if (!errors.isEmpty())
    //   return res.status(400).json({ errors: errors.array() })

    const { id } = req.context

    const user = await User.findByPk(id)
    await user.update(req.body)
    res.json({ success: true })
  }
}

module.exports = new UserController()
