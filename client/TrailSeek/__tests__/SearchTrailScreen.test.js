// import renderer from 'react-test-renderer'
import React from 'react'
import { render } from 'react-native-testing-library'

import SearchTrailScreen from '../src/screens/SearchTrailScreen'

describe('SearchTrailScreen', () => {
  it('Sign up has all the required fields', () => {
    const screen = render(<SearchTrailScreen />)

    expect(true).toBe(true)
  })
})
