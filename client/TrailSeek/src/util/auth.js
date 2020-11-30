import AsyncStorage from '@react-native-community/async-storage'

const getToken = async () => {
  let token
  try {
    token = await AsyncStorage.getItem('@token')
  } catch (error) {
    console.log(error.response)
  }
  return token
}

const isLoggedIn = async () => {
  const token = await getToken()
  return !!token
}

module.exports = { getToken, isLoggedIn }
