// modal
const details = document.getElementById("myModal");
const virus = document.getElementById("virus");
const news = document.getElementById("news");
const weather = document.getElementById("weather");
const images = document.getElementById("images");
const currency = document.getElementById("currency");


const btn = document.getElementById("myBtn");
const span = document.getElementsByClassName("close");

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

const countryInfo = () => {
  $.ajax({
    url: 'libs/php/getCountryInfo.php',
    type: 'POST',
    dataType: 'json',
    data: {
      country: $('#countrySelect').val()
    },
    success: function (result) {

      if (result.status.name == 'ok') {
        $('#flag').attr('src', `https://www.countryflags.io/${$('#countrySelect').val()}/flat/64.png`);
        $('#txtCountry').html(result.data[0].countryName);
        $('#txtCapital').html(result.data[0].capital);
        $('#txtPop').html(roundData(result.data[0].population));
        $('#txtCurrency').html(result.data[0].currencyCode);
        $('#wiki').attr('href', `https://en.wikipedia.org/wiki/${$('#countrySelect option:selected').text()}`);
      }
    }
  })
}

btn.onclick = function () {
  details.style.display = "block";
};

$('.close').click(function () {
  details.style.display = "none";
});

window.onclick = function (event) {
  if (event.target == details) {
    details.style.display = "none";
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
          $('#countrySelect').val(result.data.countryCode);
          let markers = new L.FeatureGroup();
          map.addLayer(markers);

          const marker = L.marker([lat, lng]).addTo(markers);

          map.fitBounds(markers.getBounds());

        }
      }
    }).then(countryInfo)
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
          border = myLayer.addData(result.data, {
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
    }).then(countryInfo);
  })

  //covid easybutton
  L.easyButton('fa-virus', function () {
    virus.style.display = "block";

    $('.close').click(function () {
      virus.style.display = "none";
    });

    window.onclick = function (event) {
      if (event.target == virus) {
        virus.style.display = "none";
      };
    };

    $.ajax({
      url: 'libs/php/covid.php',
      type: 'POST',
      dataType: 'json',
      data: {
        country: $('#countrySelect option:selected').text()
      },
      success: function (result) {

        let data = result.data;
        let covid = data.pop();

        if (result.status.name == 'ok') {
          $('#txtConfirmed').html(roundData(covid.Confirmed));
          $('#txtActive').html(roundData(covid.Active));
          $('#txtRecovered').html(roundData(covid.Recovered));
          $('#txtDeaths').html(roundData(covid.Deaths));
        }
      }
    });
  }).addTo(map);

  L.easyButton('fa-newspaper', function () {
    news.style.display = "block";

    $('.close').click(function () {
      news.style.display = "none";
    });

    window.onclick = function (event) {
      if (event.target == news) {
        news.style.display = "none";
      };
    };

    $.ajax({
      url: 'libs/php/news.php',
      type: 'POST',
      dataType: 'json',
      data: {
        country: $('#countrySelect').val()
      },
      success: function (result) {



        const data = result.data.articles[0];


        if (result.status.name == 'ok') {
          $('#newsImg').attr('src', data.urlToImage);
          $('#txtTitle').html(data.title);
          $('#txtDescription').html(data.description);
          $('#newsLink').attr('href', data.url);

        }
      }
    });
  }).addTo(map);

  L.easyButton('fa-cloud-sun-rain', function () {
    weather.style.display = "block";

    $('.close').click(function () {
      weather.style.display = "none";
    });

    window.onclick = function (event) {
      if (event.target == weather) {
        weather.style.display = "none";
      };
    };

    $.ajax({
      url: 'libs/php/getWeather.php',
      type: 'POST',
      dataType: 'json',
      data: {
        city: $('#countrySelect option:selected').text()
      },
      success: function (result) {



        const icon = result.data.weather[0].icon;

        if (result.status.name == 'ok') {
          $('#weatherIcon').attr('src', `https://openweathermap.org/img/wn/${icon}.png`);
          $('#txtWeather').html(result.data.weather[0].description);
          $('#txtTemp').html(result.data.main.temp + '°C');
          $('#tempMax').html(result.data.main.temp_max + '°C');
          $('#tempMin').html(result.data.main.temp_min + '°C');
          $('#tempFeels').html(result.data.main.feels_like + '°C');
        }
      }
    });
  }).addTo(map);


  L.easyButton('fa-image', function () {
    images.style.display = "block";

    $('.close').click(function () {
      images.style.display = "none";
    });

    window.onclick = function (event) {
      if (event.target == images) {
        images.style.display = "none";
      };
    };


    $.ajax({
      url: 'libs/php/images.php',
      type: 'POST',
      dataType: 'json',
      data: {
        image: $('#txtCapital').text()
      },
      success: function (result) {

        if (result.status.name == 'ok') {
          $('#img1').attr('src', result.data.results[0].urls.regular);
          $('#img2').attr('src', result.data.results[1].urls.regular);
          $('#img3').attr('src', result.data.results[2].urls.regular);

        }
      }
    });

  }).addTo(map);

  L.easyButton('fa-pound-sign', function () {
    currency.style.display = "block";

    $('.close').click(function () {
      currency.style.display = "none";
    });

    window.onclick = function (event) {
      if (event.target == currency) {
        currency.style.display = "none";
      };
    };

    $('#convertBtn').click(function () {
      $.ajax({
        url: 'libs/php/currency.php',
        type: 'POST',
        dataType: 'json',
        data: {
          currency: $('#txtCurrency').text(),
          amount: $('#converter').val()
        },
        success: function (result) {

          if (result.status.name == 'ok') {

            $('#result').html(result.data.amount + ` ${$('#txtCurrency').text()}`)


          }
        }
      });
    })



  }).addTo(map);


});
