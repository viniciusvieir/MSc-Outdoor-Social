const errorHandler = (error) => {
  return error.response.data?.errors
    ? error.response.data.errors
        .map((item) => {
          return item.msg
        })
        .join(' ')
    : error.status
}

module.exports = { errorHandler }
