const path = require('path')
const { homedir } = require('os')

const sequelize = require('../../src/databases/postgres')
const mongoose = require('mongoose')

const app = require('../../src/app')
const supertest = require('supertest')
const faker = require('faker')

const trailId = '5fa17e268f4d258042edf4b6'

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
    const response = await supertest(app).get(`/trails/${trailId}/events`)
    expect(response.body.length).toBeGreaterThan(-1)
  })

  it('should be able to create events', async () => {
    const signUpResponse = await supertest(app).post('/signup').send({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.findName(),
      gender: 'M',
      dob: '2000-10-01',
    })
    const response = await supertest(app)
      .post(`/trails/${trailId}/events`)
      .set('Authorization', `Bearer ${signUpResponse.body.token}`)
      .send({
        title: faker.lorem.words(2),
        description: faker.lorem.sentences(2),
        date: faker.date.future(),
        // duration_min: 60,
        max_participants: 10,
      })
    await supertest(app)
      .delete(`/trails/${trailId}/events/${response.body.eventId}`)
      .set('Authorization', `Bearer ${signUpResponse.body.token}`)

    expect(response.body.success).toBe(true)
  })

  it('should not be able to create events if not all parameters are given', async () => {
    const signUpResponse = await supertest(app).post('/signup').send({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.findName(),
      gender: 'M',
      dob: '2000-10-01',
    })
    const response = await supertest(app)
      .post(`/trails/${trailId}/events`)
      .set('Authorization', `Bearer ${signUpResponse.body.token}`)
      .send({
        title: faker.lorem.words(2),
      })
    expect(response.body).toHaveProperty('errors')
  })

  it('should not be able to create events if trail does not exist', async () => {
    const signUpResponse = await supertest(app).post('/signup').send({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.findName(),
      gender: 'M',
      dob: '2000-10-01',
    })
    const response = await supertest(app)
      .post('/trails/5fa17e26bf8d258042edf4be/events')
      .set('Authorization', `Bearer ${signUpResponse.body.token}`)
      .send({
        title: faker.lorem.words(2),
        description: faker.lorem.sentences(2),
        date: faker.date.future(),
        duration_min: 60,
        max_participants: 10,
      })
    expect(response.body.success).toBe(false)
  })

  it('should be able to delete event if it is owned by user', async () => {
    const signUpResponse = await supertest(app).post('/signup').send({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.findName(),
      gender: 'M',
      dob: '2000-10-01',
    })
    const trailResponse = await supertest(app)
      .post(`/trails/${trailId}/events`)
      .set('Authorization', `Bearer ${signUpResponse.body.token}`)
      .send({
        title: faker.lorem.words(2),
        description: faker.lorem.sentences(2),
        date: faker.date.future(),
        duration_min: 60,
        max_participants: 10,
      })
    const deleteResponse = await supertest(app)
      .delete(`/trails/${trailId}/events/${trailResponse.body.eventId}`)
      .set('Authorization', `Bearer ${signUpResponse.body.token}`)

    expect(deleteResponse.body.success).toBe(true)
  })

  it('should be able to update event if event is owned by user', async () => {
    const signUpResponse = await supertest(app).post('/signup').send({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.findName(),
      gender: 'M',
      dob: '2000-10-01',
    })
    const trailResponse = await supertest(app)
      .post(`/trails/${trailId}/events`)
      .set('Authorization', `Bearer ${signUpResponse.body.token}`)
      .send({
        title: faker.lorem.words(2),
        description: faker.lorem.sentences(2),
        date: faker.date.future(),
        duration_min: 60,
        max_participants: 10,
      })
    const updateResponse = await supertest(app)
      .put(`/trails/${trailId}/events/${trailResponse.body.eventId}`)
      .set('Authorization', `Bearer ${signUpResponse.body.token}`)
      .send({
        title: faker.lorem.words(2),
      })

    expect(updateResponse.body).toHaveProperty('_id')
  })

  it('should not be able to update event if event information is wrong', async () => {
    const signUpResponse = await supertest(app).post('/signup').send({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.findName(),
      gender: 'M',
      dob: '2000-10-01',
    })
    const trailResponse = await supertest(app)
      .post(`/trails/${trailId}/events`)
      .set('Authorization', `Bearer ${signUpResponse.body.token}`)
      .send({
        title: faker.lorem.words(2),
        description: faker.lorem.sentences(2),
        date: faker.date.future(),
        duration_min: 60,
        max_participants: 10,
      })
    const updateResponse = await supertest(app)
      .put(`/trails/${trailId}/events/${trailResponse.body.eventId}`)
      .set('Authorization', `Bearer ${signUpResponse.body.token}`)
      .send({
        title: faker.lorem.words(2),
        duration_min: 'wrong_field',
        max_participants: 'wrong_field',
      })

    expect(updateResponse.body).toHaveProperty('errors')
  })

  it('should not be able to update event if nothing is sent', async () => {
    const signUpResponse = await supertest(app).post('/signup').send({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.findName(),
      gender: 'M',
      dob: '2000-10-01',
    })
    const trailResponse = await supertest(app)
      .post(`/trails/${trailId}/events`)
      .set('Authorization', `Bearer ${signUpResponse.body.token}`)
      .send({
        title: faker.lorem.words(2),
        description: faker.lorem.sentences(2),
        date: faker.date.future(),
        duration_min: 60,
        max_participants: 10,
      })
    const updateResponse = await supertest(app)
      .put(`/trails/${trailId}/events/${trailResponse.body.eventId}`)
      .set('Authorization', `Bearer ${signUpResponse.body.token}`)

    expect(updateResponse.body).toHaveProperty('errors')
  })

  it('should not be able to update event if event if no information is sent', async () => {
    const signUpResponse = await supertest(app).post('/signup').send({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.findName(),
      gender: 'M',
      dob: '2000-10-01',
    })

    const trailResponse = await supertest(app)
      .post(`/trails/${trailId}/events`)
      .set('Authorization', `Bearer ${signUpResponse.body.token}`)
      .send({
        title: faker.lorem.words(2),
        description: faker.lorem.sentences(2),
        date: faker.date.future(),
        duration_min: 60,
        max_participants: 10,
      })

    const updateResponse = await supertest(app)
      .put(`/trails/${trailId}/events/${trailResponse.body.eventId}`)
      .set('Authorization', `Bearer ${signUpResponse.body.token}`)

    expect(updateResponse.body.success).toBe(false)
  })

  it('should be able to see events created by user', async () => {
    const signUpResponse = await supertest(app).post('/signup').send({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.findName(),
      gender: 'M',
      dob: '2000-10-01',
    })

    const eventResponse = await supertest(app)
      .get(`/user/eventsCreated`)
      .set('Authorization', `Bearer ${signUpResponse.body.token}`)

    expect(eventResponse.body).toStrictEqual([])
  })

  it('should be able to see events joined by user', async () => {
    const signUpResponse = await supertest(app).post('/signup').send({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.findName(),
      gender: 'M',
      dob: '2000-10-01',
    })

    const eventResponse = await supertest(app)
      .get(`/user/eventsJoined`)
      .set('Authorization', `Bearer ${signUpResponse.body.token}`)

    expect(eventResponse.body).toStrictEqual([])
  })

  it('should be able to join events', async () => {
    const signUpResponse = await supertest(app).post('/signup').send({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.findName(),
      gender: 'M',
      dob: '2000-10-01',
    })

    const eventResponse = await supertest(app)
      .post(`/trails/${trailId}/events`)
      .set('Authorization', `Bearer ${signUpResponse.body.token}`)
      .send({
        title: faker.lorem.words(2),
        description: faker.lorem.sentences(2),
        date: faker.date.future(),
        // duration_min: 60,
        max_participants: 10,
      })

    const joinResponse = await supertest(app)
      .post(`/trails/${trailId}/events/${eventResponse.body.eventId}/join`)
      .set('Authorization', `Bearer ${signUpResponse.body.token}`)

    expect(joinResponse.body.success).toBe(true)
  })
})
