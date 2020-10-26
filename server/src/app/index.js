const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const routes = require('../routes')
const path = require('path')

class AppController {
  constructor() {
    this.express = express()

    this.middlewares()
    this.routes()
  }

  middlewares() {
    this.express.use(express.json())
    this.express.use(express.urlencoded({ extended: false }))
    this.express.use(helmet())
    this.express.use(cors())
    this.express.use(morgan('dev'))
    // this.express.use(express.static(__dirname + '../public'))

    const jest = path.join(__dirname, '../../__tests__/coverage/lcov-report')
    this.express.use('/jest/backend', express.static(jest))
  }

  routes() {
    this.express.use(routes)
  }
}

module.exports = new AppController().express
