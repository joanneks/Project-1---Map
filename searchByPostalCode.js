function searchFlat(lat,lng,address){
    let searchMarker = L.marker([lat,lng]);
    searchMarker.addTo(map);
    searchMarker.bindPopup(`<p>${address}</p>`)
}

const BASE_API_URL1 = "https://developers.onemap.sg/commonapi/search";
async function onemapSearch(){
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
    // console.log(postalSearch.data);
    // console.log(postalSearch.data.results[0].ADDRESS);
    let lat = postalSearch.data.results[0].LATITUDE;
    let lng = postalSearch.data.results[0].LONGITUDE;
    let address = postalSearch.data.results[0].ADDRESS;
    searchFlat(lat,lng,address);
  });
};
onemapSearch();
