//create map global variable --> other functions require this variable
let map = createMap();


document.querySelector('#searchBtn').addEventListener('click',async function(){
    //retrieve User input:postal code and radius
    let searchVal = document.querySelector('#searchPostalCode').value;
    let searchRadius = document.getElementById('searchRadius').value; 
    //API search from onemap for lat, lng, address
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
    // let searchLatLng = [searchLat,searchLng];
    let searchAddress = capitaliseFirstLetter(postalSearch.data.results[0].ADDRESS.toLowerCase());
    console.log(postalSearch.data.results);

    // add marker to postal code search lat and lng result
    addMarker(searchLat, searchLng, searchAddress,"images-folder/searchFlat.png",60,60);
    map.setView([searchLat, searchLng], 14.5)

    //convert user input radius from km to m
    let radius = searchRadius * 1000;
    if(radius == NaN || radius == false){
        radius = 1000;
    } else{
        radius = searchRadius*1000;
    };
    if(searchRadius == NaN || searchRadius == false){
        searchRadius = 1;
    } else{
        searchRadius = searchRadius;
    };
    // add circle marker to display to user for reference
    addMarkerCircle(searchLat, searchLng, radius);

    //set Boundary to display other markers
    let kmToDegreeConverter = 1/111
    let latBoundaryTop = parseFloat(searchLat) + parseFloat(searchRadius*kmToDegreeConverter);
    let latBoundaryBottom = parseFloat(searchLat) - parseFloat(searchRadius*kmToDegreeConverter);
    let lngBoundaryRight = parseFloat(searchLng) + parseFloat(searchRadius*kmToDegreeConverter);
    let lngBoundaryLeft = parseFloat(searchLng)- parseFloat(searchRadius*kmToDegreeConverter);
    // console.log(latBoundaryTop,latBoundaryBottom,lngBoundaryRight,lngBoundaryLeft);

    await searchSupermarkets();
    await searchTrainStations();

    //extract out mrt details for the marker and bindpop
    for (eachMrt of mrtArr) {
        console.log(eachMrt)
        let stationName = eachMrt.mrtName;
        let lat = eachMrt.mrtLat;
        let lng = eachMrt.mrtLng;
        let stationNo = "";

        //needs the for loop because the stationNo is in an array in mrtArr(object)
        //Serangoon has 2 mrt station no. the for loop combines the 2 and adds it the stationNo which was declared as an empty string
        for (let i = 0; i < 3; i++) {
        if (i < eachMrt.mrtNo.length) {
            stationNo += eachMrt.mrtNo[i] + ", ";
        };
        };
        stationNo = stationNo.slice(0, stationNo.length - 2);


        //show markers that are within the radius set by user. Refer to script.js file
        function showTrainMarkers (){
            // console.log("called")
            // console.log(latBoundaryTop,latBoundaryBottom,lngBoundaryRight,lngBoundaryLeft);
            if(lat<latBoundaryTop && lat>latBoundaryBottom && lng<lngBoundaryRight && lng>lngBoundaryLeft){
                console.log("ifblock")
                //set marker icon
                let trainIcon = L.icon({
                iconUrl: "images-folder/train.png",
                iconSize: [40, 40]
                });

                // create marker and add to trainLayer, set bindpopup
                let trainMarker = L.marker([lat, lng], { icon: trainIcon });
                trainMarker.addTo(trainLayer);
                trainMarker.bindPopup(`
                <p>${stationName}</p>
                <p>Station No: ${stationNo}</p>
                `);
                // trainMarker.addTo(map);
                
            }
        }
        showTrainMarkers();
    };
    
    await searchLastTransacted();
})


//Create toggle for layers
let baseLayers = {
    'Searched Flats':searchFlatLayer
}
let overlays = {
    'Resale Flats Last Transacted':lastTransactedLayer,
    'Supermarkets':supermarketLayer,
    'Trains':trainLayer
}
L.control.layers(baseLayers,overlays).addTo(map);
