import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import trailSeek from '../api/trailSeek'
import { Spinner, Toast } from 'native-base'
import { getToken, isLoggedIn } from '../util/auth'
import ColorConstants from '../util/ColorConstants'

import io from 'socket.io-client'

// const CommentsTabs = ({ trailData }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [messages, setMessages] = useState([])
//   const [isLoading, setIsLoading] = useState(true)

//   const uuidv4 = () => {
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
//       /[xy]/g,
//       function (c) {
//         var r = (Math.random() * 16) | 0,
//           v = c == 'x' ? r : (r & 0x3) | 0x8
//         return v.toString(16)
//       }
//     )
//   }

//   const checkAuthentication = async () => {
//     const authenticated = await isLoggedIn()
//     setIsAuthenticated(authenticated)
//   }

//   const getMessages = () => {
//     trailSeek.get(`/trails/${trailData._id}/comments`).then((response) => {
//       const comments = response.data.map((comment, index) => {
//         return {
//           _id: index,
//           text: comment.content,
//           createdAt: new Date(comment.date),
//           user: {
//             _id: uuidv4(),
//             name: comment.name || `User ${index + 1}`,
//             avatar: comment.profileImage || 'https://placeimg.com/140/140/any',
//           },
//         }
//       })
//       setMessages(comments.reverse())
//       setIsLoading(false)
//     })
//   }

//   const onSend = (comments) => {
//     if (!isAuthenticated) {
//       Toast.show({ text: 'You need to be authenticated to comment' })
//       return
//     }

//     comments.forEach((comment) => (comment.user._id = uuidv4()))

//     const content = comments[0].text
//     trailSeek
//       .post(`/trails/${trailData._id}/comments`, { content })
//       .then((response) => {
//         comments.forEach((comment) => {
//           comment.user.name = response.data.name
//           comment.user.avatar = response.data.profileImage
//         })
//         setMessages((old) => GiftedChat.append(old, comments))
//       })
//       .catch((err) => {
//         Toast.show({ text: err.response.data.errors[0].msg || err.message })
//       })
//   }

//   useEffect(() => {
//     checkAuthentication()
//     getMessages()
//   }, [])

//   return (
//     <View style={{ flex: 1, justifyContent: 'center' }}>
//       {isLoading ? (
//         <Spinner color={ColorConstants.primary} />
//       ) : (
//         <GiftedChat
//           messages={messages}
//           onSend={(comments) => onSend(comments)}
//           showAvatarForEveryMessage={true}
//           renderUsernameOnMessage={true}
//           //   inverted={false}
//           renderDay={() => null}
//           renderTime={() => null}
//           user={{
//             _id: 1,
//             name: 'Me',
//             avatar: 'https://placeimg.com/140/140/any',
//           }}
//         />
//       )}
//     </View>
//   )
// }

const CommentsTabs = ({ trailData }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const socket = useRef(null)

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

  const checkAuthentication = async () => {
    const authenticated = await isLoggedIn()
    setIsAuthenticated(authenticated)
  }

  const manageSocket = () => {
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
      setMessages((old) => GiftedChat.append(old, [comment]))
    })
  }

  const onSend = async (comments) => {
    if (!isAuthenticated) {
      Toast.show({ text: 'You need to be authenticated to comment' })
      return
    }

    const token = await getToken()
    const trailId = trailData._id
    const content = comments[0].text

    socket.current.emit('comments:send-new', { token, trailId, content })
  }

  useEffect(() => {
    checkAuthentication()

    socket.current = io('http://94.245.110.210:5050/comments', {
      query: {
        trailId: trailData._id,
      },
    })

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
          isTyping={false}
          //   inverted={false}
          renderDay={() => null}
          renderTime={() => null}
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
