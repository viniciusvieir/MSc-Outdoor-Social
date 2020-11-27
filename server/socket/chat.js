require('dotenv').config()
require('../src/databases')

const Event = require('../src/models/event')

const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.on('connection', async (socket) => {
  console.log('New chat socket connected', socket.id)
  const { eventId } = socket.handshake.headers || socket.handshake.query
  console.log(eventId)

  const room = `event-chat-${eventId}`
  socket.join(room)

  // get the latest chat
  const event = await Event.findOne({ _id: eventId }).select('chat')
  socket.emit('chat:all', event.chat)

  socket.on('chat:send', async (coordinates) => {})
})

const port = process.env.CHAT_SOCKET_PORT
http.listen(port, () => {
  console.log(`listening on *:${port}`)
})
