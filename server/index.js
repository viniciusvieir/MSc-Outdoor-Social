const app = require('./app')

const port = process.env.PORT || 4040
const server = app.listen(port, () =>
  console.log('Server running on port ' + port)
)

module.exports = server
