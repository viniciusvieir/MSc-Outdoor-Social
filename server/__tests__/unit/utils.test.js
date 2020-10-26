const { errorHandler } = require('../../src/utils/error-handling')

describe('User Model', () => {
  it('should return error message with string param', () => {
    const error = errorHandler('Custom error')
    expect(error).toHaveProperty('msg')
  })
})
