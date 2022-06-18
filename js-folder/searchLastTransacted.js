let lastTransactedLayer = L.layerGroup();
async function searchLastTransacted(latBoundaryTop,latBoundaryBottom,lngBoundaryRight,lngBoundaryLeft){
  const BASE_API_URL ="https://data.gov.sg/api/action/datastore_search";
  const resource_id = "f1765b54-a209-4718-8d38-a39237f502b3";
  let resalePriceData = await axios.get(BASE_API_URL,{
      'params': {
        'resource_id': resource_id,
          'limit': 257650 
          // 'limit': 127935
      }
  });
  let lastTransactedClusterGroup = L.markerClusterGroup();
  let resalePriceInfo = resalePriceData.data.result.records;
  // start from 126935 to show recent data that are more relevant for the user and because the original dataset is to big to show all
  for (let i = 256650 ; i <= resalePriceInfo.length;i++){
    let blkStreetName = resalePriceInfo[i].block + " " + resalePriceInfo[i].street_name;
    let monthTransacted = resalePriceInfo[i].month;
    let townTransacted = resalePriceInfo[i].town;
    let commencementYear = resalePriceInfo[i].lease_commence_date;
    let remainingYears = resalePriceInfo[i].remaining_lease;
    let lastTransactedPrice = resalePriceInfo[i].resale_price;
    let flatType = capitaliseFirstLetter(resalePriceInfo[i].flat_type.toLowerCase());
    let flatArea = resalePriceInfo[i].floor_area_sqm;
    let flatStoreyRange = resalePriceInfo[i].storey_range.toLowerCase();
    // console.log(blkStreetName);
    async function searchLastTransactedPostalCode(blkStreetName,latBoundaryTop,latBoundaryBottom,lngBoundaryRight,lngBoundaryLeft) {
      //searchLastTransacted.js:15 Uncaught (in promise) 
      //TypeError: Cannot read properties of undefined (reading 'block') at searchLastTransacted
      //-->error because the blkStreetName from data.gov API cannot return lat lng values from onemap's API
      const BASE_API_URL1 = "https://developers.onemap.sg/commonapi/search";
      let postalSearch = await axios.get(BASE_API_URL1, {
        'params': {
          'searchVal': blkStreetName,
          'returnGeom': 'Y',
          'getAddrDetails': 'Y',
        }
      }).catch(function (err) {});
      let lat = parseFloat(postalSearch.data.results[0].LATITUDE);
      let lng = parseFloat(postalSearch.data.results[0].LONGITUDE);
      let address = capitaliseFirstLetter(postalSearch.data.results[0].ADDRESS.toLowerCase());
      // console.log(postalSearch.data.results);

      try{
      if(lat<latBoundaryTop && lat>latBoundaryBottom && lng<lngBoundaryRight && lng>lngBoundaryLeft){
        //set marker icon  
        let lastTransactedIcon = L.icon({
          iconUrl: "images-folder/lastTransacted.png",
          iconSize: [40,40]
        });
      
        // create marker, bindpopup ,add to cluster group
        let lastTransactedMarker = L.marker([lat, lng], { icon: lastTransactedIcon});
        lastTransactedMarker.addTo(lastTransactedClusterGroup);
        //add clustergroup to later
        lastTransactedClusterGroup.addTo(lastTransactedLayer);
        lastTransactedMarker.bindPopup(`
        <div class="container-fluid">    
          <div class="row"> 
            <div class="col lastTransactedPopup">TOWN:</div>
            <div class="col align-self-end lastTransactedPopup">SOLD ON:</div>
          </div> 
          <div class="row"> 
            <div class="col lastTransactedPopup">${townTransacted}</div>
            <div class="col align-self-end lastTransactedPopup">${monthTransacted}</div>
          </div class="lastTransactedPopup"> 
            <table class="table table-hover">
              <tr>
                <td>Address:</td>
                <td>${address}</td>
              </tr>
              <tr>
                <td>Lease Commencement Year:</td>
                <td>${commencementYear}</td>
              </tr>
              <tr>
                <td>Remaining Years:</td>
                <td>${remainingYears}</td>
              </tr>
              <tr>
                <td>Last Transacted Price:</td>
                <td>${lastTransactedPrice}</td>
              </tr>
              <tr>
                <td>Flat Type (Area):</td>
                <td>${flatType}, (${flatArea} sqm)</td>
              </tr>
              <tr>
                <td>Flat Level Range:</td>
                <td>${flatStoreyRange}</td>
              </tr>
            </table>
        </div>
        `)
      };
      } catch(err){};
    };

    try {
    searchLastTransactedPostalCode(blkStreetName,latBoundaryTop,latBoundaryBottom,lngBoundaryRight,lngBoundaryLeft);
    } catch (e) {}
  };
};

