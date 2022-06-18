let trainLayer = L.layerGroup();
let mrtArr = [];

//retrieve all mrt station details
async function searchTrainStations() {
  let response = await axios.get('02-json/trainStations.json');
  let mrtStationsAll = response.data;

  //create empty array to create one object for each mrt (i.e no duplicate mrt station names) 
  //trainStations.json has objects with the same mrt names but different mrtNo
  //e.g Serangoon MRT. only one Serangoon MRT name in mrtArr and the mrtNo:['CC13', 'NE12']

  for (mrtStation of mrtStationsAll) {
    //mrtArr is empty now,so the if function will only add the first mrt from trainStations.json and move to else
    if (mrtArr.length == 0) {
      mrtArr.push({
        mrtName: mrtStation.STN_NAME,
        mrtLat: mrtStation.Latitude,
        mrtLng: mrtStation.Longitude,
        mrtNo: [mrtStation.STN_NO]
      });
    }
    else {
      //mrt name in each mrt object in trainStations.json, will be compared against each mrt name in mrtArr
      //if it matches (i.e true), it means that the mrt name has already been added to mrtArr
      //hence, only the mrt station number from the duplicate mrt object in trainStations.json will be added to mrtArr
      //no need to worry about overlap in mrt station number, 
      //because the outermost for loop is looping through trainstations.json in sequential order
      for (eachMrt of mrtArr) {
        if (eachMrt.mrtName == mrtStation.STN_NAME) {
          eachMrt.mrtNo.push(mrtStation.STN_NO);
        }
      } if (eachMrt.mrtName != mrtStation.STN_NAME) {
        //if it does not match(i.e false), it means the mrt name from trainStations.json has yet to be added to mrtArr
        //hence, we push all the information required into mrtArr.
          mrtArr.push({
            mrtName: mrtStation.STN_NAME,
            mrtLat: mrtStation.Latitude,
            mrtLng: mrtStation.Longitude,
            mrtNo: [mrtStation.STN_NO]
          });
        };
    };
  };
};

//show markers that are within the radius set by user.
function showTrainMarkers (stationName,stationNo,lat,lng,latBoundaryTop,latBoundaryBottom,lngBoundaryRight,lngBoundaryLeft){
  if(lat<latBoundaryTop && lat>latBoundaryBottom && lng<lngBoundaryRight && lng>lngBoundaryLeft){
      //set marker icon
      let trainIcon = L.icon({
      iconUrl: "images-folder/train.png",
      iconSize: [40, 40]
      });

      // create marker and add to trainLayer, set bindpopup
      let trainMarker = L.marker([lat, lng], { icon: trainIcon });
      trainMarker.addTo(trainLayer);
      trainMarker.bindPopup(`
      <p class="trainPopupHeader">${stationName}</p>
      <p class="trainPopup">Station No: ${stationNo}</p>
      `);
  };
};
