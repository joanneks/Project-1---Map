let searchFlatLayer = L.layerGroup();

function addMarker(lat, lng, address, iconUrl, iconSizeX, iconSizeY) {
  //set marker icon
  let searchFlatIcon = L.icon({
    iconUrl: iconUrl,
    iconSize: [iconSizeX,iconSizeY]
  });

  // create marker and add to map
  let searchMarker = L.marker([lat, lng], { icon: searchFlatIcon, zIndexOffset: 1000 });
  searchMarker.addTo(searchFlatLayer);
  searchFlatLayer.addTo(map);
  searchMarker.bindPopup(`<p>${address}</p>`)

}

function addMarkerCircle(lat, lng, radius){
  //create circle marker for radius
  let searchMarkerCircle = L.circle([lat, lng], { radius: radius });
  searchMarkerCircle.addTo(map);
}

async function searchFlatbyPostalCode() {
  const BASE_API_URL = "https://developers.onemap.sg/commonapi/search";
  let searchBtn = document.querySelector('#searchBtn');
  let searchVal = document.querySelector('#searchPostalCode')
  let searchRadius = document.getElementById('searchRadius');
  

  searchBtn.addEventListener('click', async function () {
    alert('clicked');
    let postalSearch = await axios.get(BASE_API_URL, {
      'params': {
        'searchVal': searchVal.value,
        'returnGeom': 'Y',
        'getAddrDetails': 'Y',
      }
    });
    
    let searchLat = parseFloat(postalSearch.data.results[0].LATITUDE);
    let searchLng = parseFloat(postalSearch.data.results[0].LONGITUDE);
    let searchAddress = capitaliseFirstLetter(postalSearch.data.results[0].ADDRESS.toLowerCase());
    console.log(postalSearch.data.results);

    let radius = searchRadius.value * 1000;
    if(radius == "" || radius == false){
      radius = 1000;
    }
    console.log(radius);

    // let lat=1.3505;
    // let lng=103.8727;
    // function setBoundary(lat, lng, searchLat, searchLng){
    //   //set boundary to display markers
    //   let kmConverterToDegree = 1/111;
    //   let latBoundaryTop = searchLat + 1 * kmConverterToDegree;
    //   let latBoundaryBottom = searchLat - 1 * kmConverterToDegree;
    //   let lngBoundaryRight = searchLng + 1 * kmConverterToDegree;
    //   let lngBoundaryLeft = searchLng - 1 * kmConverterToDegree;
    //   let markerBoundaryCondition = lat<latBoundaryTop && lat>latBoundaryBottom && lng<lngBoundaryRight && lng>lngBoundaryLeft;
    //   // console.log(lat,lng);
    //   console.log(searchLat,searchLng);
    //   console.log(latBoundaryTop,latBoundaryBottom,lngBoundaryRight,lngBoundaryLeft);
    //   console.log(markerBoundaryCondition);
      
    //   return;
    //   };
    // setBoundary(lat, lng, searchLat, searchLng);

    addMarker(searchLat, searchLng, searchAddress,"images-folder/searchFlat.png",60,60);
    map.setView([searchLat, searchLng], 14.5)

    addMarkerCircle(searchLat, searchLng, radius);

  });
};

