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
