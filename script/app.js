const $searchForm = document.querySelector("#search-form");
const $searchInput = document.querySelector("#search-input");
const $weatherStateCelsius = document.querySelector(".weather-state-celsius");
const $weatherStateRegion = document.querySelector(".weather-state-region");
const $weatherStateIcon = document.querySelector(".hero__content-weather-icon");
const $weatherCurrentTime = document.querySelector(".weather-current-time");
const $weatherDate = document.querySelector(".weather-current-name");
const $map = document.querySelector("#map");
const $airPressure = document.querySelector(".air-pressure");
const $humidity = document.querySelector(".humidity");
const $uv = document.querySelector(".uv");
const $sunset = document.querySelector(".sunset");
const $sunrise = document.querySelector(".sunrise");
const $windArrow = document.querySelector(".wind-arrow");
const $ctx = document.querySelector("#myChart");
const $themeToggle = document.querySelector("#theme");
const dayInfo = document.querySelector(".day-info");

const API_KEY = "644f6ce0ca9e401ebb891832211707";

$searchForm.addEventListener("submit", loadWeatherData);
window.addEventListener("DOMContentLoaded", loadWeatherData);
$themeToggle.addEventListener("change", () => {
  checkTheme($themeToggle.checked);
});

checkTheme(localStorage.getItem("theme") === "dark");

function checkTheme(themeState) {
  if (themeState) {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
    $themeToggle.checked = true;
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
    $themeToggle.checked = false;
  }
}

async function loadWeatherData(e) {
  e.preventDefault();
  try {
    let response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${
        $searchInput.value ? $searchInput.value : "Tashkent"
      }&days=7&aqi=yes&alerts=yes`
    );
    let data = await response.json();
    renderWeatherData(data);
    if (response.status === 403) {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    console.log(error.massage);
  }
}

function renderWeatherData(data) {
  $weatherStateCelsius.innerText = data.current.temp_c + "°";
  $weatherStateRegion.innerText =
    data.location.country + "," + data.location.name;
  $weatherStateIcon.src = data.current.condition.icon;
  $weatherCurrentTime.innerText = data.forecast.forecastday[0].astro.sunset;
  $weatherDate.innerText = `Sunset Time, ${identifyTheWeekDay(
    new Date().getDay()
  )}`;
  $map.src = `https://maps.google.com/maps?q=${
    $searchInput.value ? $searchInput.value : "Tashkent"
  }%20Dates%10Products&amp;t=&amp;z=12&amp&output=embed`;
  $humidity.innerText = data.current.humidity + "%";
  $uv.innerText = data.current.uv + " out of 10";
  $sunset.innerText = data.forecast.forecastday[0].astro.sunset;
  $sunrise.innerText = data.forecast.forecastday[0].astro.sunrise;
  $windArrow.style.transform = `rotate(${data.current.wind_degree}deg)`;
  $airPressure.innerHTML = data.current.pressure_mb + "Pa";

  let hours = data.forecast.forecastday[0].hour.map(
    (hour) => hour.time.split(" ")[1]
  );
  let temps = data.forecast.forecastday[0].hour.map((hour) => hour.temp_c);
  document.querySelector(".chart").innerHTML = '<canvas id="myChart"></canvas>';
  var $ctx = document.getElementById("myChart").getContext("2d");
  new Chart($ctx, {
    type: "line",
    data: {
      labels: hours,
      datasets: [
        {
          label: `Weather data for ${data.location.name}`,
          data: temps,
          borderWidth: 3,
          borderColor: "blueviolet",
          backgroundColor: "#fff",
        },
      ],
    },
    options: {
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 16,
            },
          },
        },
        y: {
          grid: {
            display: false,
          },
        },
      },
    },
  });

  const daysFragment = document.createDocumentFragment();
  dayInfo.innerHTML = "";
  data.forecast.forecastday.forEach((day) => {
    const div = document.createElement("div");
    div.innerHTML = `
              <h4>${identifyTheWeekDay(+new Date(day.date).getDay())
                .slice(0, 3)
                .toUpperCase()}</h4>
              <img  src="${day.day.condition.icon}"/>
              <p>${day.day.avgtemp_c}°</p>
          `;
    daysFragment.appendChild(div);
  });
  dayInfo.appendChild(daysFragment);
}

function identifyTheWeekDay(time) {
  switch (time) {
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "Sunday";
  }
}
