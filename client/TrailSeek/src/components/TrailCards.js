import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native'

import { Entypo } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons'

import { useNavigation } from '@react-navigation/native'
import StarRating from 'react-native-star-rating'
import { Col, Row, Grid } from 'react-native-easy-grid'
import {
  Button,
  Text,
  H3,
  Card,
  CardItem,
  Left,
  Right,
  Icon,
} from 'native-base'

import ColorConstants from '../util/ColorConstants'
import NoData from './NoData'
import Constants from '../util/Constants'

const TrailCards = ({ trails, fetchMoreData, filter }) => {
  const navigation = useNavigation()

  let content = trails ? (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{
          paddingTop: 20,
          paddingBottom: 20,
          paddingHorizontal: Constants.POINTS.marginHorizontal,
          // backgroundColor: '#f1f1f1',
        }}
        ListEmptyComponent={<NoData type={'funny'} />}
        // initialNumToRender={10}
        data={trails}
        keyExtractor={(trails) => {
          return trails._id
        }}
        ListFooterComponent={
          trails.length >= 10 ? (
            <Button
              block
              onPress={() => {
                navigation.navigate('ListTrail', { filter })
              }}
              style={{
                margin: 5,
                backgroundColor: ColorConstants.Yellow,
              }}
            >
              <Text>View More</Text>
            </Button>
          ) : null
        }
        // onEndReached={fetchMoreData}
        // onEndReachedThreshold={0.3}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ViewTrail', {
                  id: item._id,
                  name: item.name,
                  showEvents: false,
                })
              }}
            >
              <Card>
                <CardItem cardBody>
                  <Image
                    source={{ uri: item.img_url }}
                    style={styles.imageStyle}
                    PlaceholderContent={<ActivityIndicator />}
                    resizeMethod='auto'
                    resizeMode='cover'
                  />
                </CardItem>
                <CardItem>
                  <Grid>
                    <Row>
                      <Text style={styles.nameStyle}>{item.name}</Text>
                    </Row>
                    <Row>
                      <Entypo name='location-pin' size={16} color='gray' />
                      <Text style={{ fontSize: 14 }}>{item.location}</Text>
                    </Row>
                  </Grid>
                </CardItem>

                <CardItem bordered footer>
                  <Left>
                    <StarRating
                      disabled={true}
                      emptyStar={'ios-star-outline'}
                      fullStar={'ios-star'}
                      halfStar={'ios-star-half'}
                      iconSet={'Ionicons'}
                      maxStars={1}
                      rating={1}
                      fullStarColor={ColorConstants.secondary}
                      starSize={20}
                      starStyle={styles.rating}
                    />
                    <Text
                      style={{ marginTop: 3, color: ColorConstants.secondary }}
                    >
                      {item.avg_rating}
                    </Text>
                  </Left>
                  <Right>
                    <Button
                      transparent
                      onPress={() => {
                        navigation.navigate('ViewTrail', {
                          id: item._id,
                          name: item.name,
                          showEvents: true,
                        })
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: ColorConstants.primary,
                        }}
                      >
                        2 outings happening
                      </Text>
                      <FontAwesome5
                        name='arrow-right'
                        size={16}
                        color={ColorConstants.primary}
                      />
                    </Button>
                  </Right>
                </CardItem>
              </Card>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  ) : null
  return content
}

const styles = StyleSheet.create({
  imageStyle: {
    width: null,
    flex: 1,
    height: 180,
  },
  nameStyle: {
    fontWeight: '800',
    fontSize: 16,
    flexShrink: 1,
    color: '#404040',
  },
  viewMore: {
    padding: 15,
    justifyContent: 'center',
    marginLeft: 5,
  },
})

export default TrailCards
