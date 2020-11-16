import React, { useEffect, useState } from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { Tile } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { Container, Tab, Tabs, Header, Content, Text } from "native-base";

import { fetchTrailsByID } from "../app/trailSlice";
import ToastAlert from "../components/ToastAlert";
import LoadSpinner from "../components/LoadSpinner";
import CONSTANTS from "../util/Constants";
import DetailsTab from "../components/DetailsTab";
import MapsTab from "../components/MapsTab";
import EventsTab from "../components/EventsTab";
import ColorConstants from "../util/ColorConstants";
import NoData from "../components/NoData";

const ViewTrailScreen = ({ route }) => {
  const { id, showEvents } = route.params;
  const [trailData, setTrailData] = useState({});
  let spinner = true;
  let content;
  const dispatch = useDispatch();

  const covFlag = useSelector((state) => state.user.covidToggle);
  const trailStatus = useSelector((state) => state.trails.status);
  const error = useSelector((state) => state.trails.error);
  const fields =
    "name,avg_rating,location,path,bbox,img_url,difficulty,length_km,description,activity_type,estimate_time_min,start,recommended";

  useEffect(() => {
    const getTrailDetail = async () => {
      try {
        const results = await dispatch(
          fetchTrailsByID({ fields, id, covFlag })
        );
        const uResults = unwrapResult(results);
        setTrailData(uResults);
      } catch (e) {
        ToastAlert(e.message);
      }
    };
    getTrailDetail();
  }, [dispatch]);

  if (!(JSON.stringify(trailData) === "{}")) {
    spinner = false;
    content = (
      <View style={{ flex: 1 }}>
        <Tile
          imageSrc={{ uri: trailData.img_url }}
          title={trailData.name}
          featured
          activeOpacity={1}
          height={230}
          titleStyle={styles.tilettlstyle}
        />
        <Header
          hasTabs
          style={{ height: 0 }}
          androidStatusBarColor="#ffffff00"
        />

        <Tabs
          // page={showEvents ? 2 : 0}
          initialPage={showEvents ? 2 : 0}
          locked={true}
          // onChangeTab={(test) => {
          //   console.log(test);
          // }}
          // tabBarBackgroundColor={ColorConstants.LGreen}
          // tabStyle={{ backgroundColor: ColorConstants.LGreen }}
        >
          <Tab
            heading="Details"
            tabStyle={{ backgroundColor: ColorConstants.Black }}
            activeTabStyle={{ backgroundColor: ColorConstants.Black }}
          >
            <DetailsTab trailData={trailData} />
          </Tab>
          <Tab
            heading="Maps"
            tabStyle={{ backgroundColor: ColorConstants.Black }}
            activeTabStyle={{ backgroundColor: ColorConstants.Black }}
          >
            <MapsTab trailData={trailData} />
          </Tab>
          <Tab
            heading="Events"
            tabStyle={{ backgroundColor: ColorConstants.Black }}
            activeTabStyle={{ backgroundColor: ColorConstants.Black }}
          >
            <EventsTab trailData={trailData} />
          </Tab>
        </Tabs>
        <LoadSpinner visible={spinner} />
      </View>
    );
  } else if (trailStatus === CONSTANTS.LOADING) {
    spinner = true;
  } else if (trailStatus === CONSTANTS.FAILED) {
    spinner = false;
    ToastAlert(error);
    content = error;
  } else if (
    trailStatus === CONSTANTS.SUCCESS &&
    JSON.stringify(trailData) === "{}"
  ) {
    content = <NoData />;
  }
  return (
    <Container style={{ backgroundColor: ColorConstants.LGreen, flex: 1 }}>
      {content}
    </Container>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: Dimensions.get("window").width,
    height: 175,
    marginBottom: 5,
  },
  tilettlstyle: {
    fontWeight: "600",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default ViewTrailScreen;
