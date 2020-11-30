import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { Spinner, Toast } from 'native-base'
import { isLoggedIn } from '../util/auth'
import ColorConstants from '../util/ColorConstants'

import socketIOClient from 'socket.io-client'

const ChatTab = ({ eventId }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const checkAuthentication = async () => {
    const authenticated = await isLoggedIn()
    setIsAuthenticated(authenticated)
  }

  const connectToSocket = async () => {
    const socket = socketIOClient('http://localhost:5050/chat')

    socket.on('connect', () => {
      console.log(socket.id, 'Socket connected to chat')
    })

    socket.on('chat:all-messages', (data) => {
      setMessages(data)
    })

    socket.on('chat:new-message', (data) => {
      const message = {
        _id: 'data._id',
        text: data.content,
        createdAt: data.createdAt,
        user: {
          _id: data.userId,
          name: data.name,
          avatar: data.profileImage,
        },
      }
      setMessages((old) => GiftedChat.append(old, [message]))
    })
  }

  const onSend = (comments) => {
    if (!isAuthenticated) {
      Toast.show({ text: 'You need to be authenticated to comment' })
      return
    }
    const message = {
      userId: comments[0].user._id,
      content: comments[0].text,
    }
    socket.emit('chat:send', message)
  }

  useEffect(() => {
    checkAuthentication()
    connectToSocket()
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      {isLoading ? (
        <Spinner color={ColorConstants.primary} />
      ) : (
        <GiftedChat
          messages={messages}
          onSend={(comments) => onSend(comments)}
          showAvatarForEveryMessage={true}
          renderUsernameOnMessage={true}
          //   inverted={false}
          renderDay={() => null}
          renderTime={() => null}
          user={{
            _id: 1,
            name: 'Me',
          }}
        />
      )}
    </View>
  )
}

export default ChatTab
