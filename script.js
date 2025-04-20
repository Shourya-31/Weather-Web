const apiKey = "8f6a4d5d1f26bac935ccb831efd16abf"; // Replace with your actual API key
const btn = document.getElementById("getWeatherBtn");
const forecastTitle = document.getElementById("forecastTitle");
const forecastContainer = document.getElementById("forecast");

btn.addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    getCurrentWeather(city);
    getForecast(city);
  }
});

function getCurrentWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.cod == 200) {
        const { name, sys } = data;
        const { temp, humidity } = data.main;
        const { description, icon } = data.weather[0];
        const { speed } = data.wind;

        document.getElementById("weatherResult").innerHTML = `
          <h2>${name}, ${sys.country}</h2>
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

function getForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      const dailyTemps = {};

      data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        const temp = item.main.temp;
        const icon = item.weather[0].icon;
        const description = item.weather[0].description;

        if (!dailyTemps[date]) {
          dailyTemps[date] = {
            temps: [],
            icon: icon,
            description: description
          };
        }

        dailyTemps[date].temps.push(temp);
      });

      forecastContainer.innerHTML = "";
      const forecastEntries = Object.entries(dailyTemps).slice(0, 5);

      forecastEntries.forEach(([date, info]) => {
        const temps = info.temps;
        const min = Math.min(...temps).toFixed(1);
        const max = Math.max(...temps).toFixed(1);

        const dayCard = document.createElement("div");
        dayCard.className = "forecast-day";
        dayCard.innerHTML = `
          <h4>${new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</h4>
          <img src="https://openweathermap.org/img/wn/${info.icon}.png" alt="${info.description}">
          <p>${info.description}</p>
          <p><strong>${min}°C / ${max}°C</strong></p>
        `;
        forecastContainer.appendChild(dayCard);
      });

      forecastTitle.classList.remove("hidden");
      forecastContainer.classList.remove("hidden");
    })
    .catch(err => {
      console.error("Forecast error:", err);
      forecastContainer.innerHTML = `<p style="color: red;">Error fetching forecast data.</p>`;
      forecastContainer.classList.remove("hidden");
    });
}
