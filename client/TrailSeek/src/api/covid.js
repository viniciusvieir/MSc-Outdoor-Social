import axiso from "axios";

export default axiso.create({
  baseURL:
    "https://services1.arcgis.com/eNO7HHeQ3rUcBllm/ArcGIS/rest/services/Covid19CountyStatisticsHPSCIreland/FeatureServer/0/query",
  params: {
    where: "TimeStamp>=CURRENT_TIMESTAMP-14",
    geometryType: "esriGeometryPoint",
    inSR: "4326",
    spatialRel: "esriSpatialRelWithin",
    resultType: "none",
    distance: "0.0",
    units: "esriSRUnit_Meter",
    returnGeodetic: "false",
    outFields:
      "CountyName,ConfirmedCovidCases,TimeStamp,PopulationProportionCovidCases,PopulationCensus16",
    returnGeometry: "false",
    returnCentroid: "false",
    featureEncoding: "esriDefault",
    multipatchOption: "none",
    outSR: "4326",
    applyVCSProjection: "false",
    returnIdsOnly: "false",
    returnUniqueIdsOnly: "false",
    returnCountOnly: "false",
    returnExtentOnly: "false",
    returnQueryGeometry: "false",
    returnDistinctValues: "false",
    cacheHint: "false",
    orderByFields: "TimeStamp",
    returnZ: "false",
    returnM: "false",
    returnExceededLimitFeatures: "true",
    sqlFormat: "none",
    f: "pjson",
  },
});
