

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('submissionForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way
        createInfo();

        var formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            comment: document.getElementById('comment').value
        };

        fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('responseMessage').innerText = 'Submited Successfully!';
                console.log('Success:', data);
                loadSubmissions(); // Reload submissions after successful submission
            })
            .catch((error) => {
                document.getElementById('responseMessage').innerText = 'An error occurred!';
                console.error('Error:', error);
            });
    });

    function loadSubmissions() {
        fetch('/submissions')
            .then(response => response.json())
            .then(data => {
                const displayDiv = document.getElementById('submissions');
                displayDiv.innerHTML = ''; // Clear previous submissions
                data.forEach(submission => {
                    displayDiv.innerHTML += `<p>Name: ${submission.name}<br>Email: ${submission.email}<br>Comment: ${submission.comment}</p>`;
                });
            });
    }

    loadSubmissions(); // Initial load of submissions
    addTokenToLinks();
    greet();
});

async function greet() {
    let access_token = localStorage.getItem("access_token");

    if (!access_token) {
        console.error('Access token not found. Please authenticate.');
        return;
    }

    try {
        const response = await fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        console.log('User Profile:', data);
        document.getElementById("greeting").innerHTML = "Hello, " + data.display_name + "!"
    } catch (error) {
        console.error('Error:', error);
    }
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
//document.addEventListener('DOMContentLoaded', addTokenToLinks)
window.onload = () => {
    fetchToken();
}

//new supabase code
var host = window.location.origin;

async function createInfo() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const comment = document.getElementById('comment').value;

    await fetch(`${host}/api/supabase/ticket`, {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, comment })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
