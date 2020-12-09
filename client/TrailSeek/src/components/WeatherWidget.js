import React, { useRef, useState } from 'react'
import {
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native'
import { Text } from 'native-base'
import moment from 'moment'
import { Modalize } from 'react-native-modalize'
import { Portal } from 'react-native-portalize'
import { Row, Grid } from 'react-native-easy-grid'

import ColorConstants from '../util/ColorConstants'
import NoData from './NoData'
import Constants from '../util/Constants'
import WeatherModal from './WeatherModal'

const WeatherWidget = ({ data }) => {
  console.log(data)
  if (!data || JSON.stringify(data) === '{}') {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{ alignSelf: 'center' }}>No Weather Data</Text>
      </View>
    )
  }
  const [selectedW, setSelectedW] = useState({})

  const modelizeRef = useRef(null)
  const day = (dt, format) => {
    const day = moment(dt * 1000)
      .format(format)
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
    <View>
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
        contentContainerStyle={{
          paddingHorizontal: Constants.POINTS.marginHorizontal,
        }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.boxshadow}
              onPress={() => {
                setSelectedW(item)
                modelizeRef.current?.open()
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
                    {day(item.dt, 'ddd')}
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
            </TouchableOpacity>
          )
        }}
      />
      <Portal>
        <Modalize ref={modelizeRef} snapPoint={320}>
          {console.log(selectedW)}
          <WeatherModal dailyData={selectedW} />
        </Modalize>
      </Portal>
    </View>
  )
}

const styles = StyleSheet.create({
  boxshadow: {
    marginTop: 10,
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
  },
  modalTemp: {
    color: ColorConstants.darkGray,
    fontSize: 38,
  },
  colorProperty: {
    color: ColorConstants.darkGray,
  },
  propertyText: {
    fontSize: 20,
  },
})

export default WeatherWidget
