import React from 'react'
import { Text, View } from 'native-base'
import ColorConstants from '../util/ColorConstants'
import moment from 'moment'

const CalendarView = ({ date, showWeekdayAndTime = true, eventDuration }) => {
  return (
    <>
      <View
        style={{
          height: 50,
          width: 50,
          backgroundColor: ColorConstants.primary + '22',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            color: ColorConstants.red,
            fontSize: 12,
            fontWeight: 'bold',
          }}
        >
          {moment(date).format('MMM').toUpperCase()}
        </Text>
        <Text style={{ fontWeight: 'bold' }}>{moment(date).format('DD')}</Text>
        {/* <Text style={{ fontSize: 8 }}>{moment(date).format('YYYY')}</Text> */}
      </View>

      {showWeekdayAndTime && eventDuration && (
        <View style={{ marginLeft: 14 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
            {moment(date).format('dddd')}
          </Text>
          <Text style={{ fontSize: 14 }}>
            {moment(date).format('hh:mm')}
            {'-'}
            {moment(date).add(eventDuration, 'minutes').format('hh:mm A')}
          </Text>
        </View>
      )}
    </>
  )
}

export default CalendarView
