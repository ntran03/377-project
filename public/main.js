//var host = window.location.origin;

async function fetchTopSongs() {
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
      alert('Access token not found. Please authenticate.');
      return;
  }

  try {
      const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
          method: 'GET',
          headers: {
              'Authorization': 'Bearer ' + accessToken
          }
      });

      if (!response.ok) {
          throw new Error('Failed to fetch top tracks');
      }

      const data = await response.json();
      displayTopSongs(data.items);
      await createPlaylist(data.items);
  } catch (error) {
      console.error('Error:', error);
  }
}

function displayTopSongs(songs) {
  alert("gettting songs")
  const topSongsDiv = document.getElementById('top-songs');
  topSongsDiv.innerHTML = ''; // Clear any existing content

  songs.forEach(song => {
      const songDiv = document.createElement('div');
      songDiv.className = 'song';

      const songImage = document.createElement('img');
      songImage.src = song.album.images[0].url;
      songImage.alt = song.name;

      const songInfo = document.createElement('div');
      songInfo.className = 'song-info';

      const songName = document.createElement('p');
      songName.textContent = `Name: ${song.name}`;

      const songArtists = document.createElement('p');
      songArtists.textContent = `Artist(s): ${song.artists.map(artist => artist.name).join(', ')}`;

      const songPlays = document.createElement('p');
      songPlays.textContent = `Plays: ${song.play_count || 'N/A'}`; // Note: Spotify API doesn't provide play count directly

      songInfo.appendChild(songName);
      songInfo.appendChild(songArtists);
      songInfo.appendChild(songPlays);
      songDiv.appendChild(songImage);
      songDiv.appendChild(songInfo);

      topSongsDiv.appendChild(songDiv);
  });
}

async function createPlaylist(songs) {
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
      alert('Access token not found. Please authenticate.');
      return;
  }

  try {
      // Get the user's ID
      let response = await fetch('https://api.spotify.com/v1/me', {
          method: 'GET',
          headers: {
              'Authorization': 'Bearer ' + accessToken
          }
      });

      if (!response.ok) {
          throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      const userId = userData.id;

      // Create a new playlist
      response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          method: 'POST',
          headers: {
              'Authorization': 'Bearer ' + accessToken,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              name: 'Top Spotify Songs',
              description: 'Top songs based on your Spotify listening history',
              public: false
          })
      });

      if (!response.ok) {
          throw new Error('Failed to create playlist');
      }

      const playlistData = await response.json();
      const playlistId = playlistData.id;

      // Add tracks to the new playlist
      const trackUris = songs.map(song => song.uri);
      await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          method: 'POST',
          headers: {
              'Authorization': 'Bearer ' + accessToken,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              uris: trackUris
          })
      });

      // Embed the playlist
      const playlistContainer = document.getElementById('playlist-container');
      playlistContainer.innerHTML = `<iframe src="https://open.spotify.com/embed/playlist/${playlistId}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
  } catch (error) {
      console.error('Error:', error);
  }
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
document.addEventListener('DOMContentLoaded', fetchTopSongs)


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