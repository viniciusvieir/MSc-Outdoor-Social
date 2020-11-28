const { body, validationResult } = require('express-validator')
const { errorHandler } = require('../utils/error-handling')

const UserPsql = require('../models/user.psql')
const UserMongo = require('../models/user.mongo')

class UserController {
  async user(req, res) {
    const user = await UserMongo.findOne({
      userId: req.context.id,
    })
    res.json(user)
  }

  async changeUserInfo(req, res) {
    // const errors = validationResult(req)
    // if (!errors.isEmpty())
    //   return res.status(400).json({ errors: errors.array() })

    const { id } = req.context

    const user = await UserPsql.findByPk(id)
    await user.update(req.body)
    res.json({ success: true })
  }
}

module.exports = new UserController()
