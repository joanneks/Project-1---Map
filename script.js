//create map global variable --> other functions require this variable
let map = createMap();

//About Us Popup
let aboutUs = document.querySelector('#aboutUs');
aboutUs.addEventListener('click',function(){
    // alert('About US clicked');
    let visionMission = document.querySelector('#visionMission');
    visionMission.innerHTML = `
            <div class="accordion-item">
            <div>
            <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button bg-info text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    Our Vision and Mission</button><button type="button" class="btn btn-danger" id="closeBtn" style="width:65px;" aria-label="Close">X</button>
            </h2>
            
                <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div class="accordion-body" id="visionMissionScroll" style="max-height:400px;width:auto;overflow-y:auto;">
                        <article alt="Our Vision and Mission">
                                <section>
                                    <h2>Our Vision</h2>
                                    <p>To be Singapore's number one tool in helping resale flat buyers with their purchase considerations</p>
                                </section>
                                <section>
                                    <h2>Our Mission</h2>
                                    <p>Providing relevant information, such as last transacted prices and amenities within a certain radius, to help resale flat buyers:</p>
                                        <ol>
                                            <li class="missionList">Determine the price benchmarks that sellers might be expecting</li>
                                            <li class="missionList">Determine if the seller is selling above the average price for that area</li>
                                            <li class="missionList">Determine if the amenities/transport system nearby is what they desire</li>
                                            <li class="missionList">Come to a conclusion if the price is worth for the degree of convenience/inconvenience</li>
                                        </ol>    
                                    </p>
                                </section>
                        </article>
                    </div>
                </div>
            </div>
    `
    
    
    let closeBtn = document.querySelector('#closeBtn');
    closeBtn.addEventListener('click',function(){
        visionMission.innerHTML = `
        <div class="accordion-item" style="display:none">
        <div>
        <h2 class="accordion-header" id="headingOne">
            <button class="accordion-button bg-info text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                Our Vision and Mission</button><button type="button" class="btn btn-danger" id="closeBtn" style="width:65px;" aria-label="Close">X</button>
        </h2>
        
            <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                <div class="accordion-body" id="visionMissionScroll" style="max-height:400px;width:auto;overflow-y:auto;">
                    <article alt="Our Vision and Mission">
                            <section>
                                <h2>Our Vision</h2>
                                <p>To be Singapore's number one tool in helping resale flat buyers with their purchase considerations</p>
                            </section>
                            <section>
                                <h2>Our Mission</h2>
                                <p>Providing relevant information, such as last transacted prices and amenities within a certain radius, to help resale flat buyers:</p>
                                    <ol>
                                        <li class="missionList">Determine the price benchmarks that sellers might be expecting</li>
                                        <li class="missionList">Determine if the seller is selling above the average price for that area</li>
                                        <li class="missionList">Determine if the amenities/transport system nearby is what they desire</li>
                                        <li class="missionList">Come to a conclusion if the price is worth for the degree of convenience/inconvenience</li>
                                    </ol>    
                                </p>
                            </section>
                    </article>
                </div>
            </div>
        </div>
`        
    });
    });

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
    let searchAddress = capitaliseFirstLetter(postalSearch.data.results[0].ADDRESS.toLowerCase());
    console.log(postalSearch.data.results);

    // add marker to postal code search lat and lng result
    addMarker(searchLat, searchLng, searchAddress,"images-folder/searchFlat.png",60,60);
    map.setView([searchLat, searchLng], 14.5)

    //convert user input radius from km to m for circle marker in searchFlatByPostalCode.js
    let radius = searchRadius * 1000;
    if(radius == NaN || radius == false){
        radius = 1000;
    } else{
        radius = searchRadius*1000;
    };
    //determine radius as default 1km without user input to set boundary
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

    await searchSupermarkets(latBoundaryTop,latBoundaryBottom,lngBoundaryRight,lngBoundaryLeft);


    //retrieve all mrt station details
    await searchTrainStations();

    //extract out all mrt details for the marker and bindpop
    //show train markers within the set boundary
    for (eachMrt of mrtArr) {
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
        showTrainMarkers(stationName,stationNo,lat,lng,latBoundaryTop,latBoundaryBottom,lngBoundaryRight,lngBoundaryLeft);
    };
    
    searchNearby(searchLat,searchLng,radius,12059,secondarySchoolLayer,"images-folder/secondarySchool.png")
    searchNearby(searchLat,searchLng,radius,12058,primarySchoolLayer,"images-folder/primarySchool.png")
    searchNearby(searchLat,searchLng,radius,12055,nurseryLayer,"images-folder/nursery.png")
    searchNearby(searchLat,searchLng,radius,12056,preschoolLayer,"images-folder/preschool.png")
    searchNearby(searchLat,searchLng,radius,13000,foodLayer,"images-folder/food.png")

    try{
    await searchLastTransacted(latBoundaryTop,latBoundaryBottom,lngBoundaryRight,lngBoundaryLeft);
    } catch(err){}



})



let primarySchoolLayer = L.layerGroup();
let secondarySchoolLayer = L.layerGroup();
let nurseryLayer = L.layerGroup();
let preschoolLayer = L.layerGroup();
let foodLayer = L.layerGroup();

//Create toggle for layers
let baseLayers = {
    'Searched Flats':searchFlatLayer
}
let overlays = {
    'Resale Flats Last Transacted':lastTransactedLayer,
    'Supermarkets':supermarketLayer,
    'Trains':trainLayer,
    'Nurseries':nurseryLayer,
    'Preschools':preschoolLayer,
    'Primary Schools':primarySchoolLayer,
    'Secondary Schools':secondarySchoolLayer,
    'Food and Beverage':foodLayer
}

L.control.layers(baseLayers,overlays).addTo(map);

