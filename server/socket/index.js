require('dotenv').config({
  path: '../.env',
})
// require('../src/databases')
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const mongoose = require('mongoose')

const { getDecodedToken } = require('../src/middlewares/verify-token')

const User = require('../src/models/user.mongo')
const Trail = require('../src/models/trail')
const Event = require('../src/models/event')

// We have separation of concerns defined by different namespaces in our socket server

io.of('comments').on('connection', async (socket) => {
  const { trailId } = socket.handshake.query

  console.log('New comments socket connected', socket.id, 'for trail', trailId)

  const trail = await Trail.findById(trailId).select('comments')
  const room = `comments-${trail._id}`
  socket.join(room)

  socket.emit('comments:all-comments', trail.comments)

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
})

// Chat Namespace
io.of('chat').on('connection', async (socket) => {
  console.log('New chat socket connected', socket.id)
  const { eventId } = socket.handshake.headers || socket.handshake.query
  console.log(eventId)

  const room = `event-chat-${eventId}`
  socket.join(room)

  // get the latest chat
  const event = await Event.findOne({ _id: eventId }).select('chat')
  socket.emit('chat:all-messages', event.chat)

  socket.on('chat:send', async (payload) => {
    const user = await User.findOne({ _id: payload.userId })

    const chatMessage = {
      userId: payload.userId,
      name: user.name,
      profileImage: user.profileImage,
      content: payload.content,
      createdAt: new Date(),
    }

    await Event.updateOne(
      { _id: payload.eventId },
      {
        $push: {
          chat: chatMessage,
        },
      }
    )

    io.of('/chat').in(room).emit('chat:new-message', chatMessage)
  })
})

// Location Namespace
io.of('location').on('connection', async (socket) => {
  console.log('New location socket connected', socket.id)
  const { eventId, coordinates } =
    socket.handshake.headers || socket.handshake.query
  console.log(eventId, coordinates)

  const room = `event-location-${eventId}`
  socket.join(room)

  // get the location of all current users to this socket
  const event = await Event.findOne({ _id: eventId }).select('participants')
  const userLocations = event.participants.map(
    (participant) => participant.latestLocation
  )
  socket.emit('location:all', userLocations)

  socket.on('location:user', async (coordinates) => {})
})

function startMongoDB() {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => console.log('MongoDB connected...'))
    .catch((e) => console.error(e))
}

startMongoDB()

const port = process.env.SOCKET_PORT
http.listen(port, () => {
  console.log(`listening on *:${port}`)
})
