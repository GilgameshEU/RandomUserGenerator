$(document).ready(function () {
  let p = "";
  let counter = 1;
  let isHeaderAdded = false;
  let selectedNationality = "US";
  let url = "https://randomuser.me/api/?results=30&nat=" + selectedNationality;
  let errorRate = 0;
  let test = 0;

  let field = document.getElementById("error-rate-input");
  let slider = document.getElementById("error-rate-slider");
  let submitBtn = document.getElementById("seed-button");

  // function to update error rate from input field
  function updateErrorRate() {
    errorRate = parseFloat(document.getElementById("error-rate-input").value);
  }

  // function to update error rate from slider
  function updateErrorRateSlider() {
    errorRate = parseFloat(document.getElementById("error-rate-slider").value);
    document.getElementById("error-rate-input").value = errorRate;
  }

  // // function to apply a random error type to a string
  // function applyError(str) {
  //   // calculate number of errors to apply
  //   let numErrors = Math.floor(errorRate);
  //   if (Math.random() < errorRate - numErrors) {
  //     numErrors++;
  //   }
  //   //rest of your code
  // }

  //event listeners
  // update the slider value based on the field value
  field.addEventListener("change", function () {
    let value = parseInt(field.value);
    if (value > 1000) {
      field.value = 1000;
    } else {
      field.value = value;
    }

    slider.value = value;
  });

  // update the field value based on the slider value
  slider.addEventListener("change", function () {
    field.value = slider.value;
  });

  // function to apply a random error type to a string
  function applyError(str, errorRate) {
    // calculate number of errors to apply
    let numErrors = Math.floor(errorRate);
    if (Math.random() < errorRate - numErrors) {
      numErrors++;
    }
    // make a copy of the original string
    let newStr = str;
    // apply errors
    for (let i = 0; i < numErrors; i++) {
      // randomly select an error type
      let errorType = Math.floor(Math.random() * 3);
      // apply error type
      switch (errorType) {
        case 0:
          newStr = deleteError(newStr);
          break;
        case 1:
          newStr = addError(newStr);
          break;
        case 2:
          newStr = transposeError(newStr);
          break;
      }
    }
    return newStr;
  }

  // function to handle deletion errors
  function deleteError(str) {
    // select a random position to delete a character
    let pos = Math.floor(Math.random() * str.length);
    // delete the character
    return str.slice(0, pos) + str.slice(pos + 1);
  }

  // function to handle addition errors
  function addError(str) {
    // select a random position to add a character
    let pos = Math.floor(Math.random() * (str.length + 1));
    // randomly select a character to add
    let alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
    let char = alphabet[Math.floor(Math.random() * alphabet.length)];
    // add the character
    return str.slice(0, pos) + char + str.slice(pos);
  }

  // function to handle transposition errors
  function transposeError(str) {
    // select two random positions to transpose characters
    let pos1 = Math.floor(Math.random() * str.length);
    let pos2 = (pos1 + 1) % str.length;
    // transpose the characters
    return str.slice(0, pos1) + str[pos2] + str.slice(pos1 + 1, pos2) + str[pos1] + str.slice(pos2 + 1);
  }

  fetchInformation(url);
  $(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() == $(document).height()) {
      fetchInformation(url);
    }
  });

  $("#seed-container").append('<input type="text" id="seed-input" placeholder="Enter seed (optional)">');
  submitBtn.addEventListener("click", function () {
    updateErrorRate();
    let seed = document.getElementById("seed-input").value;
    if (!seed) {
      test = 1;
      location.reload();
    }
  });

  $("#seed-button").on("click", function () {
    seed = $("#seed-input").val();
    errorRate = field.value;
    if (seed) {
      url = "https://randomuser.me/api/?results=30&nat=" + selectedNationality + "&seed=" + seed;
    } else {
      url = "https://randomuser.me/api/?results=30&nat=" + selectedNationality;
    }
    $("#results").empty();
    counter = 1;
    fetchInformation(url);
    $("#seed").text("seed is: " + seed);
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
        console.log(errorRate);
        console.log(applyError("Hello world", errorRate));
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
