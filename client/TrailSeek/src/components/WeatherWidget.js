import React from 'react'
import { StyleSheet, Image, FlatList, View } from 'react-native'
import { Grid, Row, Text } from 'native-base'
import moment from 'moment'
import ColorConstants from '../util/ColorConstants'
import NoData from './NoData'
import Constants from '../util/Constants'

const WeatherWidget = ({ data }) => {
  const day = (dt) => {
    const day = moment(dt * 1000)
      .format('ddd')
      .toString()
    return day
  }

  const date = (dt) => {
    const date = moment(dt * 1000)
      .format('DD/MM')
      .toString()
    return date
  }

  return (
    <FlatList
      ListEmptyComponent={<NoData />}
      horizontal
      data={data.daily}
      keyExtractor={(itemW) => {
        return itemW.dt.toString()
      }}
      nestedScrollEnabled
      contentContainerStyle={{
        paddingHorizontal: Constants.POINTS.marginHorizontal,
      }}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => {
        return (
          <View
            style={{
              marginTop: 1,
              marginBottom: 10,
              borderRadius: 10,
              backgroundColor: '#ffffff',
              marginHorizontal: 5,
              marginVertical: 4,
              shadowColor: '#000',
              shadowOffset: {
                width: 2,
                height: 0,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Grid style={{ flex: 1 }}>
              <Row
                style={{
                  alignItems: 'center',
                  flex: 1,
                  justifyContent: 'center',
                  marginTop: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: ColorConstants.darkGray,
                  }}
                >
                  {day(item.dt)}
                </Text>
              </Row>
              <Row
                style={{
                  alignItems: 'center',
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: ColorConstants.darkGray }}>
                  {date(item.dt)}
                </Text>
              </Row>
              <Row>
                <Image
                  style={{ width: 80, height: 80 }}
                  source={{
                    uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                  }}
                />
              </Row>
              <Row
                style={{
                  alignItems: 'center',
                  flex: 1,
                  justifyContent: 'center',
                  marginBottom: 5,
                }}
              >
                <Text style={{ color: ColorConstants.darkGray }}>
                  {Math.ceil(item.temp.max)}° • {Math.floor(item.temp.min)}°
                </Text>
              </Row>
            </Grid>
          </View>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({})

export default WeatherWidget
