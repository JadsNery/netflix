import { apiService, renderer, utils } from './app.js';

async function fetchMovieDetails(movieId) {
    try {
        const data = await apiService.getMovieDetails(movieId);
        displayModal(data);
    } catch (error) {
        console.error('Erro ao buscar detalhes do filme:', error);
    }
}

function displayModal(movie) {
    const modalBody = document.getElementById('movieModalBody');
    const imageUrl = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/300x450/141414/ffffff?text=Sem+Imagem';

    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <img src="${imageUrl}" alt="${movie.title}" class="img-fluid rounded">
            </div>
            <div class="col-md-8">
                <h3>${movie.title}</h3>
                <p class="text-muted">${movie.tagline || ''}</p>
                <p><strong>Sinopse:</strong> ${movie.overview || 'Não disponível'}</p>
                <p><strong>Data de Lançamento:</strong> ${utils.formatDate(movie.release_date)}</p>
                <p><strong>Avaliação:</strong> 
                    <span class="badge bg-warning text-dark">
                        <i class="fas fa-star"></i> ${utils.formatRating(movie.vote_average)}
                    </span>
                </p>
                <p><strong>Duração:</strong> ${movie.runtime ? movie.runtime + ' minutos' : 'Não informado'}</p>
                <p><strong>Gêneros:</strong> ${movie.genres ? movie.genres.map(g => g.name).join(', ') : 'Não informado'}</p>
            </div>
        </div>
    `;
}

export { fetchMovieDetails, displayModal };

// Exemplo de uso: Quando o usuário clica em um filme, chame `fetchMovieDetails`