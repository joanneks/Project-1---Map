
async function searchNearby(searchLat,searchLng,radius,categories,nearbyLayer,iconUrl){
    const BASE_API_URL = "https://api.foursquare.com/v3/places/search";
    const API_KEY = "fsq3zLslypYNcMYca6vWG1Xe6B3Ku195248+OERXSg+36HY=";
    let response = await axios.get(BASE_API_URL,{
        'params': {
            'll': searchLat + "," + searchLng,
            'radius':radius,
            'categories': categories,
            'limit':50
        },
        'headers':{
            'Accept':'application/json',
            'Authorization': API_KEY
        }
    });
    let data = response.data.results;
    for (each of data){
        let lat = each.geocodes.main.latitude;
        let lng = each.geocodes.main.longitude;
        let name = each.name;
        let address = each.location.formatted_address

        function nearbyMarker() {
            //set marker icon
            let nearbyIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: [40,40]
            });
        
            // create marker and add to map
            let nearbyMarker = L.marker([lat, lng], { icon: nearbyIcon });
            nearbyMarker.addTo(nearbyLayer);
            nearbyMarker.bindPopup(`
            <p><h5 class="searchNearbyPopupHeader">${name}</h5></p>
            <p class="searchNearbyPopup">Address: ${address}</p>
            `)
        }
        nearbyMarker()
    }
};
