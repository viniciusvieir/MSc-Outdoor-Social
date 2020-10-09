module.exports = {
  host: process.env.PG_HOST,
  username: process.env.PG_USER,
  password: process.env.PG_PASS,
  database: process.env.PG_NAME,
  dialect: process.env.DB_DIALECT || 'postgres',
  storage: './__tests__/database.sqlite',
  logging: process.env.NODE_ENV === 'test' ? false : console.log,
}
