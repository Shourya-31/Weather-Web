const apiKey = "8f6a4d5d1f26bac935ccb831efd16abf";

const btn = document.getElementById("getWeatherBtn");
const loader = document.getElementById("loader");
const currentWeather = document.getElementById("currentWeather");
const forecastContainer = document.getElementById("forecast");
const forecastTitle = document.getElementById("forecastTitle");
const toggle = document.getElementById("darkModeToggle");

btn.addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    getWeather(city);
  } else {
    alert("Please enter a city name.");
  }
});

function getWeather(city) {
  loader.classList.remove("hidden");
  currentWeather.classList.add("hidden");
  forecastContainer.classList.add("hidden");
  forecastTitle.classList.add("hidden");

  // Current Weather
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) throw new Error(data.message);
      const { name } = data;
      const { temp, humidity } = data.main;
      const { description, icon } = data.weather[0];
      const { speed } = data.wind;

      currentWeather.innerHTML = `
        <h2>${name}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p><strong>${description.toUpperCase()}</strong></p>
        <p>🌡 Temperature: ${temp}°C</p>
        <p>💧 Humidity: ${humidity}%</p>
        <p>🌬 Wind Speed: ${speed} m/s</p>
      `;
      currentWeather.classList.remove("hidden");
    })
    .catch(err => {
      currentWeather.innerHTML = `<p style="color: red;">${err.message}</p>`;
      currentWeather.classList.remove("hidden");
    });

  // 5-Day Forecast
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      const days = {};
      data.list.forEach(entry => {
        const date = new Date(entry.dt_txt).toDateString();
        if (!days[date] && Object.keys(days).length < 5) {
          days[date] = entry;
        }
      });

      forecastContainer.innerHTML = "";
      Object.values(days).forEach(forecast => {
        const { dt_txt } = forecast;
        const { temp } = forecast.main;
        const { description, icon } = forecast.weather[0];

        const dayCard = document.createElement("div");
        dayCard.className = "forecast-day";
        dayCard.innerHTML = `
          <h4>${new Date(dt_txt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</h4>
          <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}">
          <p>${description}</p>
          <p><strong>${temp}°C</strong></p>
        `;
        forecastContainer.appendChild(dayCard);
      });

      forecastTitle.classList.remove("hidden");
      forecastContainer.classList.remove("hidden");
    })
    .finally(() => {
      loader.classList.add("hidden");
    });
}

// Dark Mode
toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});
