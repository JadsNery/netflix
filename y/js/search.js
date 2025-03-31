import { fetchMovies, displayMovies } from './app.js';

const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', async () => {
    const query = searchInput.value.trim();
    if (query) {
        const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${query}`);
        const data = await response.json();
        displayMovies(data.results);
    } else {
        fetchMovies(); // Exibe filmes populares se o campo de pesquisa estiver vazio
    }
});