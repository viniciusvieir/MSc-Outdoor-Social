import React, { useEffect, useState } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import moment from 'moment'
import trailSeek from '../api/trailSeek'
import { Toast } from 'native-base'

const CommentsTabs = ({ trailData }) => {
  const [messages, setMessages] = useState([])

  const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      }
    )
  }

  useEffect(() => {
    trailSeek.get(`/trails/${trailData._id}/comments`).then((response) => {
      const comments = response.data.map((comment, index) => {
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
    })
  }, [])

  const onSend = (comments) => {
    comments.forEach((comment) => (comment.user._id = uuidv4()))

    const content = comments[0].text
    trailSeek
      .post(`/trails/${trailData._id}/comments`, { content })
      .then((response) => {
        comments.forEach((comment) => {
          comment.user.name = response.data.name
          comment.user.avatar = response.data.profileImage
        })
        setMessages((old) => GiftedChat.append(old, comments))
      })
      .catch((err) => {
        Toast.show({ text: err.response.data.errors[0].msg || err.message })
      })
  }

  return (
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
        avatar: 'https://placeimg.com/140/140/any',
      }}
    />
  )
}

export default CommentsTabs
