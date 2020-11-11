const router = require('express').Router()

const verifyToken = require('../middlewares/verify-token').verifyToken

const authController = require('../controllers/auth')
const userController = require('../controllers/user')
const trailController = require('../controllers/trail')
const eventController = require('../controllers/event')

// Format router.post(<route>, <verifyToken>, <validation>, <callback>)

// =============== AUTH ===============
router.post('/signin', authController.validators.signIn, authController.signIn)
router.post('/signup', authController.validators.signUp, authController.signUp)
router.get('/privateRoute', verifyToken, authController.privateRoute)

// =============== USER ===============
router.post('/user', verifyToken, userController.changeUserInfo)

// =============== TRAIL ==============
router.get('/trails', trailController.validators.trails, trailController.trails)
router.get(
  '/trails/:id',
  trailController.validators.trailById,
  trailController.trailById
)
router.get('/trailsfix', trailController.trailsFix)

// =============== EVENT ==============
router.get('/trails/:trailId/events', eventController.events)
router.post('/trails/:trailId/events', verifyToken, eventController.createEvent)
router.put(
  '/trails/:trailId/events/:eventId',
  verifyToken,
  eventController.updateEvent
)
router.delete(
  '/trails/:trailId/events/:eventId',
  verifyToken,
  eventController.deleteEvent
)

module.exports = router
