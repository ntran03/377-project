//var host = window.location.origin;


async function fetcher() {
    document.getElementById('fetch-data').addEventListener('click', function() {
        fetchTopData();
    });
    fetchToken(); // Ensure the token is fetched on page load
  }
  
async function fetchTopData() {
    const accessToken = localStorage.getItem("access_token");
    const topCount = document.getElementById('top-count').value;
    const timeRange = document.getElementById('time-range').value;
  
    if (!accessToken) {
        alert('Access token not found. Please authenticate.');
        return;
    }
  
    try {
        // Fetch top tracks
        let response = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=${topCount}&time_range=${timeRange}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
  
        if (!response.ok) {
            throw new Error('Failed to fetch top tracks');
        }
  
        const topTracksData = await response.json();
        const trackIds = topTracksData.items.map(track => track.id);
        const tracksWithPlayCounts = await fetchTrackPlayCounts(trackIds, accessToken);
        
        displayTopTracks(tracksWithPlayCounts);
        await createPlaylist(topTracksData.items);
  
        // Fetch top artists
        response = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=${topCount}&time_range=${timeRange}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
  
        if (!response.ok) {
            throw new Error('Failed to fetch top artists');
        }
  
        const topArtistsData = await response.json();
        displayTopArtists(topArtistsData.items);
    } catch (error) {
        console.error('Error:', error);
    }
  }
  
async function fetchTrackPlayCounts(trackIds, accessToken) {
    try {
        const toDate = new Date().toISOString(); // Current date
        const fromDate = new Date();
        fromDate.setFullYear(fromDate.getFullYear() - 1); // One year ago
        const fromDateString = fromDate.toISOString();
  
        const response = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=50&after=${fromDateString}&before=${toDate}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
  
        if (!response.ok) {
            throw new Error('Failed to fetch recently played tracks');
        }
  
        const recentlyPlayedData = await response.json();
        const playCounts = {};
  
        recentlyPlayedData.items.forEach(item => {
            const trackId = item.track.id;
            if (trackIds.includes(trackId)) {
                if (playCounts[trackId]) {
                    playCounts[trackId]++;
                } else {
                    playCounts[trackId] = 1;
                }
            }
        });
  
        // Map play counts to tracks
        const tracksWithPlayCounts = trackIds.map(trackId => {
            const track = topTracksData.items.find(item => item.id === trackId);
            return {
                ...track,
                playCount: playCounts[trackId] || 0
            };
        });
  
        return tracksWithPlayCounts;
    } catch (error) {
        console.error('Error fetching track play counts:', error);
        return [];
    }
  }
  
function displayTopTracks(tracks) {
    const topTracksDiv = document.getElementById('top-songs');
    topTracksDiv.innerHTML = '<h4>Top Tracks</h4>'; // Add heading
  
    tracks.forEach(track => {
        const trackDiv = document.createElement('div');
        trackDiv.className = 'item';
  
        const trackImage = document.createElement('img');
        trackImage.src = track.album.images[0].url;
        trackImage.alt = track.name;
  
        const trackInfo = document.createElement('div');
        trackInfo.className = 'item-info';
  
        const trackName = document.createElement('p');
        trackName.textContent = `${track.name}`;
  
        const trackArtists = document.createElement('p');
        trackArtists.textContent = `Artist: ${track.artists.map(artist => artist.name).join(', ')}`;
  
        const trackPopularity = document.createElement('p');
        trackPopularity.textContent = `Popularity: ${track.popularity}`;
  
        const trackPlayCount = document.createElement('p');
        alert(trackPlayCount)
        trackPlayCount.textContent = `Plays: ${track.playCount}`;
  
        trackInfo.appendChild(trackName);
        trackInfo.appendChild(trackArtists);
        trackInfo.appendChild(trackPopularity);
        trackInfo.appendChild(trackPlayCount);
        trackDiv.appendChild(trackImage);
        trackDiv.appendChild(trackInfo);
  
        topTracksDiv.appendChild(trackDiv);
    });
  }
  
function displayTopArtists(artists) {
    const topArtistsDiv = document.getElementById('top-artists');
    topArtistsDiv.innerHTML = '<h4>Top Artists</h4>'; // Add heading
  
    artists.forEach(artist => {
        const artistDiv = document.createElement('div');
        artistDiv.className = 'item';
  
        const artistImage = document.createElement('img');
        artistImage.src = artist.images[0].url;
        artistImage.alt = artist.name;
  
        const artistInfo = document.createElement('div');
        artistInfo.className = 'item-info';
  
        const artistName = document.createElement('p');
        artistName.textContent = `${artist.name}`;
  
        artistInfo.appendChild(artistName);
        artistDiv.appendChild(artistImage);
        artistDiv.appendChild(artistInfo);
  
        topArtistsDiv.appendChild(artistDiv);
    });
  }
  
async function createPlaylist(tracks) {
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
        console.log('Created Playlist ID:', playlistId);
  
        // Add tracks to the new playlist
        const trackUris = tracks.map(track => track.uri);
        response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uris: trackUris
            })
        });
  
        if (!response.ok) {
            throw new Error('Failed to add tracks to playlist');
        }
  
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
  document.addEventListener('DOMContentLoaded', fetcher)
  
  //document.addEventListener('DOMContentLoaded', fetchTopData)
  
  
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