import React, { useState, useRef } from 'react'
import { StyleSheet, Modal, Dimensions } from 'react-native'
import { View, Text, Button, Spinner, Toast } from 'native-base'
import { Modalize } from 'react-native-modalize'
import ColorConstants from '../util/ColorConstants'
import StarRating from 'react-native-star-rating'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Portal } from 'react-native-portalize'
import trailSeek from '../api/trailSeek'

const RatingModal = ({ trailData }) => {
  const modelizeRef = useRef(null)
  const [starRating, setStarRating] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hasRated, setHasRated] = useState(false)

  const rateTrail = () => {
    if (starRating === 0) {
      Toast.show({ text: 'Please rate before submitting' })
      return
    }
    setIsLoading(true)
    trailSeek
      .post(`/trails/${trailData._id}/rate`, { rating: starRating })
      .then((response) => {
        const weighted_rating = response.data.weighted_rating
        console.log(weighted_rating)
        setHasRated(true)
        setIsLoading(false)
        modelizeRef.current?.close()
      })
      .catch((err) => {
        setIsLoading(false)
        Toast.show({ text: err.response.data.errors[0].msg || err.message })
      })
  }

  const buttonContent = !isLoading ? (
    hasRated ? (
      <Text>Thank You</Text>
    ) : (
      <Text>Submit</Text>
    )
  ) : (
    <Spinner style={{ marginHorizontal: 25 }} />
  )

  return (
    <View>
      <TouchableOpacity
        style={{ flex: 1, flexDirection: 'row' }}
        onPress={() => modelizeRef.current?.open()}
      >
        <StarRating
          disabled={false}
          emptyStar={'ios-star-outline'}
          fullStar={'ios-star'}
          halfStar={'ios-star-half'}
          iconSet={'Ionicons'}
          maxStars={1}
          rating={1}
          fullStarColor={ColorConstants.secondary}
          starSize={30}
        />
        <Text
          style={{
            marginLeft: 12,
            marginTop: 4,
            color: ColorConstants.secondary,
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          {trailData.avg_rating}
        </Text>
      </TouchableOpacity>

      <Portal>
        <Modalize ref={modelizeRef} snapPoint={220}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              //   justifyContent: 'center',
              //   backgroundColor: ColorConstants.LGreen + '90',
              marginTop: 20,
            }}
          >
            <Text
              style={{
                color: ColorConstants.darkGray,
                fontSize: 14,
                marginBottom: 20,
                // fontWeight: 'bold',
              }}
            >
              {starRating > 0
                ? `${starRating} stars out of 5`
                : 'Your rating improves our recommendation to you'}
            </Text>

            <StarRating
              disabled={hasRated}
              emptyStar={'ios-star-outline'}
              fullStar={'ios-star'}
              halfStar={'ios-star-half'}
              iconSet={'Ionicons'}
              maxStars={5}
              rating={starRating}
              fullStarColor={ColorConstants.secondary}
              starSize={54}
              selectedStar={(rating) => setStarRating(rating)}
            />

            <Button
              style={{
                backgroundColor: ColorConstants.LGreen,
                alignSelf: 'center',
                marginTop: 20,
              }}
              onPress={() => rateTrail()}
              disabled={isLoading || hasRated}
            >
              {buttonContent}
            </Button>
          </View>
        </Modalize>
      </Portal>
    </View>
  )
}

const styles = StyleSheet.create({})

export default RatingModal
