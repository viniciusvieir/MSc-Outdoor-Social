import React from 'react'
import { FlatList, SectionList, View, StyleSheet } from 'react-native'
import { List, ListItem, Text } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import CalendarView from './CalendarView'
import ColorConstants from '../util/ColorConstants'

const MyEventsList = ({ data }) => {
  const navigation = useNavigation()
  if (data[0] === undefined || data[1] === undefined) {
    return null
  }
  const subTitle = (data) => {
    if (data === undefined) {
      return ''
    }
    const hrs = Math.floor(data.duration_min / 60)
    const mins = data.duration_min % 60
    const people = data.participants.length
    const max_people = data.max_participants
    return `${hrs !== 0 ? `${hrs} hour(s)` : ''} ${mins} minutes • ${
      people > 1
        ? `${people} people going`
        : `${people === 0 ? `No one going` : `${people} person going`}`
    } • ${max_people} max`
  }
  return (
    <List style={{ flex: 1 }}>
      <SectionList
        style={{ flex: 1 }}
        sections={data}
        keyExtractor={(item, index) => item + index}
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
              <View>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.subtitleText}>{subTitle(item)}</Text>
              </View>
            </ListItem>
          )
        }}
        renderSectionHeader={({ section: { title, data } }) =>
          data.length > 0 ? (
            <View style={{ marginLeft: 20, marginTop: 10 }}>
              <Text style={{ fontSize: 22 }}>{title}</Text>
            </View>
          ) : null
        }
      />
    </List>
  )
}
const styles = StyleSheet.create({
  titleText: {
    color: ColorConstants.Black2,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: 12,
  },
  subtitleText: {
    color: ColorConstants.Black2,
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 12,
  },
})

export default MyEventsList
