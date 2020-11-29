const express = require('express')
const app = express()
app.use(express.static(__dirname + '/client'))

const socketio = require('socket.io')

const server = require('http').createServer()

const io = socketio(server)
io.on('connection', (socket) => {
  console.log('socket connected')
  socket.emit('messageFromServer', { data: 'Welcome to the socketio server' })
})

server.listen(5050)
console.log('started')
