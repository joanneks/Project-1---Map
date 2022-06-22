
// let radioBtn2Room = document.querySelector('#room2');
// let radioBtn3Room = document.querySelector('#room3');
// let radioBtn4Room = document.querySelector('#room4');
// let radioBtn5Room = document.querySelector('#room5');
// let radioBtn2RoomValue = radioBtn2Room.value;
// let radioBtn3RoomValue = radioBtn3Room.value;
// let radioBtn4RoomValue = radioBtn4Room.value;
// let radioBtn5RoomValue = radioBtn5Room.value;



async function searchFlatTypeResults(){
  let searchFlatTypeBtn = document.querySelector('#searchFlatTypeBtn');
  let radioBtn2Room = document.querySelector('#room2');
  let radioBtn3Room = document.querySelector('#room3');
  let radioBtn4Room = document.querySelector('#room4');
  let radioBtn5Room = document.querySelector('#room5');
  let radioBtn2RoomValue = radioBtn2Room.value;
  let radioBtn3RoomValue = radioBtn3Room.value;
  let radioBtn4RoomValue = radioBtn4Room.value;
  let radioBtn5RoomValue = radioBtn5Room.value;

  searchFlatTypeBtn.addEventListener('click',async function(){

    let radioBtnValue = 0;
    if(radioBtn2Room.checked){
      radioBtnValue = radioBtn2RoomValue
    }if(radioBtn3Room.checked){
      radioBtnValue = radioBtn3RoomValue
    }if(radioBtn4Room.checked){
      radioBtnValue = radioBtn4RoomValue
    }if(radioBtn5Room.checked){
      radioBtnValue = radioBtn5RoomValue
    }console.log(radioBtnValue);

    resalePriceInfo = await searchResalePrice ();
    // console.log(resalePriceInfo);

    let searchTownOption = document.querySelector('#searchTown');
    let searchTownOptionValue = searchTownOption.value;
    let resultFalseCount = 0;

    try{
      for (let i = resalePriceInfo.length-totalDataPoint ; i <= resalePriceInfo.length;i++){
        let blkStreetName = resalePriceInfo[i].block + " " + resalePriceInfo[i].street_name;
        let monthTransacted = resalePriceInfo[i].month;
        let townTransacted = resalePriceInfo[i].town;
        let commencementYear = resalePriceInfo[i].lease_commence_date;
        let remainingYears = resalePriceInfo[i].remaining_lease;
        let lastTransactedPrice = resalePriceInfo[i].resale_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let flatArea = resalePriceInfo[i].floor_area_sqm;
        let flatStoreyRange = resalePriceInfo[i].storey_range.toLowerCase();
        
        let flatType = resalePriceInfo[i].flat_type;
        let resultsList = document.createElement("div");

        if(flatType==radioBtnValue && townTransacted==searchTownOptionValue){
          console.log(flatType);
          console.log(flatType,townTransacted);
          
            resultsList.innerHTML = `
              <div class="col px-2">
                <p id="lastTransactedAddress">${blkStreetName}</p>   
                  <table class="table table-hover table-striped" id="lastTransactedTable">
                  <tr>
                      <td>Town:</td>
                      <td>${townTransacted}</td>
                  </tr>
                  <tr>
                      <td>Sold on:</td>
                      <td>${monthTransacted}</td>
                  </tr>
                  <tr>
                      <td>Lease Commencement:</td>
                      <td>${commencementYear}</td>
                  </tr>
                  <tr>
                      <td>Remaining Years:</td>
                      <td>${remainingYears}</td>
                  </tr>
                  <tr>
                      <td>Last Transacted Price:</td>
                      <td>${lastTransactedPrice}</td>
                  </tr>
                  <tr>
                      <td>Flat Type (Area):</td>
                      <td>${flatType}, (${flatArea} sqm)</td>
                  </tr>
                  <tr>
                      <td>Flat Level Range:</td>
                      <td>${flatStoreyRange}</td>
                  </tr>
                  </table>
              </div>
            `;
            document.querySelector("#resultsListParentDiv").appendChild(resultsList);
        }
        else{
          // console.log('no result found');
          resultFalseCount++
          console.log(resultFalseCount)
          if(resultFalseCount==totalDataPoint){
            resultsList.innerHTML = `
            <div class="container-fluid p-1">No results found</div>
            `
          document.querySelector("#resultsListParentDiv").appendChild(resultsList);
          }
        }
      };    
    }catch(error){};

    let resetBtn = document.querySelector('#resetBtn');
    resetBtn.addEventListener('click',function(){
      let resultsListParentDiv = document.querySelector('#resultsListParentDiv');
      resultsListParentDiv.innerHTML = ``;
      radioBtn2Room.checked = false
      radioBtn3Room.checked = false
      radioBtn4Room.checked = false
      radioBtn5Room.checked = false
    })
  });
};

searchFlatTypeResults();
