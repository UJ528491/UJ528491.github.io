const API_KEY = 'c8a1624f38adb83cf44725cd114c7b25';
const COORDS = 'coords';
const temp = document.querySelector(".js-temp");
const loca = document.querySelector(".js-loca");
const img = document.querySelector(".js-img");

function getWeather(lat, lon){
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  fetch(weatherURL).then(function(response) {
   return response.json()
  })
  .then(function(json){
    const place = json.name;
    const temperature = json.main.temp;
    const cloud = json.weather[0].description;
    loca.innerHTML = place;
    temp.innerHTML = `${temperature}ºC`;
    cloudImg(cloud);
  }) 
}
function cloudImg(cloud){
  const image = new Image();
  image.src = `images/weather/${cloud}.png`;
  image.classList.add('cloudImg');
  img.appendChild(image);
}
function saveCoords(coordsObj){
  localStorage.setItem(COORDS, JSON.stringify(coordsObj)); 
}
function handleGeoSucces(position){
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const coordsObj = {
    latitude,
    longitude
  };
  saveCoords(coordsObj);
  getWeather(latitude, longitude);
}
function handleGeoError(){
  console.log('Cant access geo location');
}
function askForCoords(){
  const option = {
    enableHighAccuracy : true,
  };
  navigator.geolocation.getCurrentPosition(handleGeoSucces, handleGeoError, option);
}
function loadCoords(){ 
  const loadedCoords = localStorage.getItem('coords');
  if(loadedCoords === null){
    askForCoords();
  } else{
    const parseCoords = JSON.parse(loadedCoords); 
    getWeather(parseCoords.latitude, parseCoords.longitude);
  }
}
function init(){
  loadCoords();
}

init();