import { fetchMovies } from './app.js';

async function fetchMovieDetails(movieId) {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`);
    const data = await response.json();
    displayModal(data); // Implemente a função `displayModal` no arquivo `modal.js`
}

// Exemplo de uso: Quando o usuário clica em um filme, chame `fetchMovieDetails`