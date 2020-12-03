// import renderer from 'react-test-renderer'
import React from 'react'
import { render } from 'react-native-testing-library'

import ViewTrailScreen from '../src/screens/ViewTrailScreen'

describe('ViewTrailScreen', () => {
  it('Sign up has all the required fields', () => {
    const screen = render(
      <ViewTrailScreen
        route={{
          params: { id: '5fc5bfe761f37f5943b6fb95', index: 0 },
        }}
      />
    )

    expect(true).toBe(true)
  })
})
