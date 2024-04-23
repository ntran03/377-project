const root_url = 'http://localhost:8888/'

const login_url = `http://localhost:8888/login`;

function login() {
  window.location.href = "/login";
}

function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}


function fetchProfile() {
  var params = getHashParams()
  if (params) {
    console.log(params)
  } 
  //var token = localStorage.getItem("access_token");
  //document.getElementById("tester").innerHTML = token
}

window.onload = fetchProfile()