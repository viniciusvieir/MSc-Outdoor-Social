const errorHandler = (errors) => {
  const errorsArray = errors.map((error) => {
    return { msg: error }
  })
  return { success: false, errors: errorsArray }
}

module.exports = { errorHandler }
