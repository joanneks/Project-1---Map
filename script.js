let map = createMap();
searchFlatbyPostalCode();
searchSupermarkets();
searchTrainStations();

let baseLayers = {
    'Searched Flats':searchFlatLayer
}
let overlays = {
    'Resale Flats Last Transacted':lastTransactedLayer,
    'Supermarkets':supermarketLayer,
    'Trains':trainLayer
}
L.control.layers(baseLayers,overlays).addTo(map);