require('dotenv').config()
require('../src/databases')

const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.on('connection', (socket) => {
  console.log('a user connected')
})

const port = process.env.SOCKET_PORT
http.listen(port, () => {
  console.log(`listening on *:${port}`)
})
