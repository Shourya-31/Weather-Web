const apiKey = "8f6a4d5d1f26bac935ccb831efd16abf"; 
const btn = document.getElementById("getWeatherBtn");

btn.addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    getWeather(city);
  }
});

function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.cod == 200) {
        const { name } = data;
        const { temp, humidity } = data.main;
        const { description, icon } = data.weather[0];
        const { speed } = data.wind;

        document.getElementById("weatherResult").innerHTML = `
          <h2>${name}</h2>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
          <p>${description}</p>
          <p><strong>Temperature:</strong> ${temp}°C</p>
          <p><strong>Humidity:</strong> ${humidity}%</p>
          <p><strong>Wind Speed:</strong> ${speed} m/s</p>
        `;
      } else {
        document.getElementById("weatherResult").innerHTML = `<p>City not found!</p>`;
      }
    })
    .catch(err => {
      console.error(err);
      document.getElementById("weatherResult").innerHTML = `<p>Error fetching weather data.</p>`;
    });
}
