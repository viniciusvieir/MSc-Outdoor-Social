const mongoose = require('mongoose')
const config = require('../../config/mongodb.config')

mongoose
  .connect(config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log('MongoDB connected'))

module.exports = mongoose
