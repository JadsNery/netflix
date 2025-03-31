// Variáveis globais
const API_KEY = '378d279e455281cf6cd09787d6348ffe';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w1280'; // URL base para imagens grandes

// Função para buscar filmes populares
async function fetchCarouselMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`);
        const data = await response.json();
        displayCarousel(data.results.slice(0, 5)); // Exibe apenas os 5 primeiros filmes
    } catch (error) {
        console.error('Erro ao buscar filmes para o carrossel:', error);
    }
}

// Função para exibir o carrossel
function displayCarousel(movies) {
    const indicatorsContainer = document.getElementById('carousel-indicators');
    const innerContainer = document.getElementById('carousel-inner');

    indicatorsContainer.innerHTML = ''; // Limpa os indicadores anteriores
    innerContainer.innerHTML = ''; // Limpa os itens do carrossel anteriores

    movies.forEach((movie, index) => {
        // Cria os indicadores
        const indicator = document.createElement('button');
        indicator.setAttribute('type', 'button');
        indicator.setAttribute('data-bs-target', '#carouselExampleCaptions');
        indicator.setAttribute('data-bs-slide-to', index);
        if (index === 0) indicator.classList.add('active');
        indicator.setAttribute('aria-label', `Slide ${index + 1}`);
        indicatorsContainer.appendChild(indicator);

        // Cria os itens do carrossel
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === 0) carouselItem.classList.add('active');

        carouselItem.innerHTML = `
            <img src="${movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : 'https://via.placeholder.com/1280x400'}" class="d-block w-100" alt="${movie.title}">
            <div class="carousel-caption d-none d-md-block">
                <h5>${movie.title}</h5>
                <p>${movie.overview.slice(0, 100)}...</p>
            </div>
        `;
        innerContainer.appendChild(carouselItem);
    });
}

// Inicializa o carrossel ao carregar a página
fetchCarouselMovies();