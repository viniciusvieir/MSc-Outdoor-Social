const Sequelize = require('sequelize')
const dbConfig = require('../../config/postgres.config')

const User = require('../../models/user')

const sequelize = new Sequelize(dbConfig)

const models = [User]
models.forEach((model) => model.init(sequelize))
models.forEach((model) => model.associate && model.associate(sequelize.models))

// const options = { force: process.env.NODE_ENV === 'test' }

// sequelize
//   .sync(options)
//   .then(async () => {
//     if (proces.env.NODE_ENV !== 'test') console.log('DB sync completed...')
//   })
//   .catch((err) => {
//     if (proces.env.NODE_ENV !== 'test') console.log(err)
//   })

module.exports = sequelize
