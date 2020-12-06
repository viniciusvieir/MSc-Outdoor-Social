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
  // Icon,
  // Segment,
} from 'native-base'
import * as Linking from 'expo-linking'

import ToastAlert from '../components/ToastAlert'
import TrailCard from '../components/TrailCards'
import CONSTANTS from '../util/Constants'
import ColorConstants from '../util/ColorConstants'
import { fetchTrailsByQuery } from '../app/trailSlice'
import { getLocation } from '../app/userSlice'
import Constants from '../util/Constants'
import EmptyStateView from '../components/EmptyStateView'

const SearchTrailScreen = ({ navigation, route }) => {
  let prevQueryParams = {}
  const dispatch = useDispatch()
  const trailStatus = useSelector((state) => state.trails.status)
  const error = useSelector((state) => state.trails.error)
  const user = useSelector((state) => state.user.profile.name)
  const isAuth = useSelector((state) => state.user.isAuth)
  const locationStatus = useSelector((state) => state.user.userLocation.status)

  const [trails, setTrails] = useState([])
  const [filter, setFilter] = useState({})
  const [searchTerm, setSearchTerm] = useState('')

  const recomended = {
    title: 'Recommended',
    action: () =>
      getTrailsByQuery({
        query: {
          recommendation: true,
        },
      }),
  }

  const nearMe = {
    title: 'Near You',
    action: () =>
      getTrailsByQuery({
        query: {},
        location: true,
      }),
  }

  const bestParams = {
    title: 'Best Rated',
    action: () =>
      getTrailsByQuery({
        query: {
          weighted_rating: { $gt: 4 },
        },
      }),
  }

  const easyParams = {
    title: 'Easy Trails',
    action: () =>
      getTrailsByQuery({
        query: {
          difficulty: 'easy',
          length_km: { $lt: 5 },
        },
      }),
  }

  const wholeDayParams = {
    title: 'Whole Day',
    action: () =>
      getTrailsByQuery({
        query: {
          estimate_time_min: { $gte: 360 },
          estimate_time_min: { $lte: 600 },
        },
      }),
  }

  const searchParam = {
    title: 'Search',
    action: () =>
      getTrailsByQuery({
        query: {
          $text: {
            $search: `${searchTerm}`,
          },
        },
      }),
  }

  // let searchParam = {
  //   title: 'Search Results',
  //   query: {
  //     $text: {
  //       $search: `${searchTerm}`,
  //     },
  //   },
  // }

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
      let results, gpsLoc
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

  const urlRedirect = (url) => {
    if (!url) return
    // parse and redirect to new url
    let { path, queryParams } = Linking.parse(url)

    console.log(
      `Linked to app with path: ${path} and data: ${JSON.stringify(
        queryParams
      )}`
    )
    // console.log(queryParams)
    // if (!prevQueryParams.eventID === queryParams.eventID) {
    navigation.push(path, queryParams)
    // }
    // prevQueryParams = queryParams
  }

  useEffect(() => {
    Linking.getInitialURL().then(urlRedirect)
    Linking.addEventListener('url', ({ url }) => {
      urlRedirect(url)
    })
    const unsubscribe = () => {
      Linking.removeEventListener('url', ({ url }) => {
        urlRedirect(url)
      })
    }
    return unsubscribe
  }, [])

  //Initial Trail Fetch
  useEffect(() => {
    if (JSON.stringify(filter) === '{}') {
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
      <Header transparent androidStatusBarColor="#ffffff00">
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
        placeholder="Search"
        value={searchTerm}
        onChangeText={(text) => {
          setSearchTerm(text)
        }}
        inputContainerStyle={{ height: 29, marginLeft: 2 }}
        autoCapitalize="none"
        platform="android"
        autoCompleteType="name"
        enablesReturnKeyAutomatically
        onSubmitEditing={() => {
          setFilter(searchParam)
          setTrails([])
          getTrailsByQuery({
            query: {
              $text: {
                $search: `${searchTerm}`,
              },
            },
          })
          // navigation.navigate('ListTrail', { query: searchParam.query })
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
              onPress={() => {
                setFilter(recomended)
                setSearchTerm('')
                setTrails([])
                getTrailsByQuery({
                  query: {
                    recommendation: true,
                  },
                })
                // filter.action()
              }}
            >
              <Text uppercase={false}>For you</Text>
            </Button>
          ) : (
            <></>
          )}

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
            onPress={() => {
              setFilter(nearMe)
              setSearchTerm('')
              setTrails([])
              getTrailsByQuery({
                query: {},
                location: true,
              })
              // filter.action()
            }}
          >
            <Text uppercase={false}>{nearMe.title}</Text>
          </Button>

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
            onPress={() => {
              setFilter(bestParams)
              setSearchTerm('')
              setTrails([])
              getTrailsByQuery({
                query: {
                  weighted_rating: { $gt: 4 },
                },
              })
              // filter.action()
            }}
          >
            <Text uppercase={false}>{bestParams.title}</Text>
          </Button>

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
            onPress={() => {
              setFilter(easyParams)
              setSearchTerm('')
              setTrails([])
              getTrailsByQuery({
                query: {
                  difficulty: 'easy',
                  length_km: { $lt: 5 },
                },
              })
              // filter.action()
            }}
          >
            <Text uppercase={false}>{easyParams.title}</Text>
          </Button>

          <Button
            rounded
            light={filter.title !== wholeDayParams.title}
            bordered={filter.title !== wholeDayParams.title}
            style={{
              height: 32,
              marginRight: 8,
              backgroundColor:
                filter.title === wholeDayParams.title
                  ? ColorConstants.primary
                  : 'transparent',
            }}
            onPress={() => {
              setFilter(wholeDayParams)
              setSearchTerm('')
              setTrails([])
              getTrailsByQuery({
                query: {
                  estimate_time_min: { $gte: 360 },
                  estimate_time_min: { $lte: 600 },
                },
              })
              // filter.action()
            }}
          >
            <Text uppercase={false}>{wholeDayParams.title}</Text>
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
        ) : trails.length == 0 && !spinner ? (
          <EmptyStateView
            icon="exclamation-triangle"
            title="No Trails"
            description="Sorry! Couldn't find any trails matching your query."
          />
        ) : (
          <Spinner color={ColorConstants.primary} animating={spinner} />
        )}
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({})

export default SearchTrailScreen
