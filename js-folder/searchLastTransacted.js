let lastTransactedLayer = L.layerGroup();
let totalDataPoint = 1500

//limit has to be hardcoded and depends on the total records on data.gov. 
//It changes frequently so my data might become outdated
//to retrieve dataset from data.gov for resale flat
async function searchResalePrice (){
  const BASE_API_URL ="https://data.gov.sg/api/action/datastore_search";
    const resource_id = "f1765b54-a209-4718-8d38-a39237f502b3";
    let resalePriceData = await axios.get(BASE_API_URL,{
        'params': {
          'resource_id': resource_id,
            'limit': 129124 
        }
    });

  let resalePriceInfo = resalePriceData.data.result.records;
  return resalePriceInfo;
}

async function searchLastTransacted(latBoundaryTop,latBoundaryBottom,lngBoundaryRight,lngBoundaryLeft){

  resalePriceInfo = await searchResalePrice ();

  let lastTransactedClusterGroup = L.markerClusterGroup();  
  for (let i = resalePriceInfo.length-totalDataPoint ; i <= resalePriceInfo.length;i++){
    let blkStreetName = resalePriceInfo[i].block + " " + resalePriceInfo[i].street_name;
    let monthTransacted = resalePriceInfo[i].month;
    let townTransacted = resalePriceInfo[i].town;
    let commencementYear = resalePriceInfo[i].lease_commence_date;
    let remainingYears = resalePriceInfo[i].remaining_lease;
    let lastTransactedPrice = resalePriceInfo[i].resale_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
        //add clustergroup to layer
        lastTransactedClusterGroup.addTo(lastTransactedLayer);
        lastTransactedMarker.bindPopup(`
        <div class="container-fluid p-1">
          <p id="lastTransactedAddress">${address}</p>    
          <table class="table table-hover table-striped" id="lastTransactedTable">
            <tr>
              <td>Town:</td>
              <td>${townTransacted}</td>
            </tr>
            <tr>
              <td>Sold on:</td>
              <td>${monthTransacted}</td>
            </tr>
            <tr>
              <td>Lease Commencement:</td>
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
    } catch (e) {};
  };
};

