const moment = require('moment')

const ddmmyyhhmm = (date) => {
  return moment(date).format('DD/MM/YY HH:mm')
}

const eventDuration = (min) => {
  if (min < 60) {
    return `${min} minutes`
  }

  const hours = min / 60
  const rhours = Math.floor(hours)
  const minutes = (hours - rhours) * 60
  const rminutes = Math.round(minutes)

  const hourString = rhours + ` hour${rhours > 1 ? 's' : ''}`
  const minString = rminutes > 0 ? ' and ' + rminutes + ' minutes' : ''

  return hourString + minString
}

module.exports = { ddmmyyhhmm, eventDuration }
