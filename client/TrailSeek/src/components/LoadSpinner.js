import { Spinner } from 'native-base'
import React from 'react'
import { StyleSheet } from 'react-native'
import ColorConstants from '../util/ColorConstants'

const LoadSpinner = ({ visible }) => {
  return (
    <Spinner color={ColorConstants.primary} />
    // <Spinner
    //   visible={visible}
    //   textContent={'Loading'}
    //   textStyle={styles.spinnerTextStyle}
    // />
  )
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: ColorConstants.Black,
    width: 80,
  },
})

export default LoadSpinner
