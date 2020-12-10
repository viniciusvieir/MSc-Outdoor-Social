import React from 'react'
import { FlatList } from 'react-native'
import { List, ListItem, Text } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import CalendarView from './CalendarView'

const MyEventsList = ({ data, listHeader }) => {
  const navigation = useNavigation()
  if (data === undefined || data.length == 0) {
    return null
  }
  //TODO SECTION LIST
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
              <CalendarView date={item.date} />
              <Text style={{ marginLeft: 10 }}>{item.title}</Text>
            </ListItem>
          )
        }}
      />
    </List>
  )
}

export default MyEventsList
