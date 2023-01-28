$(document).ready(function () {
  let p = "";
  let counter = 1;
  let isHeaderAdded = false;
  let selectedNationality = "US";
  let url = "https://randomuser.me/api/?results=30&nat=" + selectedNationality;

  let errorRate = 0;

  // function to update error rate from input field
  function updateErrorRate() {
    errorRate = parseFloat(document.getElementById("error-rate-input").value);
  }

  // function to update error rate from slider
  function updateErrorRateSlider() {
    errorRate = parseFloat(document.getElementById("error-rate-slider").value);
    document.getElementById("error-rate-input").value = errorRate;
  }

  // function to apply a random error type to a string
  function applyError(str) {
    // calculate number of errors to apply
    let numErrors = Math.floor(errorRate);
    if (Math.random() < errorRate - numErrors) {
      numErrors++;
    }
    //rest of your code
  }

  //event listeners
  document.getElementById("error-rate-input").addEventListener("change", updateErrorRate);
  document.getElementById("error-rate-slider").addEventListener("input", updateErrorRateSlider);

  fetchInformation(url);
  $(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() == $(document).height()) {
      fetchInformation(url);
    }
  });

  $("#seed-container").append('<input type="text" id="seed-input" placeholder="Enter seed (optional)">');
  $("#seed-container").append('<button id="seed-button" disabled>Submit</button>');
  $("#seed-input").on("input", function () {
    if ($(this).val().length == 0) {
      $("#seed-button").prop("disabled", true);
    } else {
      $("#seed-button").prop("disabled", false);
    }
  });
  $("#seed-button").on("click", function () {
    seed = $("#seed-input").val();
    if (seed) {
      url = "https://randomuser.me/api/?results=30&nat=" + selectedNationality + "&seed=" + seed;
    } else {
      url = "https://randomuser.me/api/?results=30&nat=" + selectedNationality;
    }
    $("#results").empty();
    counter = 1;
    $("#seed").text("seed is: " + seed);
    fetchInformation(url);
  });

  $("#export-csv").on("click", function () {
    let csvContent = "number,name,address,telefon number,id\n";
    $(".row").each(function () {
      let row = $(this);
      let number = row.find(".col-md-1").text();
      let name = row.find(".col-md-2 span").text();
      let address = row.find(".col-md-3 span").text();
      let phone = row.find(".col-md-2 span").text();
      let id = row.find(".col-md-3 span").text();
      csvContent += `${number},${name},${address},${phone},${id}\n`;
    });
    let blob = new Blob([csvContent], { type: "text/csv" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
  });

  $("#nationality").on("change", function () {
    selectedNationality = $("#nationality").val();
    url = "https://randomuser.me/api/?results=30&nat=" + selectedNationality;
    $("#results").empty();
    counter = 1;
    fetchInformation(url);
  });

  function fetchInformation(url) {
    fetch(url)
      .then((response) => response.json())
      .then(function (data) {
        if (!isHeaderAdded) {
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
          isHeaderAdded = true;
        }
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
      });
  }
});
