import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { ListItem, Text } from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { unwrapResult } from '@reduxjs/toolkit'

import ToastAlert from '../components/ToastAlert'
import LoadSpinner from '../components/LoadSpinner'
import { fetchTrailsByQuery } from '../app/trailSlice'
import CONSTANTS from '../util/Constants'
import NoData from '../components/NoData'
import ColorConstants from '../util/ColorConstants'

const ListTrailScreen = ({ route }) => {
  const { query } = route.params
  console.log(query)
  let content
  const limit = 100000
  let spinner = true
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const [filteredTrails, setFilteredTrails] = useState([])

  const trailStatus = useSelector((state) => state.trails.status)
  const error = useSelector((state) => state.trails.error)

  useEffect(() => {
    const getTrailsByQuery = async () => {
      try {
        const results = await dispatch(fetchTrailsByQuery({ query, limit }))
        const uResults = unwrapResult(results)
        setFilteredTrails(uResults)
      } catch (e) {
        ToastAlert(e.message)
        ToastAlert(error)
      }
    }
    getTrailsByQuery()
  }, [])

  if (trailStatus === CONSTANTS.LOADING) {
    spinner = true
  } else if (trailStatus === CONSTANTS.FAILED) {
    spinner = false
    ToastAlert(error)
    content = <Text>{error}</Text>
  } else if (trailStatus === CONSTANTS.SUCCESS) {
    spinner = false
    content = (
      <FlatList
        data={filteredTrails}
        keyExtractor={(item) => {
          return item._id
        }}
        style={{ flex: 1 }}
        ListEmptyComponent={<NoData type={'funny'} />}
        renderItem={({ item }) => {
          return (
            <ListItem
              bottomDivider
              onPress={() => {
                navigation.navigate('ViewTrail', {
                  id: item._id,
                  name: item.name,
                })
              }}
            >
              <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>{item.location}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          )
        }}
      />
    )
  }
  return (
    <View style={{ backgroundColor: ColorConstants.DWhite, flex: 1 }}>
      <LoadSpinner visible={spinner} />
      {content}
    </View>
  )
}

const styles = StyleSheet.create({})

export default ListTrailScreen
