// import songList from "./spotify_top_hits_clean_json"
import { songList } from './spotify_top_hits_clean_json.js';

const buttons = document.querySelectorAll(".result-btn")
const resultCard = document.getElementById('result-card');


buttons.forEach((button)=> {
    button.addEventListener("click", () => {
        const buttonText = button.textContent;
    
        if (buttonText === 'Most Common Genre') {
            createGenreChart();
        } else if (buttonText === 'Year Song Released') {
            createYearChart();
        } else if (buttonText === 'Loudest Song') {
            createLoudestSongChart();
        }
    })
    
})

function createGenreChart() {
    const genreCounts = {};

        // Outer loop to iterate over the songList array
for (const song of songList) {
    
    const genres = song.genre.split(',').map(g => g.trim());
    
    // Inner loop to iterate over each genre
    for (const genre of genres) {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    }
}

    const labels = Object.keys(genreCounts);
    const data = Object.values(genreCounts);

    const canvas = document.createElement('canvas');
    canvas.id = 'genreChart';
    resultCard.innerHTML = ''; // Clear previous content
    resultCard.appendChild(canvas);

    const ctx = canvas.getContext('2d'); // Get the context of the canvas element
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Songs',
                data: data,
                backgroundColor: 'rgba(35, 255, 64, 0.8)',
                borderColor: 'rgb(0, 0, 0)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createYearChart() {
    const yearCounts = {};
    songList.forEach(song => {
        const year = song.year;
        yearCounts[year] = (yearCounts[year] || 0) + 1;
    });

    const labels = Object.keys(yearCounts);
    const data = Object.values(yearCounts);

    const canvas = document.createElement('canvas');
    canvas.id = 'yearChart';
    resultCard.innerHTML = ''; // Clear previous content
    resultCard.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Songs by Year',
                data: data,
                backgroundColor: [
                    'rgb(23, 255, 23)',
                    'rgb(4, 83, 8)',
                    'rgb(12, 207, 29)'
                ],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            }
        }
    });
}

function createLoudestSongChart() {

    // Sort the songList by loudness in descending order
    const sortedSongs = [...songList].sort((a, b) => b.loudness - a.loudness);

    // Take the top 10 loudest songs
    const top10Loudest = sortedSongs.slice(0, 10);

    // Extract song names and loudness values
    const labels = top10Loudest.map(song => song.song);
    const data = top10Loudest.map(song => song.loudness);

    const canvas = document.createElement('canvas');
    canvas.id = 'loudestSongChart';
    resultCard.innerHTML = ''; // Clear previous content
    resultCard.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
              label: 'Loudest Song',
              data: data,
              fill: false,
              borderColor: 'rgb(5, 255, 5)',
              tension: 0.1
            }]
        },
    });
}