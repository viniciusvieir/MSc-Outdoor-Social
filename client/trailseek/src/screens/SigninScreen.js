import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  ImageBackground,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Formik, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Grid, Row } from 'react-native-easy-grid'
import { Container, Button, Text, Content, Spinner } from 'native-base'

import { fetchUserData, signIn } from '../app/userSlice'
import ToastAlert from '../components/ToastAlert'
import ColorConstants from '../util/ColorConstants'
import { unwrapResult } from '@reduxjs/toolkit'

const SigninScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const error = useSelector((state) => state.user.profile.error)
  const isAuth = useSelector((state) => state.user.isAuth)

  return (
    <Container>
      <Content
        style={{
          paddingTop: 60,
          flex: 1,
        }}
      >
        <View style={{ flex: 1 }}>
          <Image
            source={require('../images/tslogov2.2grey.png')}
            resizeMode='contain'
            style={styles.image}
          />
        </View>
        <View style={{ flex: 1, padding: 40 }}>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={Yup.object({
              email: Yup.string().label('Email').email().required(),
              password: Yup.string().label('Password').required(),
            })}
            onSubmit={async (values, formikActions) => {
              try {
                const res = await dispatch(signIn({ inputs: values }))
                const user = unwrapResult(res)
                // console.log(user.token);
                if (user.token) {
                  const results = await dispatch(fetchUserData())
                  const reS = unwrapResult(results)
                  navigation.navigate('MainTab')
                }
              } catch (e) {
                ToastAlert(error)
              }
            }}
          >
            {(props) => (
              <Grid>
                <Row>
                  <TextInput
                    autoFocus
                    autoCapitalize='none'
                    onChangeText={props.handleChange('email')}
                    onBlur={props.handleBlur('email')}
                    value={props.values.email}
                    autoCapitalize='none'
                    style={styles.input}
                    placeholder='Email'
                  />
                </Row>
                <Row>
                  {props.touched.email && props.errors.email ? (
                    <Text style={styles.error}>{props.errors.email}</Text>
                  ) : null}
                </Row>

                <Row>
                  <TextInput
                    onChangeText={props.handleChange('password')}
                    onBlur={props.handleBlur('password')}
                    value={props.values.password}
                    autoCapitalize='none'
                    style={styles.input}
                    keyboardType='default'
                    secureTextEntry={true}
                    placeholder='Password'
                  />
                </Row>
                <Row>
                  {props.touched.password && props.errors.password ? (
                    <Text style={styles.error}>{props.errors.password}</Text>
                  ) : null}
                </Row>

                <Button
                  rounded
                  block
                  onPress={props.handleSubmit}
                  disabled={props.isSubmitting}
                  style={{
                    marginTop: 20,
                    marginBottom: 20,
                    backgroundColor: ColorConstants.primary,
                  }}
                >
                  {props.isSubmitting ? (
                    <Spinner color={ColorConstants.White} />
                  ) : (
                    <Text uppercase={false}>Login</Text>
                  )}
                </Button>

                <Button
                  transparent
                  block
                  onPress={() => navigation.navigate('Signup')}
                  style={{
                    marginBottom: 16,
                  }}
                >
                  <Text uppercase={false}>
                    Don't have an account? Create one
                  </Text>
                </Button>
              </Grid>
            )}
          </Formik>
        </View>
        <Button
          rounded
          bordered
          onPress={() => navigation.navigate('MainTab')}
          style={{
            // backgroundColor: ColorConstants.Yellow,
            // marginBottom: 10,
            // marginRight: 40,
            alignSelf: 'center',
          }}
        >
          <Text uppercase={false}>Skip</Text>
        </Button>
      </Content>
    </Container>
  )
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 120,
    alignSelf: 'center',
  },
  error: {
    color: ColorConstants.red,
    fontSize: 12,
  },
  input: {
    flex: 1,
    borderColor: ColorConstants.darkGray + 20,
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    marginVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: ColorConstants.DWhite,
  },
})

export default SigninScreen
