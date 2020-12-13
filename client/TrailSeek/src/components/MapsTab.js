import React from 'react'
import { StyleSheet, Linking, Platform, View } from 'react-native'
import { Text, Button } from 'native-base'
import MapView, { Polyline, Marker } from 'react-native-maps'
import ColorConstants from '../util/ColorConstants'
import { FontAwesome5 } from '@expo/vector-icons'

const MapsTab = ({ trailData }) => {
  return (
    <View style={{ backgroundColor: ColorConstants.primary, flex: 1 }}>
      <MapView
        style={styles.mapStyle}
        initialRegion={{
          latitude: (trailData.bbox[1] + trailData.bbox[3]) / 2,
          longitude: (trailData.bbox[0] + trailData.bbox[2]) / 2,
          latitudeDelta: 0.0422,
          longitudeDelta: 0.0121,
        }}
        provider="google"
        mapType="terrain"
        loadingEnabled
      >
        <Marker
          coordinate={{
            latitude: trailData.start.coordinates[0],
            longitude: trailData.start.coordinates[1],
          }}
          title={'You Start Here'}
          // description={marker.description}
        />
        <Polyline
          coordinates={trailData.path}
          strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={3}
        />
      </MapView>
      <View
        style={{
          position: 'absolute', //use absolute position to show button on top of the map
          bottom: '5%', //for center align
          right: 10,
          alignSelf: 'flex-end',
          flexDirection: 'row-reverse',
        }}
      >
        <Button
          style={{
            borderRadius: 50,
            backgroundColor: ColorConstants.secondary,
            paddingHorizontal: 20,
          }}
          onPress={() => {
            const scheme = Platform.select({
              ios: 'maps:0,0?q=',
              android: 'geo:0,0?q=',
            })
            const latLng = `${trailData.start.coordinates[0]},${trailData.start.coordinates[1]}`
            const label = `${trailData.name}`
            const url = Platform.select({
              ios: `${scheme}${label}@${latLng}`,
              android: `${scheme}${latLng}(${label})`,
            })

            Linking.openURL(url)
          }}
        >
          <FontAwesome5 name="route" size={18} color="white" />
          <Text>Navigate</Text>
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mapStyle: {
    flex: 1,
  },
})

export default MapsTab
