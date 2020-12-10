import React, { useState } from 'react'
import { StyleSheet, Platform, Switch, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { CommonActions } from '@react-navigation/native'
// import NetInfo from "@react-native-community/netinfo";
import { Button, Text, Container, Thumbnail, Content } from 'native-base'
import moment from 'moment'

import { logOut, toggleCovid } from '../app/userSlice'
import ColorConstants from '../util/ColorConstants'

const ViewProfileScreen = ({ navigation }) => {
  const isAuth = useSelector((state) => state.user.isAuth)
  const userData = useSelector((state) => state.user.profile)
  const dispatch = useDispatch()
  const covidToggle = useSelector((state) => state.user.covidToggle)
  let gender = ''

  const userLogout = async () => {
    try {
      const response = await dispatch(logOut())
    } catch (e) {
      console.log(e.message)
    }
  }

  switch (userData.gender) {
    case 'M':
      gender = 'Male'
      break
    case 'F':
      gender = 'Female'
      break
    case 'TM':
      gender = 'Transgender Male'
      break
    case 'TF':
      gender = 'Transgender Female'
      break
    case 'NC':
      gender = 'Gender Variant/Non-Conforming'
      break
    case 'O':
      gender = 'Other'
      break
    case 'NA':
      gender = 'Undisclosed'
      break
    default:
      break
  }

  // const checNet = () => {
  //   // For Android devices
  //   if (Platform.OS === "android") {
  //     NetInfo.fetch().then((state) => {
  //       if (!state.isConnected) {
  //         ToastAlert("Please make sure your internet is connected.");
  //       } else {
  //         ToastAlert("Internet is connected.");
  //       }
  //     });
  //   } else {
  //     // // For iOS devices
  //     // NetInfo.isConnected.addEventListener(
  //     //   "connectionChange",
  //     //   this.handleFirstConnectivityChange
  //     // );
  //     console.log("in iphone");
  //   }
  // };

  return (
    <Container style={{ backgroundColor: ColorConstants.DWhite }}>
      <Content>
        <View
          style={{
            flex: 1,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.0,
            backgroundColor: ColorConstants.DWhite,
            elevation: 24,
            margin: 50,
            padding: 20,
          }}
        >
          <Thumbnail
            style={{
              borderColor: ColorConstants.DGreen,
              borderWidth: 3,
              alignSelf: 'center',
            }}
            large
            source={{
              uri: userData.profileImage
                ? userData.profileImage
                : `https://eu.ui-avatars.com/api/?name=${userData.name}`,
            }}
          />
          <Text
            style={{
              color: ColorConstants.Black,
              fontSize: 40,
              fontWeight: 'bold',
              alignSelf: 'center',
            }}
          >
            {userData.name}
          </Text>
          {/* <Grid> */}
          <View style={{ flex: 1 }}>
            <View style={styles.infoContainers}>
              <Text style={styles.textInfoLabel}>Email</Text>
              <Text
                accessible={true}
                accessibilityLabel="EmailProperty"
                style={styles.textInfo}
              >
                {userData.email}
              </Text>
            </View>
            <View style={styles.infoContainers}>
              <Text style={styles.textInfoLabel}>Gender</Text>
              <Text style={styles.textInfo}>{gender}</Text>
            </View>
            <View style={styles.infoContainers}>
              <Text style={styles.textInfoLabel}>Date of Birth</Text>

              <Text style={styles.textInfo}>
                {moment(userData.dob).format('MM/DD/YYYY')}
              </Text>
            </View>
            <View
              style={[
                styles.infoContainers,
                {
                  alignItems: 'center',
                },
              ]}
            >
              <Text style={[styles.textInfoLabel, { fontSize: 22 }]}>
                Toggle Covid Information
              </Text>
              <Switch
                value={covidToggle}
                onValueChange={() => dispatch(toggleCovid())}
              />
            </View>
          </View>
          {/* </Grid> */}
          {isAuth ? (
            <Button
              accessible={true}
              accessibilityLabel="LogoutButton"
              danger
              block
              style={{ marginTop: 30 }}
              onPress={async () => {
                const res = await userLogout()
                // console.log(res)
                await navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Authentication' }],
                  })
                )
              }}
            >
              <Text style={{ fontSize: 16, color: 'white' }}>Logout</Text>
            </Button>
          ) : null}
        </View>
      </Content>
    </Container>
  )
}

const styles = StyleSheet.create({
  textInfo: {
    color: ColorConstants.Black2,
    fontSize: 20,
  },
  textInfoLabel: {
    fontSize: 14,
    color: ColorConstants.darkGray,
  },
  infoContainers: {
    flex: 1,
  },
})

export default ViewProfileScreen
