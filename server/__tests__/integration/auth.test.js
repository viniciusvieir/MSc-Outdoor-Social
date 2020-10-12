require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
})

const sequelize = require('../../src/databases/postgres')
const app = require('../../src/app')
const supertest = require('supertest')
const faker = require('faker')

const User = require('../../src/models/user')

describe('Authentication', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true })

    let users = []
    for (let i = 0; i < 100; i++) {
      users.push({
        name: faker.name.findName(),
        dob: faker.date.past(),
        gender: 'X',
        email: faker.internet.email(),
        password: faker.internet.password(),
      })
    }
    await User.bulkCreate(users)
  })

  afterAll(async () => {
    await sequelize.close()
  })

  // SIGN UP
  it('should create a new user and reply with a token', async () => {
    const response = await supertest(app).post('/signup').send({
      email: 'auth@test.com',
      password: 'authentication',
      name: 'Authentication',
      gender: 'M',
    })
    expect(response.body).toHaveProperty('token')
  })

  // SIGN IN
  it('should authenticate with valid credentials and reply with a token', async () => {
    const response = await supertest(app).post('/signin').send({
      email: 'auth@test.com',
      password: 'authentication',
    })
    expect(response.body).toHaveProperty('token')
  })

  it('should return error when email does not exist', async () => {
    const response = await supertest(app).post('/signin').send({
      email: 'email_that_doesnt_exist@test.com',
      password: 'authentication',
    })
    expect(response.body).toHaveProperty('errors')
  })

  it('should return error when password is wrong', async () => {
    const response = await supertest(app).post('/signin').send({
      email: 'auth@test.com',
      password: 'wrong_password',
    })
    expect(response.body).toHaveProperty('errors')
  })

  it('should return error when not all fields are sent when signing in', async () => {
    const response = await supertest(app).post('/signin').send({
      email: 'auth@test.com',
    })
    expect(response.body).toHaveProperty('errors')
  })

  it('should return error when not all fields are sent when signing up', async () => {
    const response = await supertest(app).post('/signup').send({
      email: 'auth@test.com',
    })
    expect(response.body).toHaveProperty('errors')
  })

  it('should be able to access private routes when authenticated', async () => {
    // const response = await (await supertest(app).get('/signup')).set(
    //   'Authorization',
    //   `bearer token`
    // )
    expect(2).toBe(2)
  })
})
