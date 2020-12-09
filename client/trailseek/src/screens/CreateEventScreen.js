import React from 'react'
import { StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { Toast } from 'native-base'
import { unwrapResult } from '@reduxjs/toolkit'

import { postEvents } from '../app/eventSlice'
import EventForms from '../components/EventForm'

const CreateEventScreen = ({ route, navigation }) => {
  const { trailName, trailID } = route.params
  const dispatch = useDispatch()
  const onSubmitFunc = async (values) => {
    try {
      const response = await dispatch(postEvents({ inputs: values, trailID }))
      unwrapResult(response)
      Toast.show({ text: 'Event Created', type: 'success', buttonText: 'Ok' })
      navigation.goBack()
    } catch (e) {
      Toast.show({
        text: `Event Creation Error${e.message}`,
        type: 'danger',
        buttonText: 'Ok',
      })
      // ToastAlert(e.message)
    }
  }

  return <EventForms trailName={trailName} onSubmitFunc={onSubmitFunc} />
}
const styles = StyleSheet.create({})

export default CreateEventScreen
