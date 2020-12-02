import React, { useState } from 'react'
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native'
// import { Picker } from '@react-native-community/picker'
import { Text, Button, Picker, Spinner, Col } from 'native-base'
import { Divider } from 'react-native-elements'
import { Formik, ErrorMessage } from 'formik'
import { Grid, Row } from 'react-native-easy-grid'
import { useNavigation } from '@react-navigation/native'
import { FontAwesome5 } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'

import moment from 'moment'
import * as Yup from 'yup'
import ColorConstants from '../util/ColorConstants'

const UserForm = ({ onSubmitFunc, userData }) => {
  const navigation = useNavigation()
  const [show, setShow] = useState(false)

  const initialValues = userData || {
    name: '',
    gender: Platform.OS === 'android' ? 'M' : '',
    dob: moment().format('YYYY-MM-DD'),
    email: '',
    password: '',
    confirmPassword: '',
  }

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    dob: Yup.string().required('dd/mm/yyyy'),
    gender: Yup.string().required('Required'),
    email: Yup.string().label('Email').email().required(),
    password: Yup.string()
      .label('Password')
      .required()
      .min(2, 'Seems a bit short')
      .max(10, 'We prefer insecure systems, try a shorter password'),
    confirmPassword: Yup.string()
      .required()
      .label('Confirm password')
      .test('passwords-match', 'Passwords must match', function (value) {
        return this.parent.password === value
      }),
  })

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, formikActions) => {
          formikActions.setSubmitting(false)
          onSubmitFunc(values)
        }}
      >
        {(props) => (
          <Grid>
            <Row>
              <TextInput
                onChangeText={props.handleChange('name')}
                onBlur={props.handleBlur('name')}
                value={props.values.name}
                style={styles.input}
                autoCapitalize='words'
                placeholder='Name'
              />
            </Row>
            <Row>
              {props.touched.name && props.errors.name ? (
                <Text style={styles.error}>{props.errors.name}</Text>
              ) : null}
            </Row>
            {/* <Row>
              <TextInput
                // onChangeText={props.handleChange('email')}
                // onBlur={props.handleBlur('email')}
                keyboardType='number-pad'
                onChangeText={(v) => {
                  if (v.match(/^\d{2}$/) !== null) {
                    this.value = v + '/'
                  } else if (v.match(/^\d{2}\/\d{2}$/) !== null) {
                    this.value = v + '/'
                  }
                }}
                value={props.values.dob}
                style={styles.input}
                placeholder='Date of Birth'
              />
            </Row> */}

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
                    name='calendar-alt'
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
                display='default'
                mode='date'
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

            <Row style={styles.input}>
              <Picker
                mode='dropdown'
                placeholder='Gender'
                iosHeader='Gender'
                selectedValue={props.values.gender}
                textStyle={{ fontSize: 14 }}
                onValueChange={(itemValue, itemIndex) =>
                  props.setFieldValue('gender', itemValue)
                }
              >
                <Picker.Item label='Male' value='M' />
                <Picker.Item label='Female' value='F' />
                <Picker.Item label='Transgender Male' value='TM' />
                <Picker.Item label='Transgender Female' value='TF' />
                <Picker.Item label='Gender Variant/Non-Conforming' value='NC' />
                <Picker.Item label='Other' value='O' />
                <Picker.Item label='Prefer Not to Answer' value='NA' />
              </Picker>
            </Row>
            <Row>
              {props.touched.gender && props.errors.gender ? (
                <Text style={styles.error}>{props.errors.gender}</Text>
              ) : null}
            </Row>

            <Divider style={{ marginVertical: 8 }} />

            <Row>
              <TextInput
                editable={userData ? false : true}
                onChangeText={props.handleChange('email')}
                onBlur={props.handleBlur('email')}
                value={props.values.email}
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType='email-address'
                placeholder='Email'
                style={styles.input}
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

            <Row>
              <TextInput
                onChangeText={props.handleChange('confirmPassword')}
                onBlur={props.handleBlur('confirmPassword')}
                value={props.values.confirmPassword}
                autoCapitalize='none'
                style={styles.input}
                keyboardType='default'
                secureTextEntry={true}
                placeholder='Confirm Password'
              />
            </Row>
            <Row>
              {props.touched.confirmPassword && props.errors.confirmPassword ? (
                <Text style={styles.error}>{props.errors.confirmPassword}</Text>
              ) : null}
            </Row>

            <Button
              rounded
              block
              onPress={props.handleSubmit}
              disabled={props.isSubmitting}
              style={{
                marginTop: 16,
                marginBottom: 16,
                backgroundColor: ColorConstants.primary,
              }}
            >
              {false ? (
                <Spinner color={ColorConstants.White} />
              ) : (
                <Text>Submit</Text>
              )}
            </Button>
            {userData ? null : (
              <Button
                transparent
                block
                onPress={() => navigation.navigate('Signin')}
                style={{
                  marginBottom: 16,
                }}
              >
                <Text uppercase={false}>Already have an account? Sign in</Text>
              </Button>
            )}
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
    borderColor: ColorConstants.darkGray + 20,
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    marginVertical: 5,
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: ColorConstants.DWhite,
  },
  error: {
    color: ColorConstants.red,
    fontSize: 12,
  },
})

export default UserForm
