require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? 'test.env' : '.env',
})

require('./src/databases')

const app = require('./src/app')

const port = process.env.PORT || 4040
const server = app.listen(port, () =>
  console.log(`Server running on port ${port}`)
)

module.exports = server
