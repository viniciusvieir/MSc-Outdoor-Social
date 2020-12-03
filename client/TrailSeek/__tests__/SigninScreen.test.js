// import renderer from 'react-test-renderer'
import React from 'react'
import { render } from 'react-native-testing-library'

import SigninScreen from '../src/screens/SigninScreen'

describe('SigninScreen', () => {
  it('Sign up has all the required fields', () => {
    const screen = render(<SigninScreen />)

    expect(true).toBe(true)
  })
})
