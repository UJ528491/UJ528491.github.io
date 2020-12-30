const API_KEY = 'qOpGQckOLw5xUW3r571EZNgsZgDXTIcGKz4F9Z%2FHpYjbU2YI%2FA1eBI7R2YyWgYl4HnfFbVL728E9rDl1y6UdSw%3D%3D';
const call_back_URL = 'http://apis.data.go.kr/1360000/VilageFcstInfoService/getVilageFcst';
const COORDS = 'coords';



// 소스출처 : http://www.kma.go.kr/weather/forecast/digital_forecast.jsp  내부에 있음
// 기상청에서 이걸 왜 공식적으로 공개하지 않을까?
//
// (사용 예)
// var rs = dfs_xy_conv("toLL","60","127");
// console.log(rs.lat, rs.lng);
//


//<!--
//
// LCC DFS 좌표변환을 위한 기초 자료
//
var RE = 6371.00877; // 지구 반경(km)
var GRID = 5.0; // 격자 간격(km)
var SLAT1 = 30.0; // 투영 위도1(degree)
var SLAT2 = 60.0; // 투영 위도2(degree)
var OLON = 126.0; // 기준점 경도(degree)
var OLAT = 38.0; // 기준점 위도(degree)
var XO = 43; // 기준점 X좌표(GRID)
var YO = 136; // 기1준점 Y좌표(GRID)
//
// LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
//


function dfs_xy_conv(code, v1, v2) {
    var DEGRAD = Math.PI / 180.0;
    var RADDEG = 180.0 / Math.PI;

    var re = RE / GRID;
    var slat1 = SLAT1 * DEGRAD;
    var slat2 = SLAT2 * DEGRAD;
    var olon = OLON * DEGRAD;
    var olat = OLAT * DEGRAD;

    var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);
    var rs = {};
    if (code == "toXY") {
        rs['lat'] = v1;
        rs['lng'] = v2;
        var ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        var theta = v2 * DEGRAD - olon;
        if (theta > Math.PI) theta -= 2.0 * Math.PI;
        if (theta < -Math.PI) theta += 2.0 * Math.PI;
        theta *= sn;
        rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
        rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    }
    else {
        rs['x'] = v1;
        rs['y'] = v2;
        var xn = v1 - XO;
        var yn = ro - v2 + YO;
        ra = Math.sqrt(xn * xn + yn * yn);
        if (sn < 0.0) - ra;
        var alat = Math.pow((re * sf / ra), (1.0 / sn));
        alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

        if (Math.abs(xn) <= 0.0) {
            theta = 0.0;
        }
        else {
            if (Math.abs(yn) <= 0.0) {
                theta = Math.PI * 0.5;
                if (xn < 0.0) - theta;
            }
            else theta = Math.atan2(xn, yn);
        }
        var alon = theta / sn + olon;
        rs['lat'] = alat * RADDEG;
        rs['lng'] = alon * RADDEG;
    }
    return rs;
}
//-->


let today = new Date();
let year = today.getFullYear();
let month = today.getMonth()+1;
let date = today.getDate();
let hours = today.getHours();
if (hours == 0){
  hours = 23;
  date = date - 1;
} else{hours-=hours}
let hoursFix = `${hours<10 ? `0${hours}00` : `${hours}00`}`;
console.log(hoursFix)

const myInit = {
  method: 'PATCH',
  headers: {
    "Content-Type": "application/json",
    'API-Key': API_KEY
  },
  mode: 'cors'
}

function getWeather(X, Y){
  fetch(`http://apis.data.go.kr/1360000/VilageFcstInfoService/getUltraSrtNcst?serviceKey=${API_KEY}&numOfRows=10&pageNo=1&dataType=json&base_date=${year}${month}${date}&base_time=${hoursFix}&nx=${X}&ny=${Y}`, myInit).then(function(response) {
   return response.json()
  })
  .then(function(json){
    console.log(json);
  }) 
}

// T1H 기온 PTY 강수형태 

function saveCoords(coordsObj){
  localStorage.setItem(COORDS, JSON.stringify(coordsObj)); //스토리지에 xy좌표 string으로 변환 저장
}

function handleGeoSucces(position){
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  var rs = dfs_xy_conv("toXY", latitude, longitude); // lat, long가지고 xy좌표 구함
  const Xcoord = rs.x;
  const Ycoord = rs.y;
  const coordsObj = {
    Xcoord,
    Ycoord
  }; // 객체안에 키와 값이 같으면 값 생략가능
  saveCoords(coordsObj);
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

function loadCoords(){ //좌표 로드
  const loadedCoords = localStorage.getItem('coords'); //스토리지에 저장된 좌표 string값 변수에 저장
  if(loadedCoords === null){
    askForCoords();
  } else{
    const parseCoords = JSON.parse(loadedCoords); //좌표 string값 object로 변환해서 parseCoords에 저장
    getWeather(parseCoords.Xcoord, parseCoords.Ycoord);
  }
}


function init(){
  loadCoords();
}

init();