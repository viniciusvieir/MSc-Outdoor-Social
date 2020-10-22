const errorHandler = (errors) => {
  console.log(typeof errors)
  if (typeof errors === 'string') {
    return { success: false, msg: errors }
  }
  const errorsArray = errors.map((error) => {
    return { msg: error }
  })
  return { success: false, errors: errorsArray }
}

module.exports = { errorHandler }
