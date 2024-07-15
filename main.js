console.log('Hello World!');
let place = document.getElementById("place");
let temps = document.getElementById("temp");
let feel = document.getElementById("feel");
let weather = document.getElementById("weather");
let emoji = document.getElementById("emoji");
let maxmin = document.getElementById("maxmin");
let alert = document.getElementById("alert");
let humid = document.getElementById("humidity");
let desc = document.getElementById("desc");
let locationErr = document.getElementById("locationErr");
let winspeed = document.getElementById("winspeed");
function getCity() {
  city = document.getElementById("city").value;
}
let city;
let notFound = document.getElementById("notFound")
const apikey = "14481d8d686a6f83ed3f17ab8b9f059b";

function checkCity() {
  let city = document.getElementById("city").value;

  if (city == "") {
    alert.style.display = "block"
  }
  else {
    fetchApi();
  }
}
async function fetchApi() {
  try {
    await getCity();
    console.log(city);

    const apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    let response = await fetch(apiurl);
    let data = await response.json();
    console.log(data);

    if (!response.ok) {
      throw new Error("notFound")
    }
    else {
      updateData(data);
    }
  }
  catch (error) {
    notFound.style.display = "block";
    console.log(error)

  }
}

function updateData(data) {
  let div = document.getElementById("weather");
  document.documentElement.style.height = 'auto';
  document.body.style.minHeight = '100vh';
  alert.style.display = "none";
  notFound.style.display = "none";
  locationErr.style.display = "none";
  div.style.display = "flex";
  place.textContent = data.name;
  temps.textContent = data;
  const { name: city, main: { temp, humidity, temp_max, temp_min, feels_like }, weather: [{ description, id }], wind: { deg, speed}, sys: {sunrise, sunset}} = data;
  
  let convertedTemp = convert(temp);
  let convertedFeel = convert(feels_like);
  let max = convert(temp_max);
  let min = convert(temp_min);
  let windspeed = tokm(speed).toFixed(0);
  let direction = getDirection(deg);
  winspeed.textContent= `Windspeed: ${windspeed} km/h (${direction})`
  let weatherEmoji = getWeatherEmoji(id);
  temps.textContent = `${convertedTemp}°C`;
  feel.textContent = `Feels like: ${convertedFeel}°C`
  maxmin.textContent = `Max: ${max}°C Min: ${min}°C`
  humid.textContent = `Humidity: ${humidity}%`;
  desc.textContent = `${description}`;
  emoji.textContent = `${weatherEmoji}`;
}
function tokm (num){
  return num * 3.6 
}
function convert(num) {
  let decimal = num - 273.15;
  Number(decimal);
  return decimal.toFixed(0)
}
function getDirection(degrees){
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    console.log(index);
    return directions[index];
}
function getWeatherEmoji(id) {
  switch (true) {
    case (id >= 200 && id < 300):
      return "⛈️";
    case (id >= 300 && id < 400):
      return "🌧️";
    case (id >= 500 && id < 600):
      return "🌧️";
    case (id >= 600 && id < 700):
      return "🌨️";
    case (id >= 700 && id < 800):
      return "🌫️";
    case (id === 800):
      return "☀️"
    case (id > 800):
      return "🌥️";
  }
}

async function geolocation() {
  navigator.geolocation.getCurrentPosition(position, error);
}

async function position(position) {
  console.log(position);
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  console.log(lat, lon);

  let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`);
  let data = await response.json();
  updateData(data);
  console.log(data.name); // Correctly log the city name
}

function error() {
  console.error("Can't get location");
  locationErr.style.display = "flex"
}