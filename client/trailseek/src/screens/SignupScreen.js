import React from 'react'
import { View, StyleSheet, Image, ImageBackground } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { Container, Content, Toast } from 'native-base'

import ToastAlert from '../components/ToastAlert'
import { signUp } from '../app/userSlice'
import ColorConstants from '../util/ColorConstants'
import UserForm from '../components/UserForm'

const SignupScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const error = useSelector((state) => state.user.profile.error)
  const onSubmitFunc = async (values) => {
    try {
      const res = await dispatch(signUp({ inputs: values }))
      const user = unwrapResult(res)
      Toast.show({
        type: 'success',
        text: 'Account Created',
        buttonText: 'Ok',
      })
      navigation.navigate('Signin')
    } catch (e) {
      ToastAlert(error)
    }
  }

  return (
    <Container>
      <Content>
        <View
          style={{
            flex: 1,
            paddingTop: 40,
          }}
        >
          <View>
            <Image
              source={require('../images/tslogov2.2grey.png')}
              resizeMode='contain'
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
