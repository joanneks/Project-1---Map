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
  searchMarker.bindPopup(`
  <p class="searchFlatPopup">${address}</p>
  `)

}

function addMarkerCircle(lat, lng, radius){
  //create circle marker for radius
  let searchMarkerCircle = L.circle([lat, lng], { radius: radius });
  searchMarkerCircle.addTo(map);
};

async function searchFlatbyPostalCode(searchVal,searchRadius){
  const BASE_API_URL = "https://developers.onemap.sg/commonapi/search";
  let postalSearch = await axios.get(BASE_API_URL, {
      'params': {
        'searchVal': searchVal,
        'returnGeom': 'Y',
        'getAddrDetails': 'Y',
      }
    });
    
    let searchLat = parseFloat(postalSearch.data.results[0].LATITUDE);
    let searchLng = parseFloat(postalSearch.data.results[0].LONGITUDE);
    let searchLatLng = [searchLat,searchLng];
    let searchAddress = capitaliseFirstLetter(postalSearch.data.results[0].ADDRESS.toLowerCase());
    console.log(postalSearch.data.results);

    let radius = searchRadius * 1000;
    if(radius == "" || radius == false){
      radius = 1000;
    }

    addMarker(searchLat, searchLng, searchAddress,"images-folder/searchFlat.png",60,60);
    map.setView([searchLat, searchLng], 14.5)
}