// https://github.com/jasonmerino/react-native-simple-store/blob/master/__tests__/index-test.js#L31-L64

// ASYNC STORAGE

const mockReturnValues = {
  arrayOne: JSON.stringify(['red', 'blue']),
  objectOne: JSON.stringify({
    isATest: true,
    hasNestedData: {
      ohYeah: "it's true",
    },
  }),
  stringOne: JSON.stringify('testing string'),
}

function mockMultiGetTestData() {
  return [
    ['key1', JSON.stringify({ valor: 1 })],
    ['key2', JSON.stringify({ valor: 2 })],
  ]
}

function mockMultiSaveTestData() {
  return [
    ['key1', { valor: 1 }],
    ['key2', { valor: 2 }],
  ]
}

import AsyncStorage from '@react-native-community/async-storage'
jest.mock('@react-native-community/async-storage', () => ({
  setItem: jest.fn(() => {
    return new Promise((resolve) => {
      resolve(null)
    })
  }),
  multiSet: jest.fn(() => {
    return new Promise((resolve) => {
      resolve(null)
    })
  }),
  getItem: jest.fn((key) => {
    return new Promise((resolve) => {
      if (mockReturnValues[key]) {
        resolve(mockReturnValues[key])
      } else {
        resolve(null)
      }
    })
  }),
  multiGet: jest.fn(() => {
    return new Promise((resolve) => {
      resolve(mockMultiGetTestData())
    })
  }),
  removeItem: jest.fn(() => {
    return new Promise((resolve) => {
      resolve(null)
    })
  }),
  getAllKeys: jest.fn(() => {
    return new Promise((resolve) => {
      resolve(['one', 'two', 'three'])
    })
  }),
  multiRemove: jest.fn(() => ({
    then: jest.fn(),
  })),
}))

// REDUX MOCK

import { useSelector, useDispatch } from 'react-redux'

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}))

// NAVIGATION

const mockedNavigate = jest.fn()

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  }
})
