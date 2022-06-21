let lastTransactedLayer = L.layerGroup();

async function searchResalePrice (){
  const BASE_API_URL ="https://data.gov.sg/api/action/datastore_search";
    const resource_id = "f1765b54-a209-4718-8d38-a39237f502b3";
    let resalePriceData = await axios.get(BASE_API_URL,{
        'params': {
          'resource_id': resource_id,
            'limit': 258046 
        }
    });

  let resalePriceInfo = resalePriceData.data.result.records;
  return resalePriceInfo;
}


let radioBtn2Room = document.querySelector('#room2');
let radioBtn3Room = document.querySelector('#room3');
let radioBtn4Room = document.querySelector('#room4');
let radioBtn5Room = document.querySelector('#room5');
let radioBtn2RoomValue = radioBtn2Room.value;
let radioBtn3RoomValue = radioBtn3Room.value;
let radioBtn4RoomValue = radioBtn4Room.value;
let radioBtn5RoomValue = radioBtn5Room.value;

async function searchFlatTypeResults(radioBtn,radioBtnValue){
  radioBtn.addEventListener('click',async function(){
    // let searchLat = 1.3521;
    // let searchLng = 103.8646;
    resalePriceInfo = await searchResalePrice ();
    // console.log(resalePriceInfo);

    let searchTownOption = document.querySelector('#searchTown');
    let searchTownOptionValue = searchTownOption.value;
    console.log(radioBtnValue);

    try{
    for (let i = 257046 ; i <= resalePriceInfo.length;i++){
      let blkStreetName = resalePriceInfo[i].block + " " + resalePriceInfo[i].street_name;
      let monthTransacted = resalePriceInfo[i].month;
      let townTransacted = resalePriceInfo[i].town;
      let commencementYear = resalePriceInfo[i].lease_commence_date;
      let remainingYears = resalePriceInfo[i].remaining_lease;
      let lastTransactedPrice = resalePriceInfo[i].resale_price;
      let flatArea = resalePriceInfo[i].floor_area_sqm;
      let flatStoreyRange = resalePriceInfo[i].storey_range.toLowerCase();
      
      let flatType = resalePriceInfo[i].flat_type;
      let resultsList = document.createElement("div");
      console.log(flatType,townTransacted);

      if(flatType==radioBtnValue){
        // console.log(flatType);
          // console.log(townTransacted==searchTownOptionValue);
        
        if(townTransacted==searchTownOptionValue){
        //   console.log(townTransacted);
          resultsList.innerHTML = `
            <div class="container-fluid p-1">
              <p id="lastTransactedAddress">${blkStreetName}</p>   
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
          `;
          document.querySelector("#resultsListParentDiv").appendChild(resultsList);
        }else{
          resultsList.innerHTML = `
          <div class="container-fluid p-1">No results found.git push</diV
          `
        }
      };
    };    
    }catch(error){};
    let resetBtn = document.querySelector('#resetBtn');
    resetBtn.addEventListener('click',function(){
    let resultsListParentDiv = document.querySelector('#resultsListParentDiv');
    resultsListParentDiv.innerHTML = ``;
})
  });
};

searchFlatTypeResults(radioBtn2Room,radioBtn2RoomValue)
searchFlatTypeResults(radioBtn3Room,radioBtn3RoomValue)
searchFlatTypeResults(radioBtn4Room,radioBtn4RoomValue)
searchFlatTypeResults(radioBtn5Room,radioBtn5RoomValue)

  //   let flatArea = resalePriceInfo[i].floor_area_sqm;
  //   let flatStoreyRange = resalePriceInfo[i].storey_range.toLowerCase();

  //   let kmToDegreeConverter = 1/111
  //   let latBoundaryTop = parseFloat(searchLat) + parseFloat(searchRadius*kmToDegreeConverter);
  //   let latBoundaryBottom = parseFloat(searchLat) - parseFloat(searchRadius*kmToDegreeConverter);
  //   let lngBoundaryRight = parseFloat(searchLng) + parseFloat(searchRadius*kmToDegreeConverter);
  //   let lngBoundaryLeft = parseFloat(searchLng)- parseFloat(searchRadius*kmToDegreeConverter);

  //   const BASE_API_URL1 = "https://developers.onemap.sg/commonapi/search";
  //       let postalSearch = await axios.get(BASE_API_URL1, {
  //         'params': {
  //           'searchVal': blkStreetName,
  //           'returnGeom': 'Y',
  //           'getAddrDetails': 'Y',
  //         }
  //       }).catch(function (err) {});
  //   let lat = parseFloat(postalSearch.data.results[0].LATITUDE);
  //   let lng = parseFloat(postalSearch.data.results[0].LONGITUDE);
  //   let address = capitaliseFirstLetter(postalSearch.data.results[0].ADDRESS.toLowerCase());

  //   try{
  //     if(lat<latBoundaryTop && lat>latBoundaryBottom && lng<lngBoundaryRight && lg>lngBoundaryLeft && flatType==radioBtn3Room.value){
  //       
  //     };
  //   } catch(err){};




async function searchLastTransacted(latBoundaryTop,latBoundaryBottom,lngBoundaryRight,lngBoundaryLeft){

  resalePriceInfo = await searchResalePrice ();

  let lastTransactedClusterGroup = L.markerClusterGroup();  
  // show last 1000 records due to large dataset
  for (let i = 257046 ; i <= resalePriceInfo.length;i++){
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
    } catch (e) {}
  };
};

