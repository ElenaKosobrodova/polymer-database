var URL ="polymer-database.json";

if (detectIE()) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", URL);
    xmlhttp.onload = function() {
      json_response = JSON.parse(xmlhttp.responseText);
      $("tbody tr").remove();
      for (var key in json_response) {
        addResultRow(key, json_response[key]);
        console.log(json_response);
      }
    };
    xmlhttp.send(JSON.stringify(parameters));
  } else {
    fetch(URL, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "same-origin", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(parameters) // body data type must match "Content-Type" header
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(calculated) {
        json_response = calculated;
        $("tbody tr").remove();
        for (let key in json_response) {
          addResultRow(key, json_response[key]);
        }
      })
      .catch(function(err) {
        console.error(err);
      });
  }


var tableBody = document.getElementById("results-table");

function addResultRow(name, value) {
  var position = 0;
  var row = tableBody.insertRow(position);
  var nameCell = row.insertCell(0);
  nameCell.innerHTML = name;
  var valueCell = row.insertCell(1);
  valueCell.innerHTML = value;
}