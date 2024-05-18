document.addEventListener('DOMContentLoaded', function() {
    let currentIndex = 0;
    let images = [
        'albumart1.jpeg',
        'albumart2.jpg',
        'albumart3.jpg',
        'albumart4.jpeg',
    ];

    document.getElementById('albumImage').src = images[0];

    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        document.getElementById('albumImage').src = images[currentIndex];
    }, 3000);
});