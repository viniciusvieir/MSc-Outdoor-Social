require('dotenv').config({
  path: '../.env',
})

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const { getDecodedToken } = require('../src/middlewares/verify-token')
const User = require('../src/models/user.mongo')
const Trail = require('../src/models/trail')
const Event = require('../src/models/event')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/client'))

const server = app.listen(process.env.SOCKET_PORT, () =>
  console.log(`listening on *:${process.env.SOCKET_PORT}`)
)

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
})

// We have separation of concerns defined by different namespaces in our socket server

// io.use(async (socket, next) => {
//   const token = socket.handshake.auth.token
//   const userInfo = await getDecodedToken(token)
//   if (userInfo) {
//     socket.context = userInfo
//   }
//   next()
// })

io.of('/').on('connection', () => console.log('Connected to /'))

io.of('comments').on('connection', async (socket) => {
  const { trailId } = socket.handshake.query

  if (!trailId) {
    console.log('socket disconnected for not sending trail data')
    socket.disconnect()
    return
  }

  console.log('New comments socket connected', socket.id, 'for trail', trailId)

  const trail = await Trail.findById(trailId).select('comments')
  const room = `comments-${trail._id}`
  socket.join(room)

  socket.emit('comments:all-comments', trail.comments)

  socket.on('comments:user-typing', async (data) => {
    socket.in(room).emit('comments:someone-typing')
  })

  socket.on('comments:send-new', async (data) => {
    const { token, trailId, content } = data
    const userInfo = await getDecodedToken(token)

    if (!userInfo) return

    const user = await User.findOne({ userId: userInfo.id }).select(
      'name profileImage'
    )

    if (user) {
      const comment = {
        content,
        userId: userInfo.id,
        date: new Date(),
        name: user.name,
        profileImage: user.profileImage,
      }

      await Trail.updateOne(
        { _id: trailId },
        {
          $push: {
            comments: comment,
          },
        }
      )

      io.of('/comments').in(room).emit('comments:receive-new', comment)
    }
  })

  socket.on('disconnect', () => console.log('Comments socket disconnected'))
})

// Chat Namespace
io.of('events').on('connection', async (socket) => {
  const { eventId } = socket.handshake.query

  if (!eventId) {
    console.log('socket disconnected for not sending event data')
    socket.disconnect()
    return
  }

  console.log('New events socket connected', socket.id, 'for event', eventId)

  const event = await Event.findById(eventId).select('chat')
  const room = `events-${event._id}`
  socket.join(room)

  socket.emit('events:all-chat', event.chat)

  socket.on('events:user-typing', async (data) => {
    socket.in(room).emit('events:someone-typing')
  })

  socket.on('events:send-new', async (data) => {
    const { token, eventId, content } = data
    const userInfo = await getDecodedToken(token)

    if (!userInfo) return

    const user = await User.findOne({ userId: userInfo.id }).select(
      'name profileImage'
    )

    if (user) {
      const message = {
        content,
        userId: userInfo.id,
        name: user.name,
        profileImage: user.profileImage,
      }

      await Event.updateOne(
        { _id: eventId },
        {
          $push: {
            chat: message,
          },
        }
      )

      io.of('/events')
        .in(room)
        .emit('events:receive-new', { ...message, createdAt: new Date() })
    }
  })

  socket.on('disconnect', () => console.log('Events socket disconnected'))
})

// Location Namespace
io.of('location').on('connection', async (socket) => {
  console.log('New location socket connected', socket.id)

  const { eventId, coordinates } = socket.handshake.query

  if (!eventId || !coordinates) {
    console.log('socket disconnected for not sending event data')
    socket.disconnect()
    return
  }

  const room = `location-${eventId}`
  socket.join(room)

  // get the location of all current users to this socket
  const event = await Event.findOne({ _id: eventId }).select('participants')
  const userLocations = event.participants
  socket.emit('location:all', userLocations)

  socket.on('location:user', async (coordinates) => {})
})

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log('MongoDB connected...'))
  .catch((e) => console.error(e))
