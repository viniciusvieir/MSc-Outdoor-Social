const { compareSync } = require('bcryptjs')
const sequelize = require('../../src/databases/postgres')

const User = require('../../src/models/user')

describe('User Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it('should encrypt user password', async () => {
    const user = await User.create({
      email: 'pass@test.com',
      password: '123456',
      name: 'Password Test',
      dob: new Date(),
      gender: 'M',
    })

    expect(user.password).toBe('123456')
  })
})
