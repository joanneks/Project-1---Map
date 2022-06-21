let supermarketLayer = L.layerGroup();

async function searchSupermarkets(latBoundaryTop,latBoundaryBottom,lngBoundaryRight,lngBoundaryLeft) {
  let response = await axios.get('geojson-folder/supermarkets.geojson');
  let allSupermarkets = response.data.features;

  //Create marker for each supermarket coordinates from geojson lat,lng
  for (supermarket of allSupermarkets) {
    let lng = supermarket.geometry.coordinates[0];
    let lat = supermarket.geometry.coordinates[1];
    let supermarketCoordinates = [lat, lng];

    //Extract Supermarket name and address from Geojson
    let divElement = document.createElement('div');
    divElement.innerHTML = supermarket.properties.Description;
    let eachSupermarketDescription = divElement.querySelectorAll('td');
    let supermarketName = capitaliseFirstLetter(eachSupermarketDescription[0].innerHTML.toLowerCase());
    let supermarketBlock = eachSupermarketDescription[1].innerHTML;
    let supermarketStreet = capitaliseFirstLetter(eachSupermarketDescription[2].innerHTML.toLowerCase());
    let supermarketPostalCode = eachSupermarketDescription[4].innerHTML;
    let supermarketAddress = (supermarketBlock + " " + supermarketStreet + ", S" + supermarketPostalCode);

    if(lat<latBoundaryTop && lat>latBoundaryBottom && lng<lngBoundaryRight && lng>lngBoundaryLeft){
      //set marker icon
      var supermarketIcon = L.icon({
        iconUrl: "images-folder/supermarket.png",
        iconSize: [55, 55],
        iconAnchor: [5, 5]
      });
      // create marker and add to supermarketLayer, set bindpopup
      let supermarketMarker = L.marker(supermarketCoordinates, { icon: supermarketIcon });
      supermarketMarker.addTo(supermarketLayer);
      supermarketMarker.bindPopup(`
        <p class="supermarketPopupHeader">${supermarketName}</p>
        <p class="supermarketPopup">Address: ${supermarketAddress}</p>
        `);
    };
  };
};