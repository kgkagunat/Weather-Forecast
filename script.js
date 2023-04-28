const apiKey = "c779880b04f92435f485a67f0af4f108";

//----------------------------------------------------------------------------------------------------------------//

const searchButton = document.getElementById("search-button");
const cityInput = document.getElementById("city-input");
const searchHistory = document.getElementById("search-history");
const currentWeather = document.querySelector(".current-weather");
const forecast = document.querySelector(".forecast");

//----------------------------------------------------------------------------------------------------------------//

function displayWeatherData(data) {
  currentWeather.innerHTML = "";
  forecast.innerHTML = "";

  const currentWeatherData = data.list[0];
  const currentWeatherContent = `
    <h2>${data.city.name} (${new Date(currentWeatherData.dt * 1000).toLocaleDateString()})</h2>
    <p>Temperature: ${currentWeatherData.main.temp}°F</p>
    <p>Humidity: ${currentWeatherData.main.humidity}%</p>
    <p>Wind Speed: ${currentWeatherData.wind.speed} MPH</p>
  `;
  currentWeather.innerHTML = currentWeatherContent;

  //-------------------------------------------------
  
  for (let i = 7; i < data.list.length; i += 8) {
    const forecastData = data.list[i];
    const forecastContent = `
      <div>
        <h3>${new Date(forecastData.dt * 1000).toLocaleDateString()}</h3>
        <p>Temperature: ${forecastData.main.temp}°F</p>
        <p>Humidity: ${forecastData.main.humidity}%</p>
        <p>Wind Speed: ${forecastData.wind.speed} MPH</p>
      </div>
    `;
    forecast.innerHTML += forecastContent;
  }
}

//----------------------------------------------------------------------------------------------------------------//

function saveToSearchHistory(city) {
  const searchHistoryData = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (!searchHistoryData.includes(city)) {
    searchHistoryData.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistoryData));
  }
}

//----------------------------------------------------------------------------------------------------------------//

function displaySearchHistory() {
  const searchHistoryData = JSON.parse(localStorage.getItem("searchHistory")) || [];
  searchHistory.innerHTML = "";
  searchHistoryData.forEach(function(city) {
    const cityElement = document.createElement("button");
    cityElement.textContent = city;
    cityElement.classList.add("history-item");
    searchHistory.appendChild(cityElement);
  });
}

//----------------------------------------------------------------------------------------------------------------//

function fetchWeatherData(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
    .then(function(cityDataResponse) {
      if (!cityDataResponse.ok) {
        throw new Error(`Error fetching city data: ${cityDataResponse.statusText}`);
      }
      return cityDataResponse.json();
    })
    .then(function(cityData) {
      const lat = cityData.coord.lat;
      const lon = cityData.coord.lon;

      return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`);
    })
    .then(function(weatherDataResponse) {
      if (!weatherDataResponse.ok) {
        throw new Error(`Error fetching weather data: ${weatherDataResponse.statusText}`);
      }
      return weatherDataResponse.json();
    })
    .then(function(weatherData) {
      console.log(weatherData);
      displayWeatherData(weatherData);
      saveToSearchHistory(city);
      displaySearchHistory();
    })
    .catch(function(error) {
      console.error("Error fetching weather data:", error);
    });
}

//----------------------------------------------------------------------------------------------------------------//

searchButton.addEventListener("click", function() {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherData(city);
    cityInput.value = "";
  }
});

searchHistory.addEventListener("click", function(event) {
  if (event.target.classList.contains("history-item")) {
    const city = event.target.textContent;
    fetchWeatherData(city);
  }
});

//----------------------------------------------------------------------------------------------------------------//

displaySearchHistory();

//----------------------------------------------------------------------------------------------------------------//

const searchHistoryData = JSON.parse(localStorage.getItem("searchHistory")) || [];
if (searchHistoryData.length > 0) {
const lastIndex = searchHistoryData.length - 1; 
const mostRecentCity = searchHistoryData[lastIndex]; 

fetchWeatherData(mostRecentCity);
}



