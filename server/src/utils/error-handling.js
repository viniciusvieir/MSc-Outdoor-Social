const errorHandler = (errors) => {
  if (typeof errors === 'string') {
    return { success: false, errors: [{ msg: errors }] }
  }
  const errorsArray = errors.map((error) => {
    return { msg: error }
  })
  return { success: false, errors: errorsArray }
}

module.exports = { errorHandler }
