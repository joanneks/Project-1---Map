let lastTransactedLayer = L.layerGroup();
async function searchLastTransacted(latBoundaryTop,latBoundaryBottom,lngBoundaryRight,lngBoundaryLeft){
  const BASE_API_URL ="https://data.gov.sg/api/action/datastore_search";
  const resource_id = "f1765b54-a209-4718-8d38-a39237f502b3";
  let resalePriceData = await axios.get(BASE_API_URL,{
      'params': {
        'resource_id': resource_id,
          'limit': 127935
          // 'limit': 127935
      }
  });
  let lastTransactedClusterGroup = L.markerClusterGroup();
  let resalePriceInfo = resalePriceData.data.result.records;
  // start from 126935 to show recent data that are more relevant for the user and because the original dataset is to big to show all
  for (let i = 125935; i <= resalePriceInfo.length;i++){
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
      });
      let lat = parseFloat(postalSearch.data.results[0].LATITUDE);
      let lng = parseFloat(postalSearch.data.results[0].LONGITUDE);
      let address = capitaliseFirstLetter(postalSearch.data.results[0].ADDRESS.toLowerCase());
      // console.log(postalSearch.data.results);

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
        <p>TOWN: ${townTransacted}
        <span>Sold On: ${monthTransacted}</span></p>
        <p>${address} }</p>
        <p>Lease Commencement Year: ${commencementYear}</p>
        <p>Remaining Years: ${remainingYears}</p>
        <p>Last Transacted Price: ${lastTransactedPrice}</p>
        <p>Flat Type (Area): ${flatType}, (${flatArea} sqm)</p>
        <p>Flat Level Range: ${flatStoreyRange}</p>
        `)
      };
    };
    searchLastTransactedPostalCode(blkStreetName,latBoundaryTop,latBoundaryBottom,lngBoundaryRight,lngBoundaryLeft);
  };
};
