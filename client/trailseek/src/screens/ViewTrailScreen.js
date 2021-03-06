import React, { useEffect, useState } from 'react'
import { StyleSheet, Dimensions, View } from 'react-native'
import { Tile } from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { Container, Tab, Tabs, Header, Spinner, Toast } from 'native-base'

import {
  fetchTrailsByID,
  fetchCovidData,
  fetchWeatherData,
} from '../app/trailSlice'
import ToastAlert from '../components/ToastAlert'
import CONSTANTS from '../util/Constants'
import DetailsTab from '../components/DetailsTab'
import MapsTab from '../components/MapsTab'
import EventsTab from '../components/EventsTab'
import ColorConstants from '../util/ColorConstants'
import NoData from '../components/NoData'
import CommentsTabs from '../components/CommentsTab'

const ViewTrailScreen = ({ route }) => {
  const { id, index } = route.params
  const [trailData, setTrailData] = useState({})
  const [covData, setCovData] = useState([])
  const [weathData, setWeathData] = useState({})

  let spinner = true
  let content
  const dispatch = useDispatch()
  const covFlag = useSelector((state) => state.user.covidToggle)
  const trailStatus = useSelector((state) => state.trails.status)
  const error = useSelector((state) => state.trails.error)
  const fields =
    'name,weighted_rating,location,path,bbox,img_url,difficulty,length_km,description,activity_types,estimate_time_min,start,recommended'

  const getTrailDetail = async () => {
    try {
      const results = await dispatch(fetchTrailsByID({ fields, id, covFlag }))
      const uResults = unwrapResult(results)
      setTrailData(uResults)
    } catch (e) {
      ToastAlert(error)
    }
  }

  const getCovidData = async () => {
    const latitude = trailData?.start?.coordinates[0]
    const longitude = trailData?.start?.coordinates[1]
    try {
      const results = await dispatch(fetchCovidData({ latitude, longitude }))
      const uResult = unwrapResult(results)
      setCovData(uResult)
    } catch (error) {
      Toast.show({ type: 'danger', text: 'Covid API Error' })
      console.log(error.message)
    }
  }

  const getWeatherData = async () => {
    const latitude = trailData?.start?.coordinates[0]
    const longitude = trailData?.start?.coordinates[1]
    try {
      const results = await dispatch(fetchWeatherData({ latitude, longitude }))
      const uResult = unwrapResult(results)
      setWeathData(uResult)
    } catch (error) {
      Toast.show({ type: 'danger', text: 'Weather API Error' })
      console.log(error.message)
    }
  }

  useEffect(() => {
    getTrailDetail()
  }, [])

  useEffect(() => {
    JSON.stringify(trailData) !== '{}' && covFlag ? getCovidData() : null
  }, [covFlag, trailData])

  useEffect(() => {
    JSON.stringify(trailData) !== '{}' ? getWeatherData() : null
  }, [trailData])

  if (!(JSON.stringify(trailData) === '{}')) {
    spinner = false
    content = (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Tile
          featured
          imageSrc={{ uri: trailData.img_url }}
          // title={trailData.name}
          titleStyle={styles.tilettlstyle}
          activeOpacity={1}
          height={280}
        />

        <Header
          hasTabs
          style={{ height: 0 }}
          androidStatusBarColor="#ffffff00"
        />

        <Tabs
          initialPage={index || 0}
          locked={true}
          activeTextStyle={{ color: ColorConstants.secondary }}
          tabBarUnderlineStyle={{ backgroundColor: ColorConstants.White }}
        >
          <Tab
            heading="Details"
            tabStyle={{ backgroundColor: ColorConstants.primary }}
            activeTabStyle={{ backgroundColor: ColorConstants.primary }}
            textStyle={{ color: ColorConstants.White }}
            activeTextStyle={{ color: ColorConstants.White }}
          >
            <DetailsTab
              trailData={trailData}
              covData={covData}
              weatherData={weathData}
            />
          </Tab>
          <Tab
            heading="Comments"
            tabStyle={{ backgroundColor: ColorConstants.primary }}
            activeTabStyle={{ backgroundColor: ColorConstants.primary }}
            textStyle={{ color: ColorConstants.White }}
            activeTextStyle={{ color: ColorConstants.White }}
          >
            <CommentsTabs trailData={trailData} />
          </Tab>
          <Tab
            heading="Events"
            tabStyle={{ backgroundColor: ColorConstants.primary }}
            activeTabStyle={{ backgroundColor: ColorConstants.primary }}
            textStyle={{ color: ColorConstants.White }}
            activeTextStyle={{ color: ColorConstants.White }}
          >
            <EventsTab trailData={trailData} />
          </Tab>
          <Tab
            heading="Maps"
            tabStyle={{ backgroundColor: ColorConstants.primary }}
            activeTabStyle={{ backgroundColor: ColorConstants.primary }}
            textStyle={{ color: ColorConstants.White }}
            activeTextStyle={{ color: ColorConstants.White }}
          >
            <MapsTab trailData={trailData} />
          </Tab>
        </Tabs>
      </View>
    )
  } else if (trailStatus === CONSTANTS.LOADING) {
    spinner = true
    content = <Spinner color={ColorConstants.primary} />
  } else if (trailStatus === CONSTANTS.FAILED) {
    spinner = false
    ToastAlert(error)
    content = error
  } else if (
    trailStatus === CONSTANTS.SUCCESS &&
    JSON.stringify(trailData) === '{}'
  ) {
    content = <NoData />
  }

  return (
    <Container style={{ flex: 1, justifyContent: 'center' }}>
      {content}
    </Container>
  )
}

const styles = StyleSheet.create({
  imageStyle: {
    width: Dimensions.get('window').width,
    height: 175,
    marginBottom: 5,
  },
  tilettlstyle: {
    fontWeight: '600',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
})

export default ViewTrailScreen
