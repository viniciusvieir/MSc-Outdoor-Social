import React, { useEffect, useState } from 'react'
import { TextInput, View, StyleSheet, Image, Keyboard } from 'react-native'
import { Text, Button } from 'react-native-elements'
import { Tile } from 'react-native-elements'
import moment from 'moment'
import ColorConstants from '../util/ColorConstants'

const ViewEventScreen = ({ navigation, route }) => {
  const { trailData, eventData } = route.params || {}
  if (trailData && eventData) {
    const eventWeather = trailData.weatherData.daily.find(
      (item) =>
        moment(item * 1000)
          .format('DD/MM/YYYY')
          .toString() === moment(eventData.date).format('DD/MM/YYYY').toString()
    )
  }
  // console.log(eventWeather);
  return (
    <>
      <View style={{ flex: 1, backgroundColor: ColorConstants.LGreen }}>
        {trailData && eventData ? (
          <>
            {/* //Mapview Instead of image tile */}
            {/* <Text>{trailData.start}</Text> */}
            <Tile
              imageSrc={{ uri: trailData.img_url }}
              title={eventData.title}
              featured
              activeOpacity={1}
              height={230}
              titleStyle={styles.tilettlstyle}
            />

            <Text>{eventData.description}</Text>
            <Text>{eventData.date}</Text>
            <Text>{eventData.duration_min}</Text>
            <Text>{eventData.max_participants}</Text>
            <Text>{eventData.createdAt}</Text>
            <Text>{trailData.estimate_time_min}</Text>
            <Text>{trailData.location}</Text>
            <Text>{trailData.length_km}</Text>
            <Text>{trailData.activity_type}</Text>
            <Text>{JSON.stringify(trailData.start)}</Text>
            {/* <Text>{trailData.weatherData.daily}</Text> */}
          </>
        ) : null}

        {/* <Text h3>ViewEventScreen</Text> */}
        {/* <Button
          title="Edit Event"
          onPress={() => {
            navigation.navigate("EditEvent");
          }}
        /> */}
      </View>
    </>
  )
}

const styles = StyleSheet.create({})

export default ViewEventScreen
