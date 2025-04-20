const apiKey = "8f6a4d5d1f26bac935ccb831efd16abf";
const btn = document.getElementById("getWeatherBtn");
const loader = document.getElementById("loader");
const weatherResult = document.getElementById("weatherResult");
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
  weatherResult.classList.add("hidden");
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then(data => {
      const { name } = data;
      const { temp, humidity } = data.main;
      const { description, icon } = data.weather[0];
      const { speed } = data.wind;

      weatherResult.innerHTML = `
        <h2>${name}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p><strong>${description.toUpperCase()}</strong></p>
        <p>🌡 Temperature: ${temp}°C</p>
        <p>💧 Humidity: ${humidity}%</p>
        <p>🌬 Wind Speed: ${speed} m/s</p>
      `;
      weatherResult.classList.remove("hidden");
    })
    .catch(err => {
      weatherResult.innerHTML = `<p style="color: red;">${err.message}</p>`;
      weatherResult.classList.remove("hidden");
    })
    .finally(() => {
      loader.classList.add("hidden");
    });
}

// Dark mode
toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  weatherResult.classList.toggle("dark");
});
