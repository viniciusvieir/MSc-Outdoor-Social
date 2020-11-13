import React from 'react'
import { View } from 'react-native'
import { Text } from 'native-base'
import ColorConstants from '../util/ColorConstants'

const NoData = ({ type }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        style={{
          fontSize: 25,
          fontWeight: 'bold',
          color: ColorConstants.DWhite,
        }}
      >
        No Data Found
      </Text>
    </View>
  )
}

export default NoData
