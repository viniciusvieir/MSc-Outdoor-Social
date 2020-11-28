import React from 'react'
import { FlatList } from 'react-native'
import { List, ListItem, Text } from 'native-base'
import { useNavigation } from '@react-navigation/native'

const MyEventsList = ({ data, listHeader }) => {
  const navigation = useNavigation()
  if (data === undefined || data.length == 0) {
    return null
  }
  return (
    <List style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => {
          return item._id
        }}
        ListHeaderComponent={
          <ListItem itemHeader first>
            <Text>{listHeader}</Text>
          </ListItem>
        }
        ListEmptyComponent={<Text>No Data</Text>}
        renderItem={({ item }) => {
          return (
            <ListItem
              onPress={() => {
                navigation.navigate('ViewEvent', {
                  eventID: item._id,
                })
              }}
            >
              <Text>{item.title}</Text>
            </ListItem>
          )
        }}
      />
    </List>
  )
}

export default MyEventsList
