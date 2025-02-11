// import songList from "./spotify_top_hits_clean_json"
import { songList } from './spotify_top_hits_clean_json.js';

const buttons = document.querySelectorAll(".result-btn")
const resultCard = document.getElementById('result-card');
const API_KEY = "BQB3pkDCW9Zb2vB6B_zLe3qRClmEMoOZZh04EGZp23KY5ugOOQ2m_F8NGOacZa6QseUwweVicGThKB6WZ-t2UkcoobcJ5mJgOi3PG_SL5qIa14XeDFbbUMpkXFLq8OG69o1cC5AwmNs"

function showForm() { //displays the search entry bar
    const resultCard = document.getElementById('result-card')
    resultCard.innerHTML = ''
    const artistSearch = document.createElement('div')
    artistSearch.innerHTML =
    `
    <form id="artist-search-form">
        <label for="artist-input">Search for artist</label>
        <input type="text" name="artist" id="search" class="search-input" placeholder="Taylor Swift">
        <button type="submit" id="submit-button">Search</button>
    </form>
    `
    resultCard.prepend(artistSearch)
    
    const form = document.getElementById('artist-search-form')
    form.addEventListener('submit', handleSubmit)
}

const  handleSubmit = async (e) => {
    e.preventDefault()

    const inputForm = document.querySelector("#search");
    const artistRequest = inputForm.value

    const artists = await searchArtists(artistRequest)
    displayArtistCards(artists);
}

const searchArtists = async (artist) => {
    const requestURL = `https://api.spotify.com/v1/search?q=${artist}&type=artist&limit=5&offset=0`
    const details = {
        method: "GET",
        headers: {
            Authorization: `Bear ${API_KEY}`
        }
    }
    const result = await fetch(requestURL,details)
    console.log(result)
    const json = await result

    const retrievedArtists = json.artists.items
    const cleanedArtistData = retrievedArtists.map((item) => {
        return {
            id: artist.id,
            name: artist.name,
            link: artist.external.urls.spotify,
            followers: artist.followers,
            popularity: artist.popularity,
            genre: artist.genres,
            image: (artist.images.length > 0 ? artist.images[0].url : "")

        }
    })
    return cleanedArtistData;
}

function displayArtistCards(artistDetails) {//displays the artists found to the screen

    const resultCard = document.getElementById('result-card')
    resultCard.innerHTML = ''
    showForm()

    console.log("Artist details : ", artistDetails)

    const cardsContainer = document.createElement('div')
    artistDetails.forEach((artist) => {
        const card = document.createElement('div')
        card.innerHTML = 
            `
            <div class="card-container">
            <div class="detail-container">
                <div class="img-container">
                    <img src=${artist.image ? artist.image : 'https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png'} alt=${artist.name}/>
                </div>
                <div class="info-container">
                    <h4>
                        ${artist.name}
                    </h4>
                    <div>
                        <span>${artist.genre} ◆ </span>
                        <span>${artist.followers} Followers ◆ </span>
                        <span>Popularity ${artist.popularity}</span>
                    </div>
                </div>
            </div>
            <h6 class="visit-link"><a href=${artist.link}>Visit Artist</a></h6>
            </div>
            `
            
            card.addEventListener('click', () => {handleArtistClick(artist.id)})
            cardsContainer.appendChild(card)
        })
        
        resultCard.append(cardsContainer)
}


buttons.forEach((button)=> {
    button.addEventListener("click", () => {
        const buttonText = button.textContent;
    
        if (buttonText === 'Most Common Genre') {
            createGenreChart();
        } else if (buttonText === 'Year Song Released') {
            createYearChart();
        } else if (buttonText === 'Loudest Song') {
            createLoudestSongChart();
        } else if (buttonText === "Search") {
            showForm();
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
                backgroundColor: 'rgba(35, 222, 255, 0.8)',
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
                    'rgb(23, 162, 255)',
                    'rgb(4, 58, 83)',
                    'rgb(12, 119, 207)'
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
              borderColor: 'rgb(30, 5, 255)',
              tension: 0.1
            }]
        },
    });
}