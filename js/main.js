document.addEventListener("DOMContentLoaded", () => {
    const citySelect = document.getElementById("citySelect");
    const forecastContainer = document.getElementById("forecastContainer");

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

    citySelect.addEventListener('change', ()=>{
        const [lat, lon] = citySelect.value.split(',');
        const url = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;
        fetch(url)
            .then(response=>response.json())
            .then(data=>showForecast(data))
            .catch(err=>{
                forecastContainer.innerHTML="error fetching data.";
                console.error(err);
            });
    });

    function showForecast(data) {
        forecastContainer.innerHTML = "";
        const forecast = data.dataseries;
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

});