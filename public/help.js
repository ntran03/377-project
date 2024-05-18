// Function to add the token to all links on the page
function addTokenToLinks() {
    const links = document.querySelectorAll('a');
    var profileIcons = document.querySelectorAll('.profile-icon a');
    links.forEach(link => {
        const url = new URL(link.href);
        var access = localStorage.getItem("access_token")
        var refresh = localStorage.getItem("refresh_token")
        let hashString = `access_token=${access}&refresh_token=${refresh}`;
        // Set the hash portion of the URL
        url.hash = hashString;
        link.href = url.toString();
    });
    profileIcons.forEach(link => {
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

window.onload = fetchToken();