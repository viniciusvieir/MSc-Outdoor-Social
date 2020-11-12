const path = require('path')
const { homedir } = require('os')

const sequelize = require('../../src/databases/postgres')
const mongoose = require('mongoose')

const app = require('../../src/app')
const supertest = require('supertest')
const faker = require('faker')

describe('Trails', () => {
  beforeAll(async () => {
    require('dotenv').config({
      path:
        process.env.USER === 'trailseek'
          ? path.join(homedir(), 'ecosystem/test.env')
          : 'test.env',
    })

    const url = `mongodb://${process.env.MONGO_DEV_USER}:${process.env.MONGO_DEV_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_COLLECTION}`
    await mongoose
      .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(() => console.log('MongoDB connected...'))
      .catch((e) => console.log(e))
    await sequelize.sync({ force: false }).then('Postgress connected...')
  })

  afterAll(async () => {
    await mongoose
      .disconnect()
      .then(() => console.log('MongoDB disconected...'))
    await sequelize.close()
  })

  it('should get a list of events', async () => {
    const response = await supertest(app).get(
      '/trails/5fa17e268f4d258042edf4da/events'
    )
    expect(response.body.length).toBeGreaterThan(0)
  })

  it('should be able to create events', async () => {
    const loginResponse = await supertest(app).post('/signin').send({
      email: 'auth@test.com',
      password: 'authentication',
    })
    const response = await supertest(app)
      .post('/trails/5fa17e268f4d258042edf4b6/events')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send({
        title: faker.lorem.words(2),
        description: faker.lorem.sentences(2),
        date: faker.date.future(),
        // duration_min: 60,
        max_participants: 10,
      })
    await supertest(app)
      .delete(
        '/trails/5fa17e268f4d258042edf4b6/events/' + response.body.eventId
      )
      .set('Authorization', `Bearer ${loginResponse.body.token}`)

    expect(response.body.success).toBe(true)
  })

  it('should not be able to create events if not all parameters are given', async () => {
    const loginResponse = await supertest(app).post('/signin').send({
      email: 'auth@test.com',
      password: 'authentication',
    })
    const response = await supertest(app)
      .post('/trails/5fa17e26bf8d258042edf4be/events')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send({
        title: faker.lorem.words(2),
      })
    expect(response.body).toHaveProperty('errors')
  })

  it('should not be able to create events if trail does not exist', async () => {
    const loginResponse = await supertest(app).post('/signin').send({
      email: 'auth@test.com',
      password: 'authentication',
    })
    const response = await supertest(app)
      .post('/trails/5fa17e26bf8d258042edf4be/events')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send({
        title: faker.lorem.words(4),
        description: faker.lorem.sentences(2),
        date: faker.date.future(),
        duration_min: 60,
        max_participants: 10,
      })
    expect(response.body.success).toBe(false)
  })

  it('should be able to delete event if event is owned by user', async () => {
    const loginResponse = await supertest(app).post('/signin').send({
      email: 'auth@test.com',
      password: 'authentication',
    })
    const trailResponse = await supertest(app)
      .post('/trails/5fa17e26bf8d258042edf4be/events')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send({
        title: faker.lorem.words(4),
        description: faker.lorem.sentences(2),
        date: faker.date.future(),
        duration_min: 60,
        max_participants: 10,
      })
    const deleteResponse = await await supertest(app)
      .delete(
        '/trails/5fa17e26bf8d258042edf4be/events/' + trailResponse.body.eventId
      )
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
    expect(deleteResponse.body.success).toBe(true)
  })
})
