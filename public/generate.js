function generatePlaylist() {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
        console.error('Access token not found in localStorage');
        return;
    }
    const genres = document.getElementById('genres').value.split(',');
    const seedArtists = document.getElementById('seed-artists').value.split(',');
    const useTopSongs = document.getElementById('use-top-songs').checked;
    const energy = document.getElementById('energy').value / 100;
    const durationMs = document.getElementById('duration').value * 60000;
    const limit = parseInt(document.getElementById('num-tracks').value);
    const params = {
        seed_genres: genres.join(','),
        seed_artists: seedArtists.join(','),
        target_popularity: useTopSongs ? 100 : null,
        target_energy: energy,
        target_duration_ms: durationMs,
        limit: limit
    };
    const url = new URL('https://api.spotify.com/v1/recommendations');
    url.search = new URLSearchParams(params);
    fetch(url, {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })
    .then(response => response.json())
    .then(data => {
        const playlistContainer = document.getElementById('playlist');
        playlistContainer.innerHTML = '';
        data.tracks.forEach(track => {
            const trackElement = document.createElement('p');
            trackElement.textContent = track.name + ' - ' + track.artists[0].name;
            playlistContainer.appendChild(trackElement);
        });
    })
    .catch(error => console.error('Error generating playlist:', error));
}



async function fetchTopTracks() {
    const token = localStorage.getItem("access_token");
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data.items.map(track => track.id);
}

// Fetch recommendations based on top tracks and user criteria
async function fetchRecommendations(token, seedTracks, criteria) {
    const { genres, limit, acousticness, danceability, energy, popularity } = criteria;
    const seedTracksParam = seedTracks.join(',');

    const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=${limit}&market=US&seed_genres=${genres}&seed_tracks=${seedTracksParam}&target_acousticness=${acousticness / 100}&target_danceability=${danceability / 100}&target_energy=${energy / 100}&target_popularity=${popularity}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    return data.tracks;
}

// Event listener for the generate button
document.getElementById('generate-btn').addEventListener('click', async () => {
    const genres = document.getElementById('genres').value;
    const limit = document.getElementById('limit').value;
    const acousticness = document.getElementById('acousticness').value;
    const danceability = document.getElementById('danceability').value;
    const energy = document.getElementById('energy').value;
    const popularity = document.getElementById('popularity').value;

    const criteria = { genres, limit, acousticness, danceability, energy, popularity };

    const topTracks = await fetchTopTracks(accessToken);
    const recommendations = await fetchRecommendations(accessToken, topTracks, criteria);

    const playlistElement = document.getElementById('playlist');
    playlistElement.innerHTML = ''; // Clear previous playlist

    recommendations.forEach(track => {
        const li = document.createElement('li');
        li.textContent = `${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`;
        playlistElement.appendChild(li);
    });
});

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

window.onload = fetchToken();