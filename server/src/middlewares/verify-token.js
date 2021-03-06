const JWT = require('jsonwebtoken')
const { promisify } = require('util')

const { errorHandler } = require('../utils/error-handling')
const JWT_SECRET = process.env.JWT_SECRET

const verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers.authorization
  if (!bearerHeader)
    return res
      .status(401)
      .json(errorHandler(['Authorization token not provided']))

  const token = bearerHeader.split(' ')[1]

  try {
    const decoded = await promisify(JWT.verify)(token, JWT_SECRET)
    req.context = decoded
    next()
  } catch (err) {
    console.log('JWT Error: ' + err.message)
    res.status(401).json(errorHandler('Invalid token'))
  }
}

const optionalToken = async (req, res, next) => {
  const bearerHeader = req.headers.authorization
  if (!bearerHeader) return next()

  const token = bearerHeader.split(' ')[1]

  try {
    const decoded = await promisify(JWT.verify)(token, JWT_SECRET)
    req.context = decoded
  } catch (err) {}

  next()
}

const getDecodedToken = async (token) => {
  if (!token) return null
  try {
    const decoded = await promisify(JWT.verify)(token, JWT_SECRET)
    return decoded
  } catch (err) {
    console.log('JWT Error: ' + err.message)
    return null
  }
}

module.exports = { verifyToken, optionalToken, getDecodedToken }
