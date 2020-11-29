// https://api.trailseek.eu/socket/socket.io/comments
// http://localhost:5050/comments
// const socket = io('http://localhost:5050', {
//   query: {
// trailId: '5fbd4cbcc1dbd0485ee48f7d',
//   },
// })
// https://api.trailseek.eu
// http://94.245.110.210:5050/
const socket = io('http://94.245.110.210:5050', {
  //   path: '/socket/comments',
  query: {
    trailId: '5fbd4cbcc1dbd0485ee48f7d',
  },
})

socket.on('connect', () => {
  console.log('Connect', socket.id)
})

socket.on('messageFromServer', (data) => console.log(data))

socket.on('comments:all-comments', (data) => {
  console.log('All comments', data)
  data.forEach((comment) => {
    document.querySelector(
      '#comments'
    ).innerHTML += `<li>${comment.content}</li>`
  })
})
