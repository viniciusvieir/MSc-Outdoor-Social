import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native'
import { Text, CardItem, Card } from 'native-base'
import StarRating from 'react-native-star-rating'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'
import { useSelector } from 'react-redux'

import { FontAwesome5 } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'

import WeatherWidget from './WeatherWidget'
import CovidWidget from './CovidWidget'
import ColorConstants from '../util/ColorConstants'
import NoData from './NoData'
import Constants from '../util/Constants'
import RatingModal from './RatingModal'

const DetaiTabs = ({ trailData, covData }) => {
  const navigation = useNavigation()
  const covidToggle = useSelector((state) => state.user.covidToggle)
  let covContent
  covContent = covidToggle ? (
    <>
      <View
        style={{
          marginVertical: 16,
          borderBottomColor: ColorConstants.darkGray,
          borderBottomWidth: 1,
        }}
      />
      <Row>
        <CovidWidget data={covData} />
      </Row>
    </>
  ) : null

  return (
    <ScrollView
      style={{
        backgroundColor: ColorConstants.DWhite,
        flex: 1,
        padding: Constants.POINTS.marginHorizontal,
      }}
      nestedScrollEnabled
    >
      <Grid>
        <Row>
          <Col size={3}>
            <Text
              style={{
                color: ColorConstants.primary,
                fontSize: 26,
                fontWeight: 'bold',
              }}
            >
              {trailData.name}
            </Text>
          </Col>
          <Col size={1}>
            <RatingModal trailData={trailData} />
          </Col>
        </Row>

        <Row>
          <Entypo name='location-pin' size={16} color='gray' />
          <Text style={{ fontSize: 14 }}>{trailData.location}</Text>
        </Row>

        <Row style={{ marginTop: 16 }}>
          <Col size={1}>
            <Row>
              <FontAwesome5
                name='hiking'
                size={20}
                color={ColorConstants.Black2}
              />
              <Text style={styles.textInfo}>{trailData.activity_type}</Text>
            </Row>
          </Col>
          <Col size={1}>
            <Row>
              <FontAwesome5
                name='mountain'
                size={16}
                color={ColorConstants.Black2}
              />
              <Text style={styles.textInfo}>{trailData.difficulty}</Text>
            </Row>
          </Col>
          <Col size={1}>
            <Row>
              <FontAwesome5
                name='route'
                size={20}
                color={ColorConstants.Black2}
              />
              <Text style={styles.textInfo}>{trailData.length_km} km</Text>
            </Row>
          </Col>
          <Col size={1}>
            <Row>
              <FontAwesome5
                name='clock'
                size={20}
                color={ColorConstants.Black2}
              />
              <Text style={styles.textInfo}>
                {moment
                  .utc()
                  .startOf('day')
                  .add({ minutes: trailData.estimate_time_min })
                  .format('H[h]mm')}
              </Text>
            </Row>
          </Col>
        </Row>

        <View
          style={{
            marginTop: 16,
            borderBottomColor: ColorConstants.darkGray,
            borderBottomWidth: 1,
          }}
        />

        <Row style={{ marginTop: 16 }}>
          <Text style={styles.textInfoDescription}>
            {trailData.description}
          </Text>
        </Row>
        {covContent}
        <View
          style={{
            marginVertical: 16,
            borderBottomColor: ColorConstants.darkGray,
            borderBottomWidth: 1,
          }}
        />
        <Row style={{ marginVertical: 10 }}>
          <WeatherWidget data={trailData.weatherData} />
        </Row>
      </Grid>
      <View
        style={{
          marginVertical: 16,
          borderBottomColor: ColorConstants.darkGray,
          borderBottomWidth: 1,
        }}
      />
      <Text style={styles.similarTrails}>Similar Trails: </Text>
      <FlatList
        ListEmptyComponent={<NoData />}
        nestedScrollEnabled
        horizontal
        data={trailData.recommended}
        keyExtractor={(trails) => {
          return trails._id
        }}
        renderItem={({ item }) => {
          return (
            <View style={{ flex: 1 }}>
              <Card
                style={{
                  width: 250,
                  marginLeft: 10,
                  backgroundColor: ColorConstants.DWhite,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.push('ViewTrail', {
                      id: item._id,
                      name: item.name,
                    })
                  }}
                >
                  <CardItem cardBody>
                    <Image
                      source={{ uri: item.img_url }}
                      style={styles.imageStyle}
                      PlaceholderContent={<ActivityIndicator />}
                      resizeMethod='auto'
                      resizeMode='cover'
                    />
                  </CardItem>
                  <CardItem style={{ backgroundColor: ColorConstants.DWhite }}>
                    <Grid>
                      <Col size={4}>
                        <Text>{item.name}</Text>
                      </Col>
                      <Col size={2}>
                        <StarRating
                          disabled={true}
                          emptyStar={'ios-star-outline'}
                          fullStar={'ios-star'}
                          halfStar={'ios-star-half'}
                          iconSet={'Ionicons'}
                          maxStars={5}
                          rating={item.avg_rating}
                          fullStarColor={'gold'}
                          starSize={16}
                        />
                      </Col>
                    </Grid>
                  </CardItem>
                </TouchableOpacity>
              </Card>
            </View>
          )
        }}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  textInfo: {
    marginLeft: 4,
    color: ColorConstants.Black2,
    fontSize: 16,
  },
  textInfoLabel: {
    fontSize: 12,
    color: ColorConstants.darkGray,
  },
  textInfoDescription: {
    color: ColorConstants.darkGray,
    fontSize: 15,
  },

  imageStyle: {
    width: null,
    flex: 1,
    height: 150,
  },
  similarTrails: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: ColorConstants.darkGray,
  },
})

export default DetaiTabs
