const path = require('path')
const { homedir } = require('os')

const mongoose = require('mongoose')

const app = require('../../src/app')
const supertest = require('supertest')

const id = '5f93f638c453707e17cc85a9'

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
    const response = await supertest(app).get(`/trails/${id}`)
    expect(response.body.name).toBe('Howth Loop Trail')
  })

  it('should return name field when requested on /trails/:id', async () => {
    const response = await supertest(app).get(`/trails/${id}?fields=name`)
    expect(response.body).toHaveProperty('name')
  })

  it('should return errors when id is less than 24 chars', async () => {
    const response = await supertest(app).get(
      `/trails/${id.slice(0, -1)}?fields=name`
    )
    expect(response.body).toHaveProperty('errors')
  })

  it('should return empty array when id does not exist', async () => {
    const response = await supertest(app).get(
      `/trails/${id
        .replace('8', '1')
        .replace('5', 'a')
        .replace('b', '8')
        .replace('c', '3')}?fields=name`
    )
    expect(response.body).toBe(null)
  })

  it('should return path with lat lon', async () => {
    const response = await supertest(app).get(`/trails/${id}?fields=path`)
    expect(response.body.path.length).toBeGreaterThan(0)
  })
})
