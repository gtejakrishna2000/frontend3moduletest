const var1 = document.getElementById("var1");
const var2 = document.getElementById("var2");
const apiKey = "6a3f8491a40e443951141921b4bf521b";


function getGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function success(position) {
  renderLandingPage(position);
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}

async function renderLandingPage(position) {

  //-----hero section render--------
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const lat = document.getElementById("latitude");
  lat.innerText = "Lat: " + latitude;
  const Long = document.getElementById("longitude");
  Long.innerText = "Long: " + longitude;

  const map = document.getElementById("map");
  map.src = `https://maps.google.com/maps?q=${latitude},${longitude}&output=embed`;

  //-----data container-----------
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  try{
    let fetchResult = await fetch(url);
    let json = await fetchResult.json();

    const data = document.getElementsByClassName("data")[0];
    data.innerHTML=`
        <p>Location : ${json.name}</p>
        <p>TimeZone : ${convertTimeZone(json.timezone)}</p>
        <p>Weather : ${json.weather[0].description}</p>
        <p>Temperature : ${convertTemp(json.main.temp)}</p>
        <p>Feels Like : ${convertTemp(json.main.feels_like)}</p>
        <p>Wind Speed : ${json.wind.speed}m/sec</p>
        <p>Humidity : ${json.main.humidity}%</p>
        <p>Pressure : ${json.main.pressure}hPa</p>
        <p>Wind direction : ${convertDirection(json.wind.deg)}</p>
        `;

    var1.style.display = "none";
    var2.style.display = "block";

  }catch(e){
    alert("Error occured while trying to fetch data.")
  }
}

function convertTimeZone(time){
    const hr = Math.floor(time / 3600); 
    const mins = Math.floor((time % 3600) / 60); 
    const sign = time < 0 ? '-' : '+';
    const res = `${sign}${Math.abs(hr).toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    return `UTC${res}`;
}

function convertTemp(temp){
    return  `${Math.round(temp-273)}°C`;
}

function convertDirection(deg){
    const directions = ["North", "North-Northeast", "Northeast", "East-Northeast", "East", "East-Southeast", "Southeast", "South-Southeast", "South", "South-Southwest", "Southwest", "West-Southwest", "West", "West-Northwest", "Northwest", "North-Northwest"];
    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
}
