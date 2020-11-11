const { body, validationResult } = require('express-validator')
const { errorHandler } = require('../utils/error-handling')

const User = require('../models/user')

class UserController {
  async changeUserInfo(res, req) {
    // const errors = validationResult(req)
    // if (!errors.isEmpty())
    //   return res.status(400).json({ errors: errors.array() })

    const { id } = req.context

    const user = await User.findByPk(id)

    if (!user) return res.status(401).json(errorHandler(['User not found']))

    return user
      .update(req.body)
      .then(() => {
        res.json({ success: true })
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json(errorHandler(err))
      })
  }
}

module.exports = new UserController()
