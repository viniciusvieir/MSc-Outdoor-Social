import React, { useRef } from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import { View, Text, Button, Icon } from 'native-base'
import moment from 'moment'
import { Modalize } from 'react-native-modalize'
import { Portal } from 'react-native-portalize'
import { LineChart } from 'react-native-chart-kit'

import ColorConstants from '../util/ColorConstants'

const CovidWidget = ({ data }) => {
  if (!data || JSON.stringify(data) === '{}') {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{ alignSelf: 'center' }}>No Covid Data</Text>
      </View>
    )
  }
  const modelizeRef = useRef(null)

  const day = (dt) => {
    const day = moment(dt).format('ddd').toString()
    return day
  }

  const date = (dt) => {
    const date = moment(dt).format('DD/MM').toString()
    return date
  }
  let content
  if (data.length > 0) {
    const lastItem = data.length - 1
    const pastCumiCases = data[0].attributes.ConfirmedCovidCases
    content = (
      <View
        style={{
          paddingHorizontal: 20,
        }}
      >
        <Button
          button
          danger
          iconLeft
          block
          style={{
            padding: 20,
          }}
          onPress={() => modelizeRef.current?.open()}
        >
          <Icon name="ios-warning" />
          <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
            Covid Cases in the last {data?.length || 7} days in{' '}
            {data[lastItem].attributes.CountyName} as of{' '}
            {day(data[lastItem].attributes.TimeStamp)} (
            {date(data[lastItem].attributes.TimeStamp)}) :{' '}
            {data[lastItem].attributes.ConfirmedCovidCases - pastCumiCases} (+
            {data[lastItem].attributes.ConfirmedCovidCases -
              data[lastItem - 1].attributes.ConfirmedCovidCases}
            )
          </Text>
        </Button>
        <Text style={{ alignSelf: 'center', color: ColorConstants.darkGray }}>
          Click for more info
        </Text>
        <Portal>
          <Modalize ref={modelizeRef} snapPoint={380}>
            <View
              style={{
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center',
                // backgroundColor: ColorConstants.LGreen + '95',
              }}
            >
              <LineChart
                fromZero={true}
                data={{
                  labels: data.slice(1).map((item) => {
                    return moment(item.attributes.TimeStamp)
                      .format('DD/MM')
                      .toString()
                  }),
                  datasets: [
                    {
                      color: (opacity = 1) => `rgb(231, 111, 81, ${opacity})`,
                      strokeWidth: 4,
                      data: data.slice(1).map((item) => {
                        return (
                          item.attributes.ConfirmedCovidCases - pastCumiCases
                        )
                      }),
                    },
                  ],
                }}
                width={Dimensions.get('window').width - 10} // from react-native
                height={300}
                // yAxisLabel="$"
                // yAxisSuffix="k"
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                  backgroundColor: '#F58F00',
                  backgroundGradientFrom: '#e9c46a',
                  backgroundGradientTo: '#FFDCAD',
                  // backgroundColor: ColorConstants.DWhite,
                  // backgroundGradientFrom: ColorConstants.DWhite,
                  // backgroundGradientTo: ColorConstants.DWhite,
                  decimalPlaces: 0, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
                  propsForDots: {
                    r: '2',
                    strokeWidth: '1',
                    stroke: ColorConstants.red,
                  },
                }}
                // bezier
                style={{
                  marginVertical: 10,
                  borderRadius: 10,
                }}
              />
              <Text style={{ alignContent: 'center', margin: 10 }}>
                The numbers on the Y-axis are the increased covid cases and the
                X-axis represents the date.
              </Text>
            </View>
          </Modalize>
        </Portal>
      </View>
    )
  }

  return <View>{content}</View>
}

const styles = StyleSheet.create({})

export default CovidWidget
