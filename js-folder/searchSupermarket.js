async function searchForSupermarkets(){
  let response = await axios.get('supermarkets.geojson');
  let allSupermarkets = response.data.features;
  let supermarketClusterLayer = L.markerClusterGroup();

  //Create marker for each supermarket coordinates from geojson lat,lng
  for (supermarket of allSupermarkets){
    let lng = supermarket.geometry.coordinates[0];
    let lat = supermarket.geometry.coordinates[1];
    let supermarketCoordinates = [lat,lng];

    //set marker icon
    var supermarketIcon = L.icon({
      iconUrl: "images-folder/supermarket2.png",
      iconSize: [50, 50],
      iconAnchor: [10,5]
    });
    let supermarketMarker = L.marker(supermarketCoordinates,{icon:supermarketIcon})
    
    //Extract Supermarket name and address from Geojson
    let divElement = document.createElement('div');
    divElement.innerHTML = supermarket.properties.Description;
    let eachSupermarketDescription = divElement.querySelectorAll('td');
    let supermarketName = capitaliseFirstLetter(eachSupermarketDescription[0].innerHTML.toLowerCase());
    let supermarketBlock = eachSupermarketDescription[1].innerHTML;
    let supermarketStreet = capitaliseFirstLetter(eachSupermarketDescription[2].innerHTML.toLowerCase());  
    let supermarketPostalCode = eachSupermarketDescription[4].innerHTML;
    let supermarketAddress = (supermarketBlock + " " + supermarketStreet + ", S" + supermarketPostalCode);
      
    //Add to supermarketClusterLayer
      supermarketMarker.addTo(supermarketClusterLayer);
      supermarketMarker.bindPopup(`
        <p>${supermarketName}</p>
        <p>Address: ${supermarketAddress}</p>
        `)
  };
  supermarketClusterLayer.addTo(map);
};
