import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { Spinner, Toast } from 'native-base'
import { useSelector } from 'react-redux'
import { uuidv4 } from '../util/uuid'
import ColorConstants from '../util/ColorConstants'

import defaultSocket from '../api/socket'

const CommentsTabs = ({ trailData }) => {
  const isAuth = useSelector((state) => state.user.isAuth)
  const token = useSelector((state) => state.user.profile.token)

  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)

  const socket = useRef(null)
  const timeout = useRef(null)

  const manageSocket = () => {
    socket.current = defaultSocket('/comments', { trailId: trailData._id })

    socket.current.on('comments:all-comments', (data) => {
      const comments = data.map((comment, index) => {
        return {
          _id: index,
          text: comment.content,
          createdAt: new Date(comment.date),
          user: {
            _id: uuidv4(),
            name: comment.name || `User ${index + 1}`,
            avatar: comment.profileImage || 'https://placeimg.com/140/140/any',
          },
        }
      })
      setMessages(comments.reverse())
      setIsLoading(false)
    })

    socket.current.on('comments:someone-typing', () => {
      setIsTyping(true)
      clearTimeout(timeout.current)
      timeout.current = setTimeout(() => {
        setIsTyping(false)
      }, 2000)
    })

    socket.current.on('comments:receive-new', (data) => {
      const comment = {
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
      setMessages((old) => GiftedChat.append(old, [comment]))
    })
  }

  const onSend = async (comments) => {
    if (!isAuth) {
      Toast.show({ text: 'You need to be authenticated to comment' })
      return
    }

    const trailId = trailData._id
    const content = comments[0].text

    socket.current.emit('comments:send-new', { token, trailId, content })
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
          onSend={(comments) => onSend(comments)}
          showAvatarForEveryMessage={true}
          renderUsernameOnMessage={true}
          isTyping={isTyping}
          //   inverted={false}
          renderDay={() => null}
          renderTime={() => null}
          onInputTextChanged={(text) => {
            if (text.length > 0) socket.current.emit('comments:user-typing')
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

export default CommentsTabs
