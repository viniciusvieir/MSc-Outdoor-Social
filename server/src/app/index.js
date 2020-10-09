require('../databases/postgres')

const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const routes = require('../routes')

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
    this.express.use(morgan('dev'))
    this.express.use(express.static(__dirname + '../public'))
  }

  routes() {
    this.express.use(routes)
  }
}

module.exports = new AppController().express
