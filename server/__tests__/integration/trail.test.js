require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? 'test.env' : '.env',
})

const mongoose = require('mongoose')

const app = require('../../src/app')
const supertest = require('supertest')

describe('Trails', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL_TEST_READER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  // ####### /trails
  it('should get trails', async () => {
    const response = await supertest(app).get('/trails')
    expect(response.body.length).toBeGreaterThan(0)
  })

  it('should return name field when requested on /trails', async () => {
    const response = await supertest(app).get('/trails?fields=name&limit=1')
    expect(response.body[0]).toHaveProperty('name')
  })

  it('should only return n fields when limit is set', async () => {
    const response = await supertest(app).get('/trails?limit=5')
    expect(response.body.length).toBe(5)
  })

  it('should query trails based on activity', async () => {
    const query = {
      activity_type: 'Hiking',
    }
    const response = await supertest(app).get(
      `/trails?q=${JSON.stringify(query)}&fields=activity_type&limit=10`
    )
    expect(
      response.body
        .map((item) => item.activity_type)
        .every((value) => value === 'Hiking')
    ).toBe(true)
  })

  it('should throw error when getting limits params is not an integer', async () => {
    const response = await supertest(app).get('/trails?limit=abc')
    expect(response.body).toHaveProperty('errors')
  })

  // ####### /trails/:id
  it('should get trail by id', async () => {
    const id = '5f91094b4103311e6379d93a'
    const response = await supertest(app).get(`/trails/${id}`)
    expect(response.body.name).toBe(
      "Carrauntoohil Mountain Via Devil's Ladder Trail"
    )
  })

  it('should return name field when requested on /trails/:id', async () => {
    const id = '5f91094b4103311e6379d93a'
    const response = await supertest(app).get(`/trails/${id}?fields=name`)
    expect(response.body).toHaveProperty('name')
  })

  it('should return errors when id is less than 24 chars', async () => {
    const id = 'f91094b4103311e6379d93a'
    const response = await supertest(app).get(`/trails/${id}?fields=name`)
    expect(response.body).toHaveProperty('errors')
  })

  it('should return path with lat lon', async () => {
    const id = '5f91094b4103311e6379d93a'
    const response = await supertest(app).get(`/trails/${id}?fields=path`)
    expect(response.body.path.length).toBeGreaterThan(0)
  })
})
