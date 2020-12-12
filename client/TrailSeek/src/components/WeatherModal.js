import React from 'react'
import { StyleSheet, Image, View, ScrollView, Dimensions } from 'react-native'
import { Text } from 'native-base'
import moment from 'moment'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { Feather } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { LineChart } from 'react-native-chart-kit'

import ColorConstants from '../util/ColorConstants'

const WeatherModal = ({ dailyData }) => {
  if (JSON.stringify(dailyData) === '{}') {
    return null
  }
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
  const riseSetSize = 40
  const iconSize = 25
  return (
    <View style={{ marginTop: 20, margin: 20 }}>
      <Text style={{ fontSize: 30, alignSelf: 'center' }}>
        {day(dailyData.dt, 'dddd')}
      </Text>
      <Text style={{ fontSize: 16, alignSelf: 'center', fontWeight: 'bold' }}>
        {date(dailyData.dt)}
      </Text>
      <Grid>
        {dailyData.weather ? (
          <Row style={{ marginHorizontal: 30, marginBottom: 20 }}>
            <Col style={{ alignItems: 'center' }} size={2}>
              <View style={styles.boxshadow}>
                <Image
                  style={{ width: 100, height: 100 }}
                  source={{
                    uri: `http://openweathermap.org/img/wn/${dailyData.weather[0].icon}@2x.png`,
                  }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    alignSelf: 'center',
                    fontWeight: '500',
                    marginBottom: 5,
                    color: ColorConstants.darkGray,
                  }}
                >
                  {dailyData.weather[0].main}
                </Text>
              </View>
            </Col>
            <Col size={1} style={{ justifyContent: 'center', marginLeft: 20 }}>
              <Text style={styles.modalTemp}>
                {Math.ceil(dailyData.temp.max)}°
              </Text>
              <Text style={{ color: ColorConstants.darkGray }}>Max</Text>
            </Col>
            <Col size={1}>
              <Text style={[styles.modalTemp, { fontSize: 50, marginTop: 30 }]}>
                •
              </Text>
            </Col>
            <Col size={1} style={{ justifyContent: 'center' }}>
              <Text style={styles.modalTemp}>
                {Math.ceil(dailyData.temp.min)}°
              </Text>
              <Text style={{ color: ColorConstants.darkGray }}>Min</Text>
            </Col>
          </Row>
        ) : null}
        <Row style={{ marginBottom: 20 }}>
          <Col style={{ alignItems: 'center' }}>
            <Feather
              name="sunrise"
              size={riseSetSize}
              color="black"
              style={styles.colorProperty}
            />
            <Text style={styles.propertyText}>
              {moment(dailyData.sunrise * 1000).format('hh:mm A')}
            </Text>
          </Col>
          <Col style={{ alignItems: 'center' }}>
            <Feather
              name="sunset"
              size={riseSetSize}
              color="black"
              style={styles.colorProperty}
            />
            <Text style={styles.propertyText}>
              {moment(dailyData.sunset * 1000).format('hh:mm A')}
            </Text>
          </Col>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Col style={{ alignItems: 'center' }}>
            <Feather
              name="thermometer"
              size={iconSize}
              color="black"
              style={styles.colorProperty}
            />
            <Text style={styles.colorProperty}>Feels Like</Text>
            {dailyData.feels_like ? (
              <Text style={styles.propertyText}>
                {Math.ceil(dailyData.feels_like.day)}°/
                {Math.ceil(dailyData.feels_like.night)}°
              </Text>
            ) : null}
          </Col>
          <Col style={{ alignItems: 'center' }}>
            <Feather
              name="droplet"
              size={iconSize}
              color="black"
              style={styles.colorProperty}
            />
            <Text style={styles.colorProperty}>Dew Point</Text>
            <Text style={styles.propertyText}>
              {Math.ceil(dailyData.dew_point)}°C
            </Text>
          </Col>
          <Col style={{ alignItems: 'center' }}>
            <AntDesign
              name="dashboard"
              size={iconSize}
              color="black"
              style={styles.colorProperty}
            />
            <Text style={styles.colorProperty}>Pressure</Text>
            <Text style={styles.propertyText}>{dailyData.pressure} hPa</Text>
          </Col>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Col style={{ alignItems: 'center' }}>
            <Entypo
              name="water"
              size={iconSize}
              color="black"
              style={styles.colorProperty}
            />
            <Text style={styles.colorProperty}>Humidity</Text>

            <Text style={styles.propertyText}>{dailyData.humidity} %</Text>
          </Col>
          <Col style={{ alignItems: 'center' }}>
            <Feather
              name="cloud"
              size={iconSize}
              color="black"
              style={styles.colorProperty}
            />
            <Text style={styles.colorProperty}>Cloud Cover</Text>
            <Text style={styles.propertyText}>{dailyData.clouds} %</Text>
          </Col>
          <Col style={{ alignItems: 'center' }}>
            <Feather
              name="cloud-rain"
              size={iconSize}
              color="black"
              style={styles.colorProperty}
            />
            <Text style={styles.colorProperty}>Rain</Text>
            <Text style={styles.propertyText}>
              {parseInt(dailyData.rain).toFixed(0)} mm
            </Text>
          </Col>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Col style={{ alignItems: 'center' }}>
            <Feather
              name="wind"
              size={iconSize}
              color="black"
              style={styles.colorProperty}
            />

            <Text style={styles.colorProperty}>Wind</Text>
            <View style={{ flexDirection: 'row' }}>
              <Feather
                name="navigation-2"
                size={20}
                color="black"
                style={{
                  transform: [{ rotate: `${dailyData.wind_deg}deg` }],
                  marginRight: 5,
                }}
              />
              <Text style={styles.propertyText}>
                {Math.ceil(dailyData.wind_speed * 3.6)} km/h
              </Text>
            </View>
          </Col>
          <Col style={{ alignItems: 'center' }}>
            <Feather
              name="sun"
              size={iconSize}
              color="black"
              style={styles.colorProperty}
            />
            <Text style={styles.colorProperty}>UV Index</Text>
            <Text style={styles.propertyText}>
              {parseInt(dailyData.uvi).toFixed(0)}/10
            </Text>
          </Col>
          <Col style={{ alignItems: 'center' }}>
            <Feather
              name="umbrella"
              size={iconSize}
              color="black"
              style={styles.colorProperty}
            />
            <Text style={styles.colorProperty}>Prob. of Rain</Text>
            <Text style={styles.propertyText}>{dailyData.pop * 100} %</Text>
          </Col>
        </Row>
      </Grid>
      {/* <ScrollView horizontal> */}
      {/* <LineChart
          fromZero={true}
          data={{
            labels: [10, 20],
            //   labels: data.slice(1).map((item) => {
            //     return moment(item.attributes.TimeStamp)
            //       .format('DD/MM')
            //       .toString()
            //   }),
            datasets: [
              10,
              20,
              // {
              //   data: data.slice(1).map((item) => {
              //     return (
              //       item.attributes.ConfirmedCovidCases - pastCumiCases
              //     )
              //   }),
              // },
            ],
          }}
          width={Dimensions.get('window').width - 10} // from react-native
          height={300}
          // yAxisLabel="$"
          // yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: ColorConstants.DGreen,
            //   backgroundGradientFrom: "#fb8c00",
            //   backgroundGradientTo: "#ffa726",
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            // style: {
            //   // borderRadius: 10,
            //   // height: 200,
            // },
            propsForDots: {
              r: '1',
              strokeWidth: '1',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={{
            marginVertical: 10,
            borderRadius: 10,
          }}
        /> */}
      {/* </ScrollView>
      <ScrollView horizontal></ScrollView> */}
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

export default WeatherModal
