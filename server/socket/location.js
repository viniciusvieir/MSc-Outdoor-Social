require('dotenv').config()
require('../src/databases')

const Event = require('../src/models/event')

const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.on('connection', async (socket) => {
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

const port = process.env.LOCATION_SOCKET_PORT
http.listen(port, () => {
  console.log(`listening on *:${port}`)
})
