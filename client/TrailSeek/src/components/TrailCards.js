import React from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native'

import { Entypo } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons'

import { useNavigation } from '@react-navigation/native'
import StarRating from 'react-native-star-rating'
import { Row, Grid } from 'react-native-easy-grid'
import { Button, Text, Card, CardItem, Left, Right } from 'native-base'

import ColorConstants from '../util/ColorConstants'
import NoData from './NoData'
import Constants from '../util/Constants'

const TrailCards = ({ trails, filter }) => {
  const navigation = useNavigation()

  let content = trails ? (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{
          paddingTop: 20,
          paddingBottom: 20,
          paddingHorizontal: Constants.POINTS.marginHorizontal,
          flex: 1,
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
                navigation.navigate('ListTrail', { query: filter })
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
                    resizeMethod="auto"
                    resizeMode="cover"
                  />
                </CardItem>
                <CardItem>
                  <Grid>
                    <Row>
                      <Text style={styles.nameStyle}>{item.name}</Text>
                    </Row>
                    <Row>
                      <Entypo name="location-pin" size={16} color="gray" />
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
                      style={{
                        marginTop: 3,
                        color: ColorConstants.secondary,
                        fontSize: item.weighted_rating > 0 ? 16 : 13,
                      }}
                    >
                      {item.weighted_rating > 0
                        ? item.weighted_rating.toFixed(1)
                        : 'No\nrating'}
                    </Text>
                  </Left>

                  <Right>
                    <Button transparent>
                      <FontAwesome5
                        name="comments"
                        size={18}
                        color={ColorConstants.darkGray}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          color: ColorConstants.darkGray,
                        }}
                      >
                        {item.comment_count > 0
                          ? `${item.comment_count}\ncomment${
                              item.comment_count > 1 ? 's' : ''
                            }`
                          : 'No\ncomments'}
                      </Text>
                    </Button>
                  </Right>

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
                      <FontAwesome5
                        name="hiking"
                        size={18}
                        color={ColorConstants.primary}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          color: ColorConstants.primary,
                        }}
                      >
                        {item.outing_count > 0
                          ? `${item.outing_count}\nevent${
                              item.outing_count > 1 ? 's' : ''
                            }`
                          : 'No\nevents'}
                      </Text>
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
