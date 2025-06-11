import { apiService, renderer, utils } from './app.js';

const searchInput = document.getElementById('search-input');
console.log('Search input element:', searchInput);

// Get all movie sections and their containers
const searchResultsSection = document.getElementById('search-results-section');
const searchResultsTitle = document.getElementById('search-results-title');
const searchResultsGrid = document.getElementById('search-results-grid');

const popularMoviesGrid = document.getElementById('popular-movies-grid');
const topRatedMoviesGrid = document.getElementById('top-rated-movies-grid');
const nowPlayingMoviesGrid = document.getElementById('now-playing-movies-grid');
const upcomingMoviesGrid = document.getElementById('upcoming-movies-grid');

// Get all movie sections
const movieSections = document.querySelectorAll('.movie-section');

let searchTimeout;

// Function to render movie cards (reusable for all sections)
function renderMovieCards(container, movies, query = '') {
    container.innerHTML = ''; // Clear previous content

    if (movies.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center text-light">
                <h3>Nenhum filme encontrado para: "${query}"</h3>
                <p>Tente buscar com outros termos.</p>
            </div>
        `;
        return;
    }

    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.className = 'movie-card';
        movieDiv.innerHTML = `
            <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450/141414/ffffff?text=Sem+Imagem'}"
                 alt="${movie.title}"
                 loading="lazy">
            <div class="overlay">
                <h5>${movie.title}</h5>
                <p>${movie.overview ? movie.overview.slice(0, 100) + '...' : 'Sem descrição disponível'}</p>
                <div class="movie-info">
                    <span class="rating">
                        <i class="fas fa-star text-warning"></i>
                        ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                    </span>
                    <span class="release-date">
                        <i class="fas fa-calendar text-info"></i>
                        ${movie.release_date ? new Date(movie.release_date).toLocaleDateString('pt-BR') : 'N/A'}
                    </span>
                </div>
            </div>
        `;
        movieDiv.addEventListener('click', () => movieActions.showDetails(movie.id));
        container.appendChild(movieDiv);
    });
}

// Function to show/hide sections
function toggleSections(showSearch = false) {
    movieSections.forEach(section => {
        if (showSearch && section.id !== 'search-results-section') {
            section.style.display = 'none';
        } else if (!showSearch && section.id === 'search-results-section') {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
        }
    });
}

// Function to load all movie sections
async function loadAllMovieSections() {
    try {
        utils.showLoading();
        
        // Load Popular Movies
        const popularMovies = await apiService.getPopularMovies();
        renderMovieCards(popularMoviesGrid, popularMovies.results);
        
        // Load Top Rated Movies
        const topRatedMovies = await apiService.getTopRatedMovies();
        renderMovieCards(topRatedMoviesGrid, topRatedMovies.results);
        
        // Load Now Playing Movies
        const nowPlayingMovies = await apiService.getNowPlayingMovies();
        renderMovieCards(nowPlayingMoviesGrid, nowPlayingMovies.results);
        
        // Load Upcoming Movies
        const upcomingMovies = await apiService.getUpcomingMovies();
        renderMovieCards(upcomingMoviesGrid, upcomingMovies.results);
        
    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
    } finally {
        utils.hideLoading();
    }
}

// Search functionality
searchInput.addEventListener('input', () => {
    console.log('Input event triggered');
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(async () => {
        const query = searchInput.value.trim();
        console.log('Search query:', query);

        if (query) {
            utils.showLoading();
            try {
                const data = await apiService.searchMovies(query);
                console.log('Search results:', data);

                searchResultsTitle.textContent = `Resultados para: "${query}"`;
                renderMovieCards(searchResultsGrid, data.results, query);
                toggleSections(true);

            } catch (error) {
                console.error('Erro ao buscar filmes:', error);
                searchResultsGrid.innerHTML = `
                    <div class="col-12 text-center text-light">
                        <h3>Erro ao buscar filmes</h3>
                        <p>Por favor, tente novamente mais tarde.</p>
                    </div>
                `;
                searchResultsTitle.textContent = `Erro na Busca`;
                toggleSections(true);
            } finally {
                utils.hideLoading();
            }
        } else {
            searchResultsGrid.innerHTML = '';
            searchResultsTitle.textContent = '';
            toggleSections(false);
        }
    }, 500);
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    loadAllMovieSections();
    toggleSections(false);
});