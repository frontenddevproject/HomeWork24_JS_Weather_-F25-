const cityInput = document.querySelector("#city");
const submitButton = document.querySelector("#submit");
const weatherDataSection = document.querySelector("#weather-data");
const loadingSection = document.querySelector("#loading");
const requestOptions = {
	method: 'GET',

	}
;
const API_KEY = `6409ee75b6ffc020adb31a565296a4bb`;
 const errorStatuses = ["404", 401, "400"];
let isLoading = false;

 const lastRequestedCity = localStorage.getItem("city");
 lastRequestedCity && getWeather(lastRequestedCity);

function getWeather (city) {
isLoading = true;
renderLoading(isLoading);
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`, requestOptions)
    .then(response => response.json())
    .then(response => {
        console.log(response, "response");
        if (errorStatuses.includes(response.cod)) {
            return renderError(response);      
        }
        localStorage.setItem("city", city);
        localStorage.setItem("weather-data", JSON.stringify(response));
        renderWeather(response);     
    })
    .catch(err => console.log(err))
    .finally(() => {
        isLoading = false;
        renderLoading(isLoading);
    })
}

submitButton.onclick = () => {
    getWeather(cityInput.value)
};

cityInput.onkeypress = (e) => {
    if (e.key === "Enter"){
        getWeather(cityInput.value);
    }
}
function renderError (error) {
    weatherDataSection.innerHTML = error.message;
};
function renderLoading () {
    loadingSection.innerHTML = isLoading ? `<h3>Loading...</h3>` : "";
}
function renderWeather (data) {
    const {main, wind, sys, name} = data;
    const{feels_like, temp, temp_min, temp_max, pressure} = main;
    const {speed, deg, gust} = wind;
    const {country} = sys;

    weatherDataSection.innerHTML = "";

    weatherDataSection.innerHTML = `
    <h2>Weather in ${name}, ${country}</h2>
    <p>Temp: ${temp} <sup>o</sup>C</p>
    <span>Feels like: ${feels_like} <sup>o</sup>C</span>
    <span>${temp_min}<sup>o</sup>C - ${temp_max} <sup>o</sup>C</span>
    <span>Pressure: ${pressure}</span>
    <h3>Wind</h3>
    <span>Feels like: ${speed} </span>
    <span>Direction: ${deg}</span>
    <span>Gust: ${gust}</span>
    `;
}


