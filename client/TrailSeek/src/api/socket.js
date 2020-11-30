import io from 'socket.io-client'

const SOCKET_URL = 'http://94.245.110.210:5050'

const socket = (namespace, query) => {
  return io(SOCKET_URL + namespace, { query })
}

export default socket
