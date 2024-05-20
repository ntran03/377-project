async function fetchTopTracks(token) {
    try {
        const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch top tracks: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.items.map(track => track.id);
    } catch (error) {
        console.error('Error fetching top tracks:', error);
        return [];
    }
}

async function fetchRecommendations(token, seedTracks, criteria) {
    const { genres, limit, acousticness, danceability, energy, popularity } = criteria;
    const seedTracksParam = seedTracks.join(',');
    const url = `https://api.spotify.com/v1/recommendations?limit=${limit}&market=US&seed_genres=${genres}&seed_tracks=${seedTracksParam}&target_acousticness=${acousticness / 100}&target_danceability=${danceability / 100}&target_energy=${energy / 100}&target_popularity=${popularity}`;

    console.log('Request URL:', url);
    console.log('Request Headers:', {
        'Authorization': `Bearer ${token}`
    });

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch recommendations: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.tracks;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return [];
    }
}

async function buttoner() {
    document.getElementById('generate-btn').addEventListener('click', async () => {
        const genres = document.getElementById('genres').value;
        const limit = document.getElementById('limit').value;
        const acousticness = document.getElementById('acousticness').value;
        const danceability = document.getElementById('danceability').value;
        const energy = document.getElementById('energy').value;
        const popularity = document.getElementById('popularity').value;
        const useTopSongs = document.getElementById('use-top-songs').checked;

        const criteria = { genres, limit, acousticness, danceability, energy, popularity };

        console.log('Criteria:', criteria);

        const token = localStorage.getItem("access_token");
        if (!token) {
            console.error('No access token found');
            return;
        }

        let seedTracks = [];
        if (useTopSongs) {
            seedTracks = await fetchTopTracks(token);
            if (seedTracks.length === 0) {
                console.error('No top tracks found or failed to fetch top tracks');
                return;
            }
            console.log('Top Tracks:', seedTracks);
        }

        const recommendations = await fetchRecommendations(token, seedTracks, criteria);
        if (!recommendations || recommendations.length === 0) {
            console.error('No recommendations found or failed to fetch recommendations');
            return;
        }

        const playlistElement = document.getElementById('playlist');
        playlistElement.innerHTML = ''; // Clear previous playlist

        recommendations.forEach(track => {
            const li = document.createElement('li');
            li.textContent = `${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`;
            playlistElement.appendChild(li);
        });
    });
}

function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}

function fetchToken() {
    var params = getHashParams();
    if (params.access_token) {
        localStorage.setItem("access_token", params.access_token);
    }
    if (params.refresh_token) {
        localStorage.setItem("refresh_token", params.refresh_token);
    }
    console.log('Access Token:', localStorage.getItem("access_token"));
    console.log('Refresh Token:', localStorage.getItem("refresh_token"));
}

function addTokenToLinks() {
    const links = document.querySelectorAll('a');
    const profileIcons = document.querySelectorAll('.profile-icon a');
    links.forEach(link => {
        const url = new URL(link.href);
        const access = localStorage.getItem("access_token");
        const refresh = localStorage.getItem("refresh_token");
        let hashString = `access_token=${access}&refresh_token=${refresh}`;
        url.hash = hashString;
        link.href = url.toString();
    });
    profileIcons.forEach(link => {
        const url = new URL(link.href);
        const access = localStorage.getItem("access_token");
        const refresh = localStorage.getItem("refresh_token");
        let hashString = `access_token=${access}&refresh_token=${refresh}`;
        url.hash = hashString;
        link.href = url.toString();
    });
}

document.addEventListener('DOMContentLoaded', addTokenToLinks);
document.addEventListener('DOMContentLoaded', buttoner);

window.onload = fetchToken;
