const isTest = process.env.NODE_ENV === 'test'

let config
if (isTest) {
  config = {
    dialect: 'sqlite',
    storage: './__tests__/database.sqlite',
    logging: false,
  }
} else {
  config = {
    host: process.env.PG_HOST,
    username: process.env.PG_USER,
    password: process.env.PG_PASS,
    database: process.env.PG_NAME,
    dialect: 'postgres',
    logging: console.log,
  }
}

module.exports = config
