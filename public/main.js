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
    console.log(localStorage.getItem("access_token"));
  }

// Function to add the token to all links on the page
function addTokenToLinks() {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
      const url = new URL(link.href);
      var access = localStorage.getItem("access_token")
      var refresh = localStorage.getItem("refresh_token")
      let hashString = `access_token=${access}&refresh_token=${refresh}`;
      // Set the hash portion of the URL
      url.hash = hashString;
      link.href = url.toString();
  });
}

// Ensure the function runs on page load
document.addEventListener('DOMContentLoaded', addTokenToLinks)


function setCode() {
    code = localStorage.getItem("access_token")
    console.log(code)
    document.getElementById("access_code").innerHTML = code
}

document.addEventListener('DOMContentLoaded', function() {
  fetch('/submissions')
  .then(response => response.json())
  .then(data => {
      const displayDiv = document.getElementById('submissions');
      data.forEach(submission => {
          displayDiv.innerHTML += `<p>Name: ${submission.name}<br>Email: ${submission.email}<br>Comment: ${submission.comment}</p>`;
      });
  })
  .catch((error) => {
      console.error('Error:', error);
  });
});


window.onload = fetchToken();