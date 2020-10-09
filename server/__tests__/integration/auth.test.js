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

  it('should create a new user and reply with a token', async () => {
    const response = await supertest(app).post('/signup').send({
      email: 'auth@test.com',
      password: 'authentication',
      name: 'Authentication',
      gender: 'M',
    })

    expect(response.body).toHaveProperty('token')
  })

  it('should authenticate with valid credentials and reply with a token', async () => {
    const response = await supertest(app).post('/signin').send({
      email: 'auth@test.com',
      password: 'authentication',
    })

    expect(response.body).toHaveProperty('token')
  })
})
