import React from 'react'
import { Text, Container, Title, Image, Button } from 'native-base'
import { FontAwesome5 } from '@expo/vector-icons'
import ColorConstants from '../util/ColorConstants'

const EmptyStateView = ({ icon, title, description, buttonTitle, onPress }) => {
  return (
    <Container
      style={{
        flex: 1,
        backgroundColor: ColorConstants.DWhite,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}
    >
      {icon ? (
        <FontAwesome5 name={icon} size={64} color={ColorConstants.darkGray} />
      ) : (
        <></>
      )}

      {title ? (
        <Text style={{ marginTop: 40, fontWeight: 'bold' }}>{title}</Text>
      ) : (
        <></>
      )}

      {description ? (
        <Text style={{ marginTop: 20, textAlign: 'center' }}>
          {description}
        </Text>
      ) : (
        <></>
      )}

      {buttonTitle && onPress ? (
        <Button
          rounded
          style={{
            marginTop: 40,
            alignSelf: 'center',
            backgroundColor: ColorConstants.primary,
          }}
          onPress={onPress}
        >
          <Text>{buttonTitle}</Text>
        </Button>
      ) : (
        <></>
      )}
    </Container>
  )
}

export default EmptyStateView
