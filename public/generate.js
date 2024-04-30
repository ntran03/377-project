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

document.getElementById('generate-btn').addEventListener('click', generatePlaylist);
