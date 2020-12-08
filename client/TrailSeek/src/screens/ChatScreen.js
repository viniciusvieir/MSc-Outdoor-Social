import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import { GiftedChat } from 'react-native-gifted-chat'
import { Spinner, Toast } from 'native-base'
import { uuidv4 } from '../util/uuid'
import ColorConstants from '../util/ColorConstants'

import defaultSocket from '../api/socket'

const ChatScreen = ({ route }) => {
  const { eventId } = route.params

  const isAuth = useSelector((state) => state.user.isAuth)
  const token = useSelector((state) => state.user.profile.token)

  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)

  const socket = useRef(null)
  const timeout = useRef(null)

  const manageSocket = () => {
    socket.current = defaultSocket('/events', { eventId })

    socket.current.on('events:all-chat', (data) => {
      const messages = data.map((message, index) => {
        return {
          _id: index,
          text: message.content,
          createdAt: new Date(message.date),
          user: {
            _id: uuidv4(),
            name: message.name || `User ${index + 1}`,
            avatar: message.profileImage || 'https://placeimg.com/140/140/any',
          },
        }
      })
      setMessages(messages.reverse())
      setIsLoading(false)
    })

    socket.current.on('events:someone-typing', () => {
      setIsTyping(true)
      clearTimeout(timeout.current)
      timeout.current = setTimeout(() => {
        setIsTyping(false)
      }, 2000)
    })

    socket.current.on('events:receive-new', (data) => {
      const message = {
        _id: uuidv4(),
        text: data.content,
        createdAt: new Date(data.date),
        user: {
          _id: data.userId,
          name: data.name,
          avatar: data.profileImage,
        },
      }
      setIsTyping(false)
      setMessages((old) => GiftedChat.append(old, [message]))
    })
  }

  const onSend = async (messages) => {
    if (!isAuth) {
      Toast.show({ text: 'You need to be authenticated to comment' })
      return
    }

    const content = messages[0].text
    socket.current.emit('events:send-new', { token, eventId, content })
  }

  useEffect(() => {
    manageSocket()
    return () => {
      socket.current.close()
    }
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      {isLoading ? (
        <Spinner color={ColorConstants.primary} />
      ) : (
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          showAvatarForEveryMessage={true}
          renderUsernameOnMessage={true}
          isTyping={isTyping}
          //   renderDay={() => null}
          //   renderTime={() => null}
          onInputTextChanged={(text) => {
            if (text.length > 0) socket.current.emit('events:user-typing')
          }}
          user={{
            _id: 1,
            name: 'Me',
            avatar: 'https://placeimg.com/140/140/any',
          }}
        />
      )}
    </View>
  )
}

export default ChatScreen
