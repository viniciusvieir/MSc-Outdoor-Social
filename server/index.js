require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
})

const app = require('./src/app')
const sequelize = require('./src/databases/postgres')
const mongoose = require('./src/databases/mongo')

const port = process.env.PORT || 4040
const server = app.listen(port, () =>
  console.log('Server running on port ' + port)
)

sequelize.sync({ force: true }).then(() => {
  console.log('Postgres synced...')
})

module.exports = server
