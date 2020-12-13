import React, { useState } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { Container, Content, Toast } from 'native-base'

import ToastAlert from '../components/ToastAlert'
import { signUp, fetchUserData } from '../app/userSlice'
import UserForm from '../components/UserForm'
import { trailSeekAuth } from '../api/trailSeek'

const SignupScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  // const error = useSelector((state) => state.user.profile.error)
  // const [errorState, setErrorState] = useState('')
  const onSubmitFunc = async (values) => {
    // try {
    trailSeekAuth
      .post('/signup', values)
      .then(async (response) => {
        // console.log(response)
        try {
          const res = await dispatch(signUp(response.data))
          const user = unwrapResult(res)
          const results = await dispatch(fetchUserData())
          const reS = unwrapResult(results)
        } catch (error) {
          console.log(error)
        }
        Toast.show({
          type: 'success',
          text: 'Account Created',
          buttonText: 'Ok',
        })
        navigation.navigate('MainTab')
      })
      .catch((error) => {
        console.log(error.response)
        ToastAlert(
          error.response.data?.errors
            ? error.response.data.errors
                .map((item) => {
                  return `${item.msg} ${item.param ? `on ${item.param}` : ''}.`
                })
                .join(' ')
            : error.status
        )
      })
    // const res = await dispatch(signUp({ inputs: values }))
    // const user = unwrapResult(res)

    //
    // } catch (e) {
    //   console.log(e)
    //   setErrorState(error)
    //   ToastAlert(errorState)
    // }
  }

  return (
    <Container>
      <Content>
        <View
          style={{
            flex: 1,
            paddingTop: 65,
          }}
        >
          <View>
            <Image
              source={require('../images/Standee.png')}
              resizeMode="contain"
              style={styles.image}
            />
          </View>
          <View style={{ flex: 1, padding: 30 }}>
            <UserForm onSubmitFunc={onSubmitFunc} />
          </View>
        </View>
      </Content>
    </Container>
  )
}

export default SignupScreen

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 100,
    alignSelf: 'center',
  },
})
