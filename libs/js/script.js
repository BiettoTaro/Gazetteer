// modal
const modal = document.getElementById("myModal");
const btn = document.getElementById("myBtn");
const span = document.getElementsByClassName("close")[0];
let border;
const roundData = data => {
  let num = Math.abs(Number(data));

  if (num >= 1.e+6) {
    return (num / 1.e+6).toFixed(2) + ' M';
  } else if (num >= 1.e+3) {
    return (num / 1.e+3).toFixed(2) + ' K';
  }
  return num;

};

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

let map = L.map('map').setView([51.505, -0.09], 13);


const gotPos = position => {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;

  $(window).ready(function () {
    $('#loader').fadeOut('slow');

    $.ajax({
      url: 'libs/php/initPosition.php',
      type: 'POST',
      dataType: 'json',
      data: {
        lat: lat,
        lng: lng
      },
      success: function (result) {



        if (result.status.name == 'ok') {
          $('#countrySelect').val(result['data']['countryCode']);
          let markers = new L.FeatureGroup();
          map.addLayer(markers);

          const marker = L.marker([lat, lng]).addTo(markers);

          map.fitBounds(markers.getBounds());

        }
      }
    });
  });

  // L.geoJSON(position).addTo(map);

  const OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 15,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

};


const fail = err => {
  let errors = {
    1: 'no permission',
    2: 'unable to determine',
    3: 'took too long'
  };
  console.log(errors[err]);
};

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

};


$(document).ready(function () {




  $(window).ready(function () {


    $.ajax({
      url: 'libs/php/countryBorder.php',
      type: 'POST',
      dataType: 'json',

      success: function (result) {



        $('#countrySelect').html('');

        $.each(result.data, function (index) {

          $('#countrySelect').append($('<option>', {
            value: result.data[index].code,
            text: result.data[index].name
          }));
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      }
    });
  });

  $('#countrySelect').change(function () {
    $.ajax({
      url: 'libs/php/borders.php',
      type: 'POST',
      dataType: 'json',
      data: {
        country: $('#countrySelect').val()

      },
      success: function (result) {


        const myLayer = L.geoJSON().addTo(map);
        if (result.status.name == 'ok') {
          if (map.hasLayer(border)) {
            map.removeLayer(border);
        }
           border = myLayer.addData(result['data'], {
            color: '#ff7800',
            weight: 2,
            opacity: 0.65
           });
          map.fitBounds(border.getBounds());
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      }
    });
  })



  $('#myBtn').click(function () {

    $.ajax({
      url: 'libs/php/getCountryInfo.php',
      type: 'POST',
      dataType: 'json',
      data: {
        country: $('#countrySelect').val()
      },
      success: function (result) {
        console.log(result);
        if (result.status.name == 'ok') {
          $('#flag').attr('src', `https://www.countryflags.io/${$('#countrySelect').val()}/flat/64.png`);
          $('#txtCountry').html(result['data'][0]['countryName']);
          $('#txtCapital').html(result['data'][0]['capital']);
          $('#txtPop').html(roundData(result['data'][0]['population']));
          $('#txtCurrency').html(result['data'][0]['currencyCode']);
          $('#wiki').attr('href', `https://en.wikipedia.org/wiki/${$('#countrySelect option:selected').text()}`);


        }
      }
    })
  });

  $('#myBtn').click(function () {
    $.ajax({
      url: 'libs/php/getWeather.php',
      type: 'POST',
      dataType: 'json',
      data: {
        city: $('#countrySelect option:selected').text()
      },
      success: function (result) {


        if (result.status.name == 'ok') {
          $('#txtTemp').html(result['data']['main']['temp'] + '°C');
          $('#txtWeather').html(result['data']['weather'][0]['description']);
        }
      }
    });



  });

  $('#myBtn').click(function () {
    $.ajax({
      url: 'libs/php/covid.php',
      type: 'POST',
      dataType: 'json',
      data: {
        country: $('#countrySelect option:selected').text()
      },
      success: function (result) {

        let data = result['data'];
        let covid = data.pop();

        if (result.status.name == 'ok') {
          $('#txtCases').html(roundData(covid['Confirmed']));
          $('#txtDeaths').html(roundData(covid['Deaths']));
        }
      }
    });
  });
});


