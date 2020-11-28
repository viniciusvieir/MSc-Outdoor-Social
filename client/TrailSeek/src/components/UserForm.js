import React, { useState } from 'react'
import { TextInput, View, StyleSheet, TouchableOpacity } from 'react-native'
import { Picker } from '@react-native-community/picker'
import { Text, Button } from 'native-base'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import { Formik, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Grid, Col, Row } from 'react-native-easy-grid'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import ColorConstants from '../util/ColorConstants'

const UserForm = ({ onSubmitFunc, userData }) => {
  const navigation = useNavigation()
  const [show, setShow] = useState(false)
  return (
    <View style={{ flex: 1, padding: 30 }}>
      <Formik
        initialValues={
          userData
            ? userData
            : {
                name: '',
                gender: 'M',
                dob: moment().format('YYYY-MM-DD'),
                email: '',
                password: '',
                confirmPassword: '',
              }
        }
        validationSchema={Yup.object({
          name: Yup.string().required('Required'),
          gender: Yup.string().required('Required'),
          dob: Yup.date().required('Required'),
          email: Yup.string().label('Email').email().required(),
          password: Yup.string()
            .label('Password')
            .required()
            .min(2, 'Seems a bit short...')
            .max(10, 'We prefer insecure system, try a shorter password.'),
          confirmPassword: Yup.string()
            .required()
            .label('Confirm password')
            .test('passwords-match', 'Passwords must match', function (value) {
              return this.parent.password === value
            }),
        })}
        onSubmit={async (values, formikActions) => {
          formikActions.setSubmitting(false)
          onSubmitFunc(values)
        }}
      >
        {(props) => (
          <Grid>
            <Row>
              <Text>Name :</Text>
            </Row>
            <Row>
              <TextInput
                onChangeText={props.handleChange('name')}
                onBlur={props.handleBlur('name')}
                value={props.values.title}
                autoFocus
                style={styles.input}
                autoCapitalize="words"
                placeholderTextColor={ColorConstants.Black}
              />
            </Row>
            <Row>
              {props.touched.name && props.errors.name ? (
                <Text style={styles.error}>{props.errors.name}</Text>
              ) : null}
            </Row>
            <Row>
              <Text style={{ color: ColorConstants.Black }}>
                Date of Birth :{' '}
              </Text>
            </Row>
            <Row>
              <TouchableOpacity
                onPress={() => {
                  setShow(true)
                }}
                style={[styles.input, { flexDirection: 'row' }]}
              >
                <Col style={{ justifyContent: 'center' }}>
                  <Text>{moment(props.values.dob).format('YYYY-MM-DD')}</Text>
                </Col>
                <Col
                  style={{
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}
                >
                  <FontAwesome5
                    name="calendar-alt"
                    size={24}
                    color={ColorConstants.darkGray}
                  />
                </Col>
              </TouchableOpacity>
            </Row>
            <Row>
              {props.touched.dob && props.errors.dob ? (
                <Text style={styles.error}>{props.errors.dob}</Text>
              ) : null}
            </Row>
            {show && (
              <DateTimePicker
                display="default"
                mode="date"
                onChange={(event, selectedDate) => {
                  setShow(Platform.OS === 'ios')
                  props.setFieldValue(
                    'dob',
                    moment(selectedDate).format('YYYY-MM-DD')
                  )
                }}
                maximumDate={moment().toDate()}
                value={moment(props.values.dob).toDate()}
              />
            )}
            <Row>
              <Text style={{ color: ColorConstants.Black }}>Gender :</Text>
            </Row>
            <Row>
              <Picker
                selectedValue={props.values.gender}
                style={styles.input}
                onValueChange={(itemValue, itemIndex) =>
                  props.setFieldValue('gender', itemValue)
                }
              >
                <Picker.Item label="Male" value="M" />
                <Picker.Item label="Female" value="F" />
              </Picker>
            </Row>
            <Row>
              {props.touched.gender && props.errors.gender ? (
                <Text style={styles.error}>{props.errors.gender}</Text>
              ) : null}
            </Row>
            <Row>
              <Text style={{ color: ColorConstants.Black }}>Email :</Text>
            </Row>
            <Row>
              <TextInput
                editable={userData ? false : true}
                onChangeText={props.handleChange('email')}
                onBlur={props.handleBlur('email')}
                value={props.values.email}
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor={ColorConstants.Black}
              />
            </Row>
            <Row>
              {props.touched.email && props.errors.email ? (
                <Text style={styles.error}>{props.errors.email}</Text>
              ) : null}
            </Row>

            <Row>
              <Text style={{ color: ColorConstants.Black }}>Password :</Text>
            </Row>
            <Row>
              <TextInput
                onChangeText={props.handleChange('password')}
                onBlur={props.handleBlur('password')}
                value={props.values.password}
                autoCapitalize="none"
                style={styles.input}
                keyboardType="default"
                secureTextEntry={true}
                placeholderTextColor={ColorConstants.Black}
              />
            </Row>
            <Row>
              {props.touched.password && props.errors.password ? (
                <Text style={styles.error}>{props.errors.password}</Text>
              ) : null}
            </Row>
            <Row>
              <Text style={{ color: ColorConstants.Black }}>
                Confirm Password :
              </Text>
            </Row>
            <Row>
              <TextInput
                onChangeText={props.handleChange('confirmPassword')}
                onBlur={props.handleBlur('confirmPassword')}
                value={props.values.confirmPassword}
                autoCapitalize="none"
                style={styles.input}
                keyboardType="default"
                secureTextEntry={true}
                placeholderTextColor={ColorConstants.Black}
              />
            </Row>
            <Row>
              {props.touched.confirmPassword && props.errors.confirmPassword ? (
                <Text style={styles.error}>{props.errors.confirmPassword}</Text>
              ) : null}
            </Row>
            <Button
              onPress={props.handleSubmit}
              disabled={props.isSubmitting}
              block
              style={{
                marginTop: 16,
                marginBottom: 16,
                backgroundColor: ColorConstants.Yellow,
              }}
            >
              <Text>Submit</Text>
            </Button>
            {userData ? null : (
              <Button
                block
                onPress={() => navigation.navigate('Signin')}
                style={{
                  backgroundColor: ColorConstants.DGreen,
                  marginBottom: 16,
                }}
              >
                <Text>Login</Text>
              </Button>
            )}
            {/* <Button
                      onPress={props.handleReset}
                      disabled={props.isSubmitting}
                      danger
                      block
                      style={{
                        marginTop: 16,
                      }}
                    >
                      <Text>Reset</Text>
                    </Button> */}
          </Grid>
        )}
      </Formik>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 100,
    alignSelf: 'center',
  },

  button: {
    marginBottom: 10,
    backgroundColor: ColorConstants.Yellow,
  },
  input: {
    borderColor: ColorConstants.darkGray + 60,
    borderWidth: 1,
    borderRadius: 5,
    height: 50,
    marginVertical: 5,
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: ColorConstants.DWhite,
  },
  error: {
    color: 'red',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
})

export default UserForm
