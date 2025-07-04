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
});