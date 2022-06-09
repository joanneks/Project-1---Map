async function searchLastTransacted(blkRoadName){
    const BASE_API_URL ="https://data.gov.sg/api/action/datastore_search";
    const resource_id = "f1765b54-a209-4718-8d38-a39237f502b3";
    let resalePriceData = await axios.get(BASE_API_URL,{
        'params': {
          'resource_id': resource_id,
            'limit': 100
            // 'limit': 127935
        }
    });
    let resalePriceInfo = resalePriceData.data.result.records;
    let lastTransactedClusterLayer = L.markerClusterGroup();

    for (let i = 0; i <= resalePriceInfo.length;i++){
      let blkStreetName = resalePriceInfo[i].block + " " + resalePriceInfo[i].street_name;
      let commencementYear = resalePriceInfo[i].lease_commence_date;
      let remainingYears = resalePriceInfo[i].remaining_lease;
      let lastTransactedPrice = resalePriceInfo[i].resale_price;
      let flatType = capitaliseFirstLetter(resalePriceInfo[i].flat_type.toLowerCase());
      let flatArea = resalePriceInfo[i].floor_area_sqm;
      let flatStoreyRange = resalePriceInfo[i].storey_range.toLowerCase();
      // console.log(blkStreetName);
      // console.log(commencementYear);
      async function searchLastTransactedPostalCode(blkStreetName) {
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

          //set marker icon  
          let lastTransactedIcon = L.icon({
            iconUrl: "images-folder/lastTransacted.png",
            iconSize: [40,40]
          });
        
          // create marker and add to map
          let lastTransactedMarker = L.marker([lat, lng], { icon: lastTransactedIcon});
          lastTransactedMarker.addTo(map);
          lastTransactedMarker.bindPopup(`
          <p>${address}</p>
          <p>Lease Commencement Year: ${commencementYear}</p>
          <p>Remaining Years: ${remainingYears}</p>
          <p>Last Transacted Price: ${lastTransactedPrice}</p>
          <p>Flat Type: ${flatType}</p>
          <p>Flat Area: ${flatArea} sqm</p>
          <p>Flat Level Range: ${flatStoreyRange}</p>
          `)
          lastTransactedMarker.addTo(lastTransactedClusterLayer);
      };
      searchLastTransactedPostalCode(blkStreetName);
      lastTransactedClusterLayer.addTo(map);
               
    }
    // let resaleBlock = resalePriceData.data.result.records[0].block;
    // let resaleStreet = resalePriceData.data.result.records[0].street_name
    // console.log(resalePriceData.data.result.records[0].block);
    // console.log(resalePriceData.data.result.records[0].street_name);
    // console.log(resalePriceData.data.result.records[0].lease_commence_date);
}

searchLastTransacted();