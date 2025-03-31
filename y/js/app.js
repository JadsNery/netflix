// Variáveis globais
const API_KEY = '378d279e455281cf6cd09787d6348ffe';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // URL base para imagens

// Função para buscar filmes populares
async function fetchMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`);
        if (!response.ok) throw new Error('Erro ao buscar filmes');
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        alert('Não foi possível carregar os filmes. Tente novamente mais tarde.');
    }
}

// Função para exibir os filmes na página
function displayMovies(movies) {
    const container = document.getElementById('movies-container');
    container.innerHTML = ''; // Limpa o conteúdo anterior

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.classList.add('col-md-3', 'mb-4');
        card.innerHTML = `
            <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank" class="text-decoration-none">
                <div class="movie-card">
                    <img src="${movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : 'https://via.placeholder.com/300x450'}" alt="${movie.title}" class="img-fluid">
                    <div class="overlay">
                        <h5 class="text-light">${movie.title}</h5>
                        <p class="text-light">${movie.overview.slice(0, 100)}...</p>
                    </div>
                </div>
            </a>
        `;
        container.appendChild(card);
    });
}

// Função para inicializar a aplicação
function initApp() {
    fetchMovies(); // Carrega filmes populares ao iniciar
}

// Exportar funções para uso em outros módulos, se necessário
export { fetchMovies, displayMovies };

// Inicializa a aplicação ao carregar a página
document.addEventListener('DOMContentLoaded', initApp);