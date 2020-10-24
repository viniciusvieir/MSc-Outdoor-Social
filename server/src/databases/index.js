const sequelize = require('./postgres')

const mongoose = require('mongoose')

function startPostgreSQL() {
  return new Promise((res, rej) => {
    sequelize
      .sync({ force: false })
      .then(() => {
        console.log('Postgres connected...')
        res()
      })
      .catch((e) => rej(e))
  })
}

function startMongoDB() {
  return new Promise((res, rej) => {
    mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(async () => {
        console.log('MongoDB connected...')
        res()
      })
      .catch((e) => rej(e))
  })
}

async function initialize() {
  await startPostgreSQL()
  await startMongoDB()
}

module.exports = initialize()
