# 377-project
### Installation

Clone the repository: 'git clone [https://github.com/ntran03/377-project.git](https://github.com/ntran03/377-project.git)'

Navigate to the project directory: 'cd 377-project'

Install dependencies: 'npm install'

Running the Application: 'npm start' The application will be accessible at [http://localhost:8888](http://localhost:8888/)

### API Endpoints

[https://accounts.spotify.com/api/token ](https://accounts.spotify.com/api/token)- This endpoint is used to retrieve an access token or refresh token for authentication. A POST request with your client credentials is sent to receive the token, which is then used for accessing other Spotify Web API endpoints.

[https://api.spotify.com/v1/me ](https://api.spotify.com/v1/me)-This endpoint is used to retrieve information about the current user, such as their profile details.

[https://api.spotify.com/v1/recommendations ](https://api.spotify.com/v1/recommendations)- This endpoint generates recommendations based on provided seed values like artists, tracks, or genres. You can customize the recommendations by including parameters like limit, market, seed_artists, seed_genres, and seed_tracks.

[https://api.spotify.com/v1/search?q=${query}&type=${type}&limit=5](https://api.spotify.com/v1/search?q=$%7Bquery%7D&type=$%7Btype%7D&limit=5-) -This endpoint performs a search for items in the Spotify catalog. The q parameter specifies the search query, and type can be album, artist, playlist, track, etc. The limit parameter restricts the number of results returned.

[https://api.spotify.com/v1/me/top/tracks](https://api.spotify.com/v1/me/top/tracks) - This endpoint is used to retrieve the top tracks of the current user. A GET request with the access token in the Authorization header is sent. Optional query parameters include limit (number of items to return) and time_range (short_term, medium_term, long_term).

[https://api.spotify.com/v1/me/top/artists](https://api.spotify.com/v1/me/top/artists) - This endpoint is used to retrieve the top artists of the current user. A GET request with the access token in the Authorization header is sent. Optional query parameters include limit (number of items to return) and time_range (short_term, medium_term, long_term).

[https://api.spotify.com/v1/users/{user_id}/playlists](https://api.spotify.com/v1/users/{user_id}/playlists) -  This endpoint is used to create a new playlist for the current user. A POST request with the access token in the Authorization header and a JSON body containing the playlist details (name, description, public) is sent.

[https://api.spotify.com/v1/playlists/{playlist_id}/tracks](https://api.spotify.com/v1/playlists/{playlist_id}/tracks) - This endpoint is used to add tracks to an existing playlist. A POST request with the access token in the Authorization header and a JSON body containing the track URIs is sent.

/api/supabase/ticket - Adds a new entry to the “About” table in Supabase. It expects a JSON body containing ‘name’, ‘email’, and ‘comment’. 

`/login` - Redirects the user to the Spotify authorization page to log in. A GET request is sent to initiate the login process.

/callback - Handles the callback after Spotify authorization, exchanges the authorization code for access and refresh tokens, and stores these tokens. A GET request is used for this endpoint.

/refresh_token - Exchanges a refresh token for a new access token. Requires the refresh_token parameter. A GET request is sent to refresh the token.

/submit - Accepts form data submissions and stores them in memory. It expects a JSON body containing the form data (name, email, comment). A POST request is sent to submit the data.

/submissions - Retrieves all stored form data submissions. A GET request is sent to fetch the submissions.

/view-submissions - Serves the HTML page that displays all stored form data submissions. A GET request is used to serve the page.

/search - Performs a search for items in the Spotify catalog. Requires q and type query parameters. A GET request is sent to perform the search.

/top5 - Retrieves the top 5 lists of artists, songs, and albums. A GET request is sent to fetch the top 5 lists.

### Known Bugs



* Notepad feature refreshes info randomly, then info reappears when refreshed consistently.
* Generate page functionality is still buggy and is a work in progress.

### Future Development



* Refine Generate page. (Only put this because this is our most important page)
* Deploy the web application
* Propose app to some stakeholderak
* Allow users to edit and reorder their top 5 lists.ak
