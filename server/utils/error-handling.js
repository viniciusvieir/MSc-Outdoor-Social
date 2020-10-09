const errorHandler = (errors) => {
  const errorsArray = errors.map((error) => {
    return { msg: error }
  })
  return { errors: errorsArray }
}

module.exports = { errorHandler }
