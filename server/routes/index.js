const router = require('express').Router()

router.get('/hello', (req, res) => {
  res.send('GTFO')
})

module.exports = router
