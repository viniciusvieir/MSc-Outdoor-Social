require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? 'test.env' : '.env',
})

const sequelize = require('../../src/databases/postgres')

const User = require('../../src/models/user')

describe('User Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it('should encrypt user password upon user creation', async () => {
    const user = await User.create({
      email: 'password@test.com',
      password: 'password',
      name: 'Password Test',
      dob: new Date(),
      gender: 'M',
    })

    expect(user.verifyPassword('password')).toBe(true)
  })

  it('should encrypt user password when updating', async () => {
    const user = await User.findOne({ where: { email: 'password@test.com' } })
    await user.update({ password: 'new_password' })
    expect(user.verifyPassword('new_password')).toBe(true)
  })
})
