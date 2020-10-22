const router = require('express').Router()

const verifyToken = require('../middlewares/verify-token').verifyToken

const authController = require('../controllers/auth')
const trailController = require('../controllers/trail')
const eventController = require('../controllers/event')

// Format router.post(<route>, <verifyToken>, <validation>, <callback>)

// =============== AUTH ===============
router.post('/signin', authController.validators.signIn, authController.signIn)
router.post('/signup', authController.validators.signUp, authController.signUp)
router.get('/privateRoute', verifyToken, authController.privateRoute)

// =============== TRAIL ==============
router.get('/trails', trailController.validators.trails, trailController.trails)
router.get('/trailsfix', trailController.trailsFix)

// =============== EVENT ==============
router.get('/trails/:trailId/events', eventController.events)

module.exports = router
