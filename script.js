fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
  .then(res => res.json())
  .then(data => {
    const dailyData = {};

    data.list.forEach(item => {
      const date = item.dt_txt.split(" ")[0];
      const hour = item.dt_txt.split(" ")[1].split(":")[0];

      // Save the 12:00 PM reading (or closest)
      if (!dailyData[date] || hour === "12") {
        dailyData[date] = item;
      }
    });

    forecastContainer.innerHTML = "";
    const forecastEntries = Object.values(dailyData).slice(0, 5); // Only next 5 days

    forecastEntries.forEach(forecast => {
      const { dt_txt } = forecast;
      const { temp } = forecast.main;
      const { description, icon } = forecast.weather[0];

      const dayCard = document.createElement("div");
      dayCard.className = "forecast-day";
      dayCard.innerHTML = `
        <h4>${new Date(dt_txt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</h4>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}">
        <p>${description}</p>
        <p><strong>${Math.round(temp)}°C</strong></p>
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
