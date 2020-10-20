const router = require('express').Router()

const verifyToken = require('../middlewares/verify-token').verifyToken

const authController = require('../controllers/auth')
const trailController = require('../controllers/trail')
const eventController = require('../controllers/event')

router.get('/hello', (req, res) => {
  res.send('GTFO')
})

// Format router.post(<route>, <verifyToken>, <validation>, <function>)

// =============== AUTH ===============
router.post('/signin', authController.validators.signIn, authController.signIn)
router.post('/signup', authController.validators.signUp, authController.signUp)

// =============== TRAIL ==============
router.get('/trails', trailController.trails)

// =============== EVENT ==============
router.get('/trails/:trailId/events', eventController.events)

module.exports = router
