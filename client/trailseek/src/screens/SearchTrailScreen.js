import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import { Divider, SearchBar } from 'react-native-elements'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import {
  Container,
  Text,
  Header,
  Title,
  Body,
  Spinner,
  Button,
  Icon,
  Segment,
} from 'native-base'

import ToastAlert from '../components/ToastAlert'
import TrailCard from '../components/TrailCards'
import CONSTANTS from '../util/Constants'
import ColorConstants from '../util/ColorConstants'
import { fetchTrailsByQuery } from '../app/trailSlice'
import { getLocation } from '../app/userSlice'
import Constants from '../util/Constants'

// import TrailFilter from '../components/TrailFilter'

const SearchTrailScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const trailStatus = useSelector((state) => state.trails.status)
  const error = useSelector((state) => state.trails.error)
  const user = useSelector((state) => state.user.profile.name)
  const isAuth = useSelector((state) => state.user.isAuth)
  const locationStatus = useSelector((state) => state.user.userLocation.status)

  const [trails, setTrails] = useState([])
  const [filter, setFilter] = useState({})

  const bestParams = {
    title: 'Best Rated',
  }

  const easyParams = {
    title: 'Easy Trails',
  }

  const nearMe = {
    title: 'Near You',
  }

  const recomended = {
    title: 'Recommended',
  }

  let searchParam = {
    title: 'Search Results',
    query: {
      $text: {
        $search: `${searchTerm}`,
      },
    },
  }

  let content,
    spinner = true

  const getTrailsByQuery = async ({ location = false, query, skip = 0 }) => {
    if (JSON.stringify(query) === '{}') {
      query = filter.query
    } else {
      setFilter((prevState) => ({
        ...prevState,
        query,
      }))
    }
    console.log(query)
    try {
      let results
      let gpsLoc
      if (location) {
        try {
          gpsLoc = await dispatch(getLocation())
          results = await dispatch(
            fetchTrailsByQuery({ query, location, skip })
          )
        } catch (e) {
          ToastAlert(e.message)
        }
      } else {
        results = await dispatch(fetchTrailsByQuery({ query, location, skip }))
      }
      const uResult = unwrapResult(results)
      setTrails(uResult)
    } catch (e) {
      ToastAlert(e.message)
      ToastAlert(error)
    }
  }

  //Initial Trail Fetch
  useEffect(() => {
    if (JSON.stringify(filter) === '{}') {
      setFilter(bestParams)
      setFilter(bestParams)
      getTrailsByQuery({
        query: {
          weighted_rating: { $gt: 4 },
        },
      })
    }
  }, [])

  if (
    trailStatus === CONSTANTS.LOADING ||
    locationStatus === CONSTANTS.LOADING
  ) {
    spinner = true
  } else if (trailStatus === CONSTANTS.FAILED) {
    spinner = false
    ToastAlert(error)
    content = <Text>{error}</Text>
  } else if (
    trailStatus === CONSTANTS.SUCCESS ||
    locationStatus === CONSTANTS.SUCCESS
  ) {
    spinner = false
  }

  const hour = new Date().getHours()
  let welcomePhrase = ''
  if (hour > 5 && hour < 12) {
    welcomePhrase = 'Good Morning'
  } else if (hour < 17) {
    welcomePhrase = 'Good Afternoon'
  } else {
    welcomePhrase = 'Good Evening'
  }

  return (
    <Container
      style={{ backgroundColor: ColorConstants.primary, flex: 1 }}
      contentContainerStyle={{ flex: 1 }}
    >
      <Header transparent androidStatusBarColor='#ffffff00'>
        <Body>
          <Title
            style={{
              color: ColorConstants.White,
              fontWeight: 'bold',
              fontSize: 28,
            }}
          >
            {' '}
            {user ? `Hey, ${user}` : welcomePhrase}
          </Title>
        </Body>
      </Header>

      <SearchBar
        containerStyle={{
          borderRadius: 22,
          marginHorizontal: Constants.POINTS.marginHorizontal,
          marginBottom: 20,
          height: 44,
        }}
        placeholder='Search'
        value={searchTerm}
        onChangeText={(text) => {
          setSearchTerm(text)
        }}
        inputContainerStyle={{ height: 29, marginLeft: 2 }}
        autoCapitalize='none'
        platform='android'
        autoCompleteType='name'
        enablesReturnKeyAutomatically
        onSubmitEditing={() => {
          navigation.navigate('ListTrail', { query: searchParam.query })
        }}
      />

      <View
        style={{
          backgroundColor: ColorConstants.DWhite,
        }}
      >
        <ScrollView
          horizontal
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <Button
            rounded
            color={ColorConstants.primary}
            light={filter.title !== bestParams.title}
            bordered={filter.title !== bestParams.title}
            style={{
              height: 32,
              marginRight: 8,
              backgroundColor:
                filter.title === bestParams.title
                  ? ColorConstants.primary
                  : 'transparent',
            }}
            onPress={async () => {
              setFilter(bestParams)
              setTrails([])
              await getTrailsByQuery({
                query: {
                  weighted_rating: { $gt: 4 },
                },
              })
            }}
          >
            <Text>Best Rated</Text>
          </Button>

          {isAuth ? (
            <Button
              rounded
              light={filter.title !== recomended.title}
              bordered={filter.title !== recomended.title}
              style={{
                height: 32,
                marginRight: 8,
                backgroundColor:
                  filter.title === recomended.title
                    ? ColorConstants.primary
                    : 'transparent',
              }}
              onPress={async () => {
                setFilter(recomended)
                setTrails([])
                await getTrailsByQuery({
                  query: {
                    recommendation: true,
                  },
                })
              }}
            >
              <Text>For you</Text>
            </Button>
          ) : (
            <></>
          )}

          <Button
            rounded
            light={filter.title !== easyParams.title}
            bordered={filter.title !== easyParams.title}
            style={{
              height: 32,
              marginRight: 8,
              backgroundColor:
                filter.title === easyParams.title
                  ? ColorConstants.primary
                  : 'transparent',
            }}
            onPress={async () => {
              setFilter(easyParams)
              setTrails([])
              await getTrailsByQuery({
                query: {
                  difficulty: 'easy',
                  length_km: { $lt: 5 },
                },
              })
            }}
          >
            <Text>Easy Trails</Text>
          </Button>

          <Button
            rounded
            light={filter.title !== nearMe.title}
            bordered={filter.title !== nearMe.title}
            style={{
              height: 32,
              marginRight: 8,
              backgroundColor:
                filter.title === nearMe.title
                  ? ColorConstants.primary
                  : 'transparent',
            }}
            onPress={async () => {
              setFilter(nearMe)
              setTrails([])
              await getTrailsByQuery({
                query: {},
                location: true,
              })
            }}
          >
            <Text>Near You</Text>
          </Button>
        </ScrollView>
      </View>

      <Divider style={{ backgroundColor: ColorConstants.primary }} />

      <View
        style={{
          backgroundColor: ColorConstants.DWhite,
          flex: 1,
          justifyContent: 'center',
        }}
        contentContainerStyle={{ flex: 1 }}
      >
        {trails.length > 0 ? (
          <TrailCard trails={trails} filter={filter} />
        ) : (
          <Spinner color={ColorConstants.primary} />
        )}
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  filterButtons: {
    borderColor: '#a1a1a1',
    borderWidth: 1,
    marginHorizontal: 3,
    height: 44,
    backgroundColor: ColorConstants.secondayLight,
  },
  filterButtonsText: {
    color: ColorConstants.Black2,
  },
})

export default SearchTrailScreen
