function searchFlat(lat,lng,address){
    let searchMarker = L.marker([lat,lng]);
    searchMarker.addTo(map);
    searchMarker.bindPopup(`
    <p>${address}</p>
    `)
    map.setView([lat,lng],13)
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
    let lat = postalSearch.data.results[0].LATITUDE;
    let lng = postalSearch.data.results[0].LONGITUDE;
    let address = postalSearch.data.results[0].ADDRESS;
    // let blkRoadName = postalSearch.data.results[0].BLK_NO + postalSearch.data.results[0].ROAD_NAME;
    console.log(postalSearch.data.results);
    if(lat==undefined||lng==undefined||address==undefined){
        let noResultsDiv = document.querySelector('#noResultsDiv').innerHTML;
        noResultsDiv="No results found. Key in postal code for accuracy.";
    } else{
        
      searchFlat(lat,lng,address);
    }
  });
};

