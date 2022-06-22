//create map global variable --> other functions require this variable
let map = createMap();

let collapsible = document.getElementsByClassName("collapsible");

for (i = 0; i < collapsible.length; i++) {
  collapsible[i].addEventListener("click", function() {
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}


//faq Popup
let faq = document.querySelector('#faq');
faq.addEventListener('click',function(){
    let faqAccordion = document.querySelector('#faqAccordion');
    faqAccordion.innerHTML = `
            <div class="accordion-item">
            <div>
            <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button bg-info text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" style="font-size:large;">
                    FAQs (Frequently Asked Questions)</button><button type="button" class="btn btn-danger" id="closeBtn" style="width:65px;" aria-label="Close">X</button>
            </h2>
            
                <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div class="accordion-body" id="faqAccordionScroll">
                        <article>
                                <section>
                                    <h2>Our Aim</h2>
                                    <p>To help resale/SBF/BTO flat buyers with their house search and purchase considerations</p>
                                </section>
                                <section>
                                    <h2>How to Navigate</h2>
                                    <p>Objective: to determine if the considered flat location has what you need and is worth the price</p>
                                        <ol>
                                            <li class="faqList">Key in and search for the postal code and distance that you would like to view the surrounding amenities within</li>
                                            <li class="faqList">Hover over the square icon on the top right of the map and select the items that you would like to view.</li>
                                            <ul>
                                                <li class="faqList">Select Last transacted flats to view the recent resale flat transactions within the distance set.</li>
                                                <li class="faqList">This will provide you with the last transacted price, lease commencement year, flat type/area and other information</li>
                                            </ul>
                                            <li class="faqList">Check if you are eligible for the HDB Proximity Housing Grant (PHC)</li>
                                                <ul>
                                                    <li class="faqList">Make 2 searches by postal code within 4km, one for your parent's house and one for the desired flat block.</li>
                                                    <li class="faqList">If the circle overlaps, it means you are satisfy the criteria of being 4km from your parent's house.</li>
                                                    <li class="faqList">For more information on this grant, refer to <a href ="https://www.hdb.gov.sg/cs/infoweb/residential/buying-a-flat/flat-and-grant-eligibility/couples-and-families/proximity-housing-grant-families" target=”_blank”>HDB's PHC website</a>.</li>
                                                </ul>
                                            <li class="faqList">Select the Town and Flat Type to display the list of last transacted flats by that criteria</li>
                                            <ul>
                                                <li class="faqList">This will provide you with the last transacted price, lease commencement year, flat type/area and other information.</li>
                                                <li class="faqList">This will provide you with gauge on the budget you will need to buy the desired flat type in that town</li>
                                            </ul>
                                        </ol>    
                                    </p>
                                </section>
                                <section>
                                    <p><h2>Food For Thought</h2></p>
                                        <ol>
                                            <li class="faqList">From the last transacted flat details, is the seller's asking price too high? </li>
                                            <li class="faqList">Is the potential price that you might pay worth the location and the surrounding amenities?</li>
                                            <li class="faqList">Should you consider another resale flat listing or another town for something cheaper or more affordable for your budget?</li>
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
        faqAccordion.innerHTML = `
        <div class="accordion-item" style="display:none"></div>
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
    searchNearby(searchLat,searchLng,radius,15007,dentalClinicLayer,"images-folder/dentalClinic.png")
    searchNearby(searchLat,searchLng,radius,15011,medicalClinicLayer,"images-folder/medicalClinic.png")
    searchNearby(searchLat,searchLng,radius,15014,hospitalLayer,"images-folder/hospital.png")

    try{
    await searchLastTransacted(latBoundaryTop,latBoundaryBottom,lngBoundaryRight,lngBoundaryLeft);
    } catch(err){}

})


let clearResultsBtn = document.querySelector('#clearResultsBtn');
clearResultsBtn.addEventListener('click',function(){
    lastTransactedLayer.clearLayers();
    supermarketLayer.clearLayers();
    trainLayer.clearLayers();
    nurseryLayer.clearLayers();
    preschoolLayer.clearLayers();
    primarySchoolLayer.clearLayers();
    secondarySchoolLayer.clearLayers();
    foodLayer.clearLayers();
    searchFlatLayer.clearLayers();
    dentistLayer.clearLayers();
    medicalClinicLayer.clearLayers();
    hospitalLayer.clearLayers();
});


let primarySchoolLayer = L.layerGroup();
let secondarySchoolLayer = L.layerGroup();
let nurseryLayer = L.layerGroup();
let preschoolLayer = L.layerGroup();
let foodLayer = L.layerGroup();
let dentalClinicLayer = L.layerGroup();
let medicalClinicLayer = L.layerGroup();
let hospitalLayer = L.layerGroup();

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
    'Dental Clinic':dentalClinicLayer,
    'Medical Clinic':medicalClinicLayer,
    'Hospital':hospitalLayer,
    'Food and Beverage':foodLayer
}

L.control.layers(baseLayers,overlays).addTo(map);

