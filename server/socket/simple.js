//const express = require('express')
//const app = express()
const socketio = require('socket.io')
//const cors = require('cors')

//app.use(cors())
//app.use(express.static(__dirname + '/client'))
const server = require('http').createServer();
//const expressServer = app.listen(5050)
const io = socketio(server)
io.on('connection', (socket) => {
	console.log('socket connected')
  socket.emit('messageFromServer', { data: 'Welcome to the socketio server' })
})

server.listen(5050)
console.log('started')
