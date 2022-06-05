async function searchResale(blkRoadName){
    const BASE_API_URL2 ="https://data.gov.sg/api/action/datastore_search";
    const resource_id = "f1765b54-a209-4718-8d38-a39237f502b3";
    let resalePriceData = await axios.get(BASE_API_URL2,{
        'params': {
          'resource_id': resource_id,
            'limit': 10
            // 'limit': 127935
        }
    });
    let resalePriceInfo = resalePriceData.data.result.records;
    for (let i = 0; i <= resalePriceInfo.length;i++){
        let blkStreetName = resalePriceInfo[i].block + " " + resalePriceInfo[i].street_name;
        let commencementYear = resalePriceInfo[i].lease_commence_date;
        console.log(blkStreetName);
        console.log(commencementYear);

    }
    // let resaleBlock = resalePriceData.data.result.records[0].block;
    // let resaleStreet = resalePriceData.data.result.records[0].street_name
    // console.log(resalePriceData.data.result.records[0].block);
    // console.log(resalePriceData.data.result.records[0].street_name);
    // console.log(resalePriceData.data.result.records[0].lease_commence_date);
}

searchResale();