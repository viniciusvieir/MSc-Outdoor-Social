require('dotenv').config()
require('../src/databases')

const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.on('connection', (socket) => {
  console.log('New socket connected', socket.id)
  const { eventId, coordinates } =
    socket.handshake.headers || socket.handshake.query
  console.log(eventId, coordinates)

  const room = `event-${eventId}`
  socket.join(room)

  // get the location of all current users to this socket
  const userLocations = []
  socket.emit('location:all', userLocations)

  socket.on('location:user', async (coordinates) => {})
})

const port = process.env.SOCKET_PORT
http.listen(port, () => {
  console.log(`listening on *:${port}`)
})
