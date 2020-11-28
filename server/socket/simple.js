const express = require('express')
const app = express()
const socketio = require('socket.io')

app.use(express.static(__dirname + '/client'))

const expressServer = app.listen(5050)
const io = socketio(expressServer)
io.on('connection', (socket) => {
  socket.emit('messageFromServer', { data: 'Welcome to the socketio server' })
})
