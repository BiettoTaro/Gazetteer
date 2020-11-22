// modal
const modal = document.getElementById("myModal");
const btn = document.getElementById("myBtn");
const span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
  modal.style.display = "block";
};

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  };
};

const gotPos = position => {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;

  const map = L.map('map').setView([lat, lng], 13);
  const OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  const marker = L.marker([lat, lng]).addTo(map);
}

const fail = err => {
  let errors = {
    1: 'no permission',
    2: 'unable to determine',
    3: 'took too long'
  };
  console.log(errors[err]);
}




$(document).ready(function () {
  $(window).load(function() {
		// Animate loader off screen
		$("#loader").fadeOut("slow");;
	});
  
  if (navigator.geolocation) {
    let giveUp = 1000 * 30;
    let tooOld = 1000 * 60 * 5;
    let options = {
      enableHighAccuracy: true,
      timeout: giveUp,
      maximumAge: tooOld
    }
    navigator.geolocation.getCurrentPosition(gotPos, fail, options);
  } else {
    // hard coded coordinates?
  };

  $('#map').click(event => {
    console.log(event);

    $.ajax({
      url: 'libs/php/countryBorder.php',
      type: 'POST',
      dataType: 'json',
      data: {

      },

      success: function (result) {
        console.log(result);


        if (result.status.name == 'ok') {
          $('#countries').html(result['data']['name']);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      }
    });
  });



});


