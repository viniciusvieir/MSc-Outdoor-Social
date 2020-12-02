const sequelize = require('../../src/databases/postgres')
const app = require('../../src/app')
const supertest = require('supertest')
const faker = require('faker')

const User = require('../../src/models/user.psql')

describe('Authentication', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true })

    let users = []
    for (let i = 0; i < 10; i++) {
      users.push({
        name: faker.name.findName(),
        dob: faker.date.past(),
        gender: 'M',
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
      dob: '2000-10-01',
    })
    expect(response.body).toHaveProperty('token')
  })

  it('should not create a duplicated user', async () => {
    await supertest(app).post('/signup').send({
      email: 'duplicated@test.com',
      password: 'authentication',
      name: 'Duplicated',
      gender: 'F',
      dob: '2000-10-01',
    })
    const response = await supertest(app).post('/signup').send({
      email: 'duplicated@test.com',
      password: 'authentication',
      name: 'Duplicated',
      gender: 'F',
      dob: '2000-10-01',
    })
    expect(response.body).toHaveProperty('errors')
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

  // Authentication token
  it('should be able to access private routes when authenticated', async () => {
    const login = await supertest(app).post('/signin').send({
      email: 'auth@test.com',
      password: 'authentication',
    })
    const response = await supertest(app)
      .get('/user')
      .set('Authorization', `Bearer ${login.body.token}`)
    expect(response.body).toHaveProperty('id')
  })

  it('should not be able to access private routes without bearer token', async () => {
    const response = await supertest(app).get('/user')
    expect(response.body).toHaveProperty('errors')
  })

  it('should not be able to access private routes with custom tokens', async () => {
    const response = await supertest(app)
      .get('/user')
      .set('Authorization', `Bearer random_token`)
    expect(response.body).toHaveProperty('errors')
  })

  it('should be able to get user information', async () => {
    const signUpResponse = await supertest(app).post('/signup').send({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.findName(),
      gender: 'M',
      dob: '2000-10-01',
    })

    const token = signUpResponse.body.token
    const userResponse = await supertest(app)
      .get('/user')
      .set('Authorization', `Bearer ${token}`)

    expect(userResponse.body).toHaveProperty('id')
    expect(userResponse.body).toHaveProperty('name')
    expect(userResponse.body).toHaveProperty('email')
    expect(userResponse.body).toHaveProperty('dob')
  })

  it('should be able to change user name', async () => {
    const signUpResponse = await supertest(app).post('/signup').send({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.findName(),
      gender: 'M',
      dob: '2000-10-01',
    })

    const token = signUpResponse.body.token
    const userResponse = await supertest(app)
      .put('/user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: faker.name.findName(),
      })
    expect(userResponse.body).toHaveProperty('success')
  })
})
