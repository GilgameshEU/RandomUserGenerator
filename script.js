$(document).ready(function () {
  let p = "";
  let counter = 1;
  let isHeaderAdded = false;
  let selectedNationality = "US";
  let url = "https://randomuser.me/api/?results=30&nat=" + selectedNationality;
  let errorRate = 0;

  let field = document.getElementById("error-rate-input");
  let slider = document.getElementById("error-rate-slider");
  let submitBtn = document.getElementById("seed-button");

  // function to update error rate from input field
  function updateErrorRate() {
    errorRate = parseFloat(document.getElementById("error-rate-input").value);
  }

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

  field.addEventListener("keypress", function (event) {
    if (event.key === "Enter" && field.value === "") {
      field.value = 0;
      slider.value = 0;
    }
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
    if (selectedNationality === "BR") {
      alphabet = "abcdefghijlmnopqrstuvxz0123456789áâãàçéêíóôõú";
    } else {
      if (selectedNationality === "FR") {
        alphabet = "abcdefghijklmnopqrstuvwxyz0123456789éàùêâôîûëïüÿçœæ";
      }
    }
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

  $("#seed-button").on("click", function () {
    seed = $("#seed-input").val();
    updateErrorRate();
    if (seed) {
      url = "https://randomuser.me/api/?results=30&nat=" + selectedNationality + "&seed=" + seed;
    } else {
      url = "https://randomuser.me/api/?results=30&nat=" + selectedNationality;
    }

    if (field.value === "") {
      field.value = 0;
      slider.value = 0;
    }
    $("#results").empty();
    counter = 1;
    fetchInformation(url);
    $("#seed").text("Current seed is: ");
    isHeaderAdded = false;
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
    $("#seed").text("Current seed is: ");
  });

  function fetchInformation(url) {
    fetch(url)
      .then((response) => response.json())
      .then(function (data) {
        let seed = data.info.seed;

        if (!isHeaderAdded) {
          $("#seed").append(seed);
          $("#results").append(
            `<div class="row" > 
            <div class="col-md-1 " style="font-weight: bold">number</div>
             <div class="col-md-1" style="font-weight: bold">photo</div>
              <div class="col-md-2" style="font-weight: bold">name</div>
               <div class="col-md-3" style="font-weight: bold">address</div>
                <div class="col-md-2" style="font-weight: bold">telefon number</div>
                 <div class="col-md-3" style="font-weight: bold">id</div>
             </div>`
          );
          isHeaderAdded = true;
        }
        data.results.forEach((person) => {
          p = `<div class="row">   
          <div class="col-md-1 border border-black">${counter}</div>
           <div class="col-md-1 border border-black"> <img src="${person.picture.thumbnail}" class="img-rounded"> </div> 
            <div class="col-md-2 border border-black"> <span>${applyError(person.name.first, errorRate)} ${applyError(person.name.last, errorRate)}</span> </div> 
             <div class="col-md-3 border border-black"> <span>${applyError(person.location.state, errorRate)}, ${applyError(person.location.city, errorRate)}, ${applyError(person.location.street.name, errorRate)}, ${person.location.street.number}</span> </div>
              <div class="col-md-2 border border-black"> <span>${applyError(person.phone, errorRate)}</span> </div> 
               <div class="col-md-3 border border-black"> <span>${applyError(person.login.uuid, errorRate)}</span> </div> 
            </div>`;
          $("#results").append(p);
          counter++;
        });
      });
  }
});
