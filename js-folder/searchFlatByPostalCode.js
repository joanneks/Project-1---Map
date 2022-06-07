function searchFlat(lat,lng,address){
  //set marker icon
  var searchFlatIcon = L.icon({
    iconUrl: "images-folder/searchFlat.png",
    iconSize: [60, 60]
  });    
  
  // create marker and add to map
  let searchMarker = L.marker([lat,lng], {icon: searchFlatIcon,zIndexOffset:1000});
    searchMarker.addTo(map);
    searchMarker.bindPopup(`<p>${address}</p>`)
    map.setView([lat,lng],13)
}

async function searchFlatbyPostalCode(){
  const BASE_API_URL1 = "https://developers.onemap.sg/commonapi/search";
  let searchBtn = document.querySelector('#searchBtn');
  let searchVal = document.querySelector('#postalCodeSearch')

  searchBtn.addEventListener('click',async function(){
    alert('clicked');
    let postalSearch = await axios.get(BASE_API_URL1,{
      'params':{
        'searchVal':searchVal.value,
        'returnGeom':'Y',
        'getAddrDetails':'Y',
      }
    });  

    let lat = postalSearch.data.results[0].LATITUDE;
    let lng = postalSearch.data.results[0].LONGITUDE;
    let address = postalSearch.data.results[0].ADDRESS;
    console.log(postalSearch.data.results);

    searchFlat(lat,lng,address);
  });
};

