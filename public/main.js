function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }
  
  
function fetchToken() {
    var params = getHashParams()
    if (params) {
      console.log(params)
      localStorage.setItem("access_token", params.access_token)
      localStorage.setItem("refresh_token", params.refresh_token)
    }
    console.log(localStorage.getItem("access_token"))
  }

function setCode() {
    code = localStorage.getItem("access_token")
    console.log(code)
    document.getElementById("access_code").innerHTML = code
}
  
window.onload = fetchToken()