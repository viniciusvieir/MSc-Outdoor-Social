import React from "react";
import { StyleSheet, Linking, Platform, Dimensions, View } from "react-native";
import { Text, Button } from "native-base";
import MapView, { Polyline } from "react-native-maps";
import ColorConstants from "../util/ColorConstants";

const MapsTab = ({ trailData }) => {
  return (
    <View style={{ backgroundColor: ColorConstants.LGreen }}>
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
        <Polyline
          coordinates={trailData.path}
          strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={3}
        />
      </MapView>
      <Button
        onPress={() => {
          const scheme = Platform.select({
            ios: "maps:0,0?q=",
            android: "geo:0,0?q=",
          });
          const latLng = `${trailData.start.coordinates[0]},${trailData.start.coordinates[1]}`;
          const label = `${trailData.name}`;
          const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`,
          });

          Linking.openURL(url);
        }}
        block
        style={{ margin: 5, backgroundColor: ColorConstants.Yellow }}
      >
        <Text style={{ color: ColorConstants.Black }}>Navigate</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  mapStyle: {
    // margin: 10,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 355,
  },
});

export default MapsTab;
