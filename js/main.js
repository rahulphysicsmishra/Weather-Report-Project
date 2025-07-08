

document.addEventListener("DOMContentLoaded", () => {

    const citySelect = document.getElementById("citySelect");
    const forecastContainer = document.getElementById("forecastContainer");

    document.getElementById("toggleCustomCity").addEventListener("click", () => {
      const form = document.getElementById("customCityForm");
      form.style.display = form.style.display === "none" ? "block" : "none";
    });

    Papa.parse("city_coordinates.csv", {
    download: true,
    header: true,
    complete: function(results) {
        const cities = results.data;
        
        cities.forEach(city => {
        if (city.city && city.latitude && city.longitude) {
            const option = document.createElement("option");
            option.value = `${city.latitude},${city.longitude}`;
            option.text = `${city.city},${city.country}`;
            citySelect.appendChild(option);
        }
        });
    }
    });

    function fetchWeatherForLocation(lat, lon, label="") {
        const url = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;
        fetch(url)
            .then(response=>response.json())
            .then(data=>showForecast(data))
            .catch(err=>{
                forecastContainer.innerHTML="error fetching data.";
                console.error(err);
            });
    };


    function showForecast(data, label="") {
        forecastContainer.innerHTML = "";

        if (label) {
          const title = document.createElement('h2');
          title.textContent = `Weather forecast for ${label}`;
          forecastContainer.appendChild(title);
        }
        const forecast = data.dataseries || [];
        if(forecast.length==0){
            forecastContainer.innerHTML = "No forecast data available for this location.";
            return;
        }
        console.log(forecast);

        forecast.slice(0, 7).forEach((day, index) => {
          const card = document.createElement('div');
          card.className = 'forecast-daily-card';
          
          const date = new Date();
          date.setDate(date.getDate() + index);
          card.innerHTML = `
            <h3>${date.toDateString()}</h3>
            <p>Temp: ${day.temp2m}°C</p>
            <p>Weather: ${day.weather}</p>
            <p>Wind: ${day.wind10m.speed} ${day.wind10m.direction} knots</p>
            
          `
          forecastContainer.appendChild(card);
          
        })
    }

  citySelect.addEventListener('change', ()=>{
      const [lat, lon] = citySelect.value.split(',');
      const label = citySelect.options[citySelect.selectedIndex].text;
      fetchWeatherForLocation(lat, lon, label);
  })
  document.getElementById("addCityBtn").addEventListener("click", ()=>{
      const city = document.getElementById("customCity").value;
      const country = document.getElementById("customCountry").value;
      const lat = parseFloat(document.getElementById("customLat").value);
      const lon = parseFloat(document.getElementById("customLon").value);

      if(!city || !country || !lat || !lon) {
        alert("Please fill in all fields.");
        return;
      }

      const label = `${city}, ${country}`;
      fetchWeatherForLocation(lat, lon, label);

      const newCity = {
        latitude: lat,
        longitude: lon,
        city,
        country     }

     fetch("/api/add-city", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newCity)
    })
    .then(async (response) => {
      if (!response.ok) {
        const err = await response.json(); // try reading the error message
        console.log("Server returned error:", err.message);
        return;
      }
      const data = await response.json();
      if (data.status === "ok") {
        console.log("City added successfully");
      } else {
        console.log("Error adding city:", data.message);
      }
    })
    .catch(err => {
      console.error("Fetch error", err);
    });

      

    })

});