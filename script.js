$(document).ready(function () {
  let url = "https://randomuser.me/api/?results=20&nat=";
  let p = "";
  let counter = 1;
  let loadMore;
  fetchInformation(url);
  function fetchInformation(url) {
    fetch(url)
      .then((response) => response.json())
      .then(function (data) {
        let seed = data.info.seed;
        $("#seed").append(seed);
        $("#results").append(
          `<div class="row" > 
          <div class="col-md-1 ">number</div>
           <div class="col-md-1">photo</div>
            <div class="col-md-2">name</div>
             <div class="col-md-3">address</div>
              <div class="col-md-2">telefon number</div>
               <div class="col-md-3">id</div>
           </div>`
        );
        data.results.forEach((person) => {
          p = `<div class="row"> 
          <div class="col-md-1 border border-black">${counter}</div>
           <div class="col-md-1 border border-black"> <img src="${person.picture.thumbnail}" class="img-rounded"> </div> 
            <div class="col-md-2 border border-black"> <span>${person.name.first} ${person.name.last}</span> </div> 
             <div class="col-md-3 border border-black"> <span>${person.location.state}, ${person.location.city}, ${person.location.street.name}, ${person.location.street.number}</span> </div>
              <div class="col-md-2 border border-black"> <span>${person.phone}</span> </div> 
               <div class="col-md-3 border border-black"> <span>${person.login.uuid}</span> </div> 
            </div>`;
          $("#results").append(p);
          counter++;
        });

        loadMore = `<button id="loadMore" class="btn btn-primary">Load More</button>`;
        $("#results").append(loadMore);

        $("#loadMore").on("click", function () {
          fetchInformation(url);
          $(this).remove();
        });
      });
  }
});
