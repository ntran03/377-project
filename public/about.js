document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('submissionForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

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
});
