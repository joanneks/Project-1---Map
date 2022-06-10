let trainLayer = L.layerGroup();

async function searchTrainStations() {
  let response = await axios.get('02-json/trainStations.json');
  let mrtStationsAll = response.data;

  //create empty array to create one object for each mrt (i.e no duplicate mrt station names) 
  //trainStations.json has objects with the same mrt names but different mrtNo
  //e.g Serangoon MRT. only one Serangoon MRT name in mrtArr and the mrtNo:['CC13', 'NE12']
  let mrtArr = [];
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

  //extract out mrt details for the marker and bindpop
  for (eachMrt of mrtArr) {
    let stationName = eachMrt.mrtName;
    let lat = eachMrt.mrtLat;
    let lng = eachMrt.mrtLng;
    let stationNo = "";
    //needs the for loop because it is in an array in an mrtArr(object)
    for (let i = 0; i < 3; i++) {
      if (i < eachMrt.mrtNo.length) {
        stationNo += eachMrt.mrtNo[i] + ", ";
      };
    };
    stationNo = stationNo.slice(0, stationNo.length - 2);

    //set marker icon
    let trainIcon = L.icon({
      iconUrl: "images-folder/train.png",
      iconSize: [40, 40]
    });

    // create marker
    let trainMarker = L.marker([lat, lng], { icon: trainIcon });

    //Add to trainLayer
    trainMarker.addTo(trainLayer);
    trainMarker.bindPopup(`
        <p>${stationName}</p>
        <p>Station No: ${stationNo}</p>
        `);

  }
  // Add trainLayer to map
  trainLayer.addTo(map); 
  return;

};




//ORIGINAL CODE
// async function searchTrainStations() {
//   let response = await axios.get('02-json/trainStations.json');
//   let mrtStationsAll = response.data;
//   let trainClusterLayer = L.markerClusterGroup();

//   //create empty array to create one object for each mrt (i.e no duplicate mrt station names) 
//   //trainStations.json has objects with the same mrt names but different mrtNo
//   //e.g Serangoon MRT. only one Serangoon MRT name in mrtArr and the mrtNo:['CC13', 'NE12']
//   let mrtArr = [];
//   for (mrtStation of mrtStationsAll) {
//     //mrtArr is empty now,so the if function will only add the first mrt from trainStations.json and move to else
//     if (mrtArr.length == 0) {
//       mrtArr.push({
//         mrtName: mrtStation.STN_NAME,
//         mrtLat: mrtStation.Latitude,
//         mrtLng: mrtStation.Longitude,
//         mrtNo: [mrtStation.STN_NO]
//       });
//     }
//     else {
//       //mrt name in each mrt object in trainStations.json, will be compared against each mrt name in mrtArr
//       //if it matches (i.e true), it means that the mrt name has already been added to mrtArr
//       //hence, only the mrt station number from the duplicate mrt object in trainStations.json will be added to mrtArr
//       //no need to worry about overlap in mrt station number, 
//       //because the outermost for loop is looping through trainstations.json in sequential order
//       for (eachMrt of mrtArr) {
//         if (eachMrt.mrtName == mrtStation.STN_NAME) {
//           eachMrt.mrtNo.push(mrtStation.STN_NO);
//         }
//       } if (eachMrt.mrtName != mrtStation.STN_NAME) {
//         //if it does not match(i.e false), it means the mrt name from trainStations.json has yet to be added to mrtArr
//         //hence, we push all the information required into mrtArr.
//         mrtArr.push({
//           mrtName: mrtStation.STN_NAME,
//           mrtLat: mrtStation.Latitude,
//           mrtLng: mrtStation.Longitude,
//           mrtNo: [mrtStation.STN_NO]
//         });
//       };
//     };
//   };

//   //extract out mrt details for the marker and bindpop
//   for (eachMrt of mrtArr) {
//     let stationName = eachMrt.mrtName;
//     let lat = eachMrt.mrtLat;
//     let lng = eachMrt.mrtLng;
//     let stationNo = "";
//     //needs the for loop because it is in an array in an mrtArr(object)
//     for (let i = 0; i < 3; i++) {
//       if (i < eachMrt.mrtNo.length) {
//         stationNo += eachMrt.mrtNo[i] + ", ";
//       };
//     };
//     stationNo = stationNo.slice(0, stationNo.length - 2);

//     //set marker icon
//     var trainIcon = L.icon({
//       iconUrl: "images-folder/train.png",
//       iconSize: [40, 40]
//     });

//     // create marker
//     let trainMarker = L.marker([lat, lng], { icon: trainIcon });

//     //Add to trainClusterLayer
//     trainMarker.addTo(trainClusterLayer);
//     trainMarker.bindPopup(`
//         <p>${stationName}</p>
//         <p>Station No: ${stationNo}</p>
//         `);
//   }
//   // Add trainClusterLayer to map
//   trainClusterLayer.addTo(map); 
//   return;

// };
// // getTrainStations();