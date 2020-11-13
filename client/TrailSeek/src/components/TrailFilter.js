import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Text } from 'native-base'
import ColorConstants from '../util/ColorConstants'

const TrailFilter = ({ title, active, action }) => {
  return (
    <TouchableOpacity
      style={{
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={action}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          color:
            active === true ? ColorConstants.secondary : ColorConstants.DWhite,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor:
            active === true ? ColorConstants.secondary : ColorConstants.DWhite,
          marginTop: 6,
          height: 10,
          width: 10,
          borderRadius: 10 / 2,
        }}
      ></View>
    </TouchableOpacity>
  )
}

export default TrailFilter
