// import renderer from 'react-test-renderer'
import React from 'react'
import { render, fireEvent, waitFor } from 'react-native-testing-library'
import faker from 'faker'

import SignupScreen from '../src/screens/SignupScreen'

const setup = () => {
  const screen = render(<SignupScreen />)
  return { screen }
}

describe('SignupScreen', () => {
  it('Checks if sign up has all required fields', () => {
    const { screen } = setup()

    const nameTextInput = screen.getByPlaceholder('Name')
    // const genderPicker = screen.getByPlaceholder('Gender')
    const emailTextInput = screen.getByPlaceholder('Email')
    const passwordTextInput = screen.getByPlaceholder('Password')
    const confirmPasswordTextInput = screen.getByPlaceholder('Confirm Password')

    expect(nameTextInput).not.toBeNull()
    // expect(genderPicker).not.toBeNull()
    expect(emailTextInput).not.toBeNull()
    expect(passwordTextInput).not.toBeNull()
    expect(confirmPasswordTextInput).not.toBeNull()
  })

  it('Fill required sign up fields', async () => {
    const name = faker.name.findName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    const { screen } = setup()

    const nameTextInput = screen.getByPlaceholder('Name')
    // const genderPicker = screen.getByPlaceholder('Gender')
    const emailTextInput = screen.getByPlaceholder('Email')
    const passwordTextInput = screen.getByPlaceholder('Password')
    const confirmPasswordTextInput = screen.getByPlaceholder('Confirm Password')

    fireEvent.changeText(nameTextInput, name)
    fireEvent.changeText(emailTextInput, email)
    fireEvent.changeText(passwordTextInput, password)
    fireEvent.changeText(confirmPasswordTextInput, password)

    await waitFor(() => {
      expect(nameTextInput.props.value).toBe(name)
      expect(emailTextInput.props.value).toBe(email)
      expect(passwordTextInput.props.value).toBe(password)
      expect(confirmPasswordTextInput.props.value).toBe(password)
    })
  })
})
