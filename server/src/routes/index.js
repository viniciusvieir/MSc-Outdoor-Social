const router = require('express').Router()

const { verifyToken, optionalToken } = require('../middlewares/verify-token')

const authController = require('../controllers/auth')
const userController = require('../controllers/user')
const trailController = require('../controllers/trail')
const eventController = require('../controllers/event')

// Format router.post(<route>, <verifyToken>, <validation>, <callback>)

// =============== AUTH ===============
router.post('/signin', authController.validators.signIn, authController.signIn)
router.post('/signup', authController.validators.signUp, authController.signUp)

// =============== USER ===============
router.get('/user', verifyToken, userController.user)
router.put('/user', verifyToken, userController.changeUserInfo)

router.get(
  '/user/eventsCreated',
  verifyToken,
  eventController.eventsCreatedByUser
)
router.get(
  '/user/eventsJoined',
  verifyToken,
  eventController.eventsJoinedByUser
)

// =============== TRAIL ==============
router.get(
  '/trails',
  optionalToken,
  trailController.validators.trails,
  trailController.trails
)
router.get(
  '/trails/:id',
  trailController.validators.trailById,
  trailController.trailById
)
router.post(
  '/trails/:trailId/rate',
  verifyToken,
  trailController.validators.rating,
  trailController.rateTrail
)
router.get(
  '/trails/:trailId/comments',
  trailController.validators.getComments,
  trailController.comments
)
router.post(
  '/trails/:trailId/comments',
  verifyToken,
  trailController.validators.postComment,
  trailController.commentTrail
)
router.get('/fix', trailController.trailsFix)

// =============== EVENT ==============
router.get(
  '/trails/:trailId/events',
  eventController.validators.events,
  eventController.events
)
router.post(
  '/trails/:trailId/events',
  verifyToken,
  eventController.validators.createEvent,
  eventController.createEvent
)
router.get(
  '/events/:eventId',
  eventController.validators.events,
  eventController.event
)
router.get(
  '/trails/:trailId/events/:eventId',
  eventController.validators.events,
  eventController.event
)
router.put(
  '/trails/:trailId/events/:eventId',
  verifyToken,
  eventController.validators.updateEvent,
  eventController.updateEvent
)
router.delete(
  '/trails/:trailId/events/:eventId',
  verifyToken,
  eventController.deleteEvent
)
router.put(
  '/trails/:trailId/events/:eventId/join',
  verifyToken,
  eventController.joinEvent
)
router.put(
  '/trails/:trailId/events/:eventId/leave',
  verifyToken,
  eventController.leaveEvent
)

module.exports = router
