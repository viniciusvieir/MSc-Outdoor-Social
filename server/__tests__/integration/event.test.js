const path = require('path')
const { homedir } = require('os')

const mongoose = require('mongoose')

const app = require('../../src/app')
const supertest = require('supertest')

describe('Trails', () => {
  beforeAll(async () => {
    require('dotenv').config({
      path:
        process.env.USER === 'trailseek'
          ? path.join(homedir(), 'ecosystem/test.env')
          : 'test.env',
    })

    const url = `mongodb://${process.env.MONGO_READER_USER}:${process.env.MONGO_READER_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_COLLECTION}`
    await mongoose
      .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(() => console.log('MongoDB connected...'))
      .catch((e) => console.log(e))
  })

  afterAll(async () => {
    await mongoose
      .disconnect()
      .then(() => console.log('MongoDB disconected...'))
  })

  // ####### /trails
  it('should get a list of events', async () => {
    const response = await supertest(app).get(
      '/trails/5fa17e268f4d258042edf4da/events'
    )
    expect(response.body.length).toBeGreaterThan(0)
  })
})
