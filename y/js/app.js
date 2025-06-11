// Configuração da API
const API_CONFIG = {
    key: '378d279e455281cf6cd09787d6348ffe',
    baseUrl: 'https://api.themoviedb.org/3',
    imageBaseUrl: 'https://image.tmdb.org/t/p/w500',
    language: 'pt-BR'
};

// Cache para melhorar performance
const movieCache = new Map();

// Estado da aplicação
const appState = {
    isLoading: false,
    currentPage: 1,
    totalPages: 1,
    searchQuery: '',
    selectedGenre: null
};

// Utilitários
const utils = {
    // Debounce para otimizar pesquisas
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Formatação de data
    formatDate(dateString) {
        if (!dateString) return 'Data não disponível';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    },

    // Formatação de avaliação
    formatRating(rating) {
        return rating ? rating.toFixed(1) : 'N/A';
    },

    // Truncar texto
    truncateText(text, maxLength = 150) {
        if (!text) return 'Descrição não disponível';
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    },

    // Mostrar loading
    showLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    },

    // Esconder loading
    hideLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    },

    // Mostrar erro
    showError(message, container = null) {
        const errorHtml = `
            <div class="col-12">
                <div class="alert alert-danger text-center" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    ${message}
                    <button class="btn btn-outline-danger btn-sm ms-3" onclick="location.reload()">
                        <i class="fas fa-redo me-1"></i>Tentar Novamente
                    </button>
                </div>
            </div>
        `;
        
        if (container) {
            container.innerHTML = errorHtml;
        } else {
            console.error(message);
        }
    }
};

// Serviço da API
const apiService = {
    // Requisição base
    async makeRequest(endpoint, params = {}) {
        const cacheKey = `${endpoint}_${JSON.stringify(params)}`;
        
        // Verificar cache
        if (movieCache.has(cacheKey)) {
            return movieCache.get(cacheKey);
        }

        try {
            const url = new URL(`${API_CONFIG.baseUrl}${endpoint}`);
            url.searchParams.append('api_key', API_CONFIG.key);
            url.searchParams.append('language', API_CONFIG.language);
            
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            
            // Armazenar no cache
            movieCache.set(cacheKey, data);
            
            return data;
        } catch (error) {
            console.error('Erro na requisição da API:', error);
            throw error;
        }
    },

    // Buscar filmes populares
    async getPopularMovies(page = 1) {
        return this.makeRequest('/movie/popular', { page });
    },

    // Buscar filmes bem avaliados
    async getTopRatedMovies(page = 1) {
        return this.makeRequest('/movie/top_rated', { page });
    },

    // Buscar filmes em cartaz
    async getNowPlayingMovies(page = 1) {
        return this.makeRequest('/movie/now_playing', { page });
    },

    // Buscar próximos lançamentos
    async getUpcomingMovies(page = 1) {
        return this.makeRequest('/movie/upcoming', { page });
    },

    // Buscar detalhes do filme
    async getMovieDetails(movieId) {
        return this.makeRequest(`/movie/${movieId}`);
    },

    // Pesquisar filmes
    async searchMovies(query, page = 1) {
        return this.makeRequest('/search/movie', { query, page });
    }
};

// Renderização de componentes
const renderer = {
    // Criar card de filme
    createMovieCard(movie) {
        const imageUrl = movie.poster_path 
            ? `${API_CONFIG.imageBaseUrl}${movie.poster_path}`
            : 'https://via.placeholder.com/300x450/141414/ffffff?text=Sem+Imagem';

        return `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="movie-card" onclick="movieActions.showDetails(${movie.id})" role="button" tabindex="0" 
                     onkeypress="if(event.key==='Enter') movieActions.showDetails(${movie.id})">
                    <img src="${imageUrl}" alt="${movie.title}" class="img-fluid" loading="lazy">
                    <div class="overlay">
                        <h5 class="text-light">${movie.title}</h5>
                        <p class="text-light">${utils.truncateText(movie.overview, 100)}</p>
                        <div class="movie-info">
                            <span class="rating">
                                <i class="fas fa-star text-warning"></i>
                                ${utils.formatRating(movie.vote_average)}
                            </span>
                            <span class="release-date">
                                <i class="fas fa-calendar text-info"></i>
                                ${utils.formatDate(movie.release_date)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Renderizar seção de filmes
    renderMovieSection(movies, containerId) {
        console.log('Renderizando filmes:', movies); // Debug
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container não encontrado:', containerId);
            return;
        }

        if (!movies || movies.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-light">Nenhum filme encontrado.</div>';
            return;
        }

        try {
            const moviesHtml = movies.map(movie => this.createMovieCard(movie)).join('');
            container.innerHTML += moviesHtml; // Usando += para adicionar ao conteúdo existente
            console.log('Filmes renderizados com sucesso'); // Debug
        } catch (error) {
            console.error('Erro ao renderizar filmes:', error);
            container.innerHTML = '<div class="col-12 text-center text-light">Erro ao exibir filmes.</div>';
        }
    },

    // Renderizar loading skeleton
    renderLoadingSkeleton(containerId, count = 8) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const skeletonHtml = Array(count).fill().map(() => `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="movie-card skeleton">
                    <div class="skeleton-image"></div>
                    <div class="overlay">
                        <div class="skeleton-text skeleton-title"></div>
                        <div class="skeleton-text skeleton-description"></div>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = skeletonHtml;
    }
};

// Ações relacionadas aos filmes
const movieActions = {
    // Mostrar detalhes do filme
    async showDetails(movieId) {
        try {
            const movie = await apiService.getMovieDetails(movieId);
            const modal = new bootstrap.Modal(document.getElementById('movieModal'));
            
            const modalBody = document.getElementById('movieModalBody');
            const imageUrl = movie.poster_path 
                ? `${API_CONFIG.imageBaseUrl}${movie.poster_path}`
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
                        <div class="mt-3">
                            <button class="btn btn-primary me-2" onclick="movieActions.addToWatchlist(${movie.id})">
                                <i class="fas fa-plus"></i> Adicionar à Lista
                            </button>
                            <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank" class="btn btn-outline-secondary">
                                <i class="fas fa-external-link-alt"></i> Ver no TMDb
                            </a>
                        </div>
                    </div>
                </div>
            `;

            modal.show();
        } catch (error) {
            console.error('Erro ao carregar detalhes do filme:', error);
            alert('Erro ao carregar detalhes do filme. Tente novamente.');
        }
    },

    // Adicionar à lista de favoritos (simulado)
    addToWatchlist(movieId) {
        // Implementação futura - integração com localStorage ou backend
        console.log(`Filme ${movieId} adicionado à lista`);
        
        // Feedback visual
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <i class="fas fa-check-circle text-success"></i>
            Filme adicionado à sua lista!
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
};

// Carregamento de dados
const dataLoader = {
    // Carregar todas as seções
    async loadAllSections() {
        utils.showLoading();
        
        try {
            // Carregar seções em paralelo para melhor performance
            const [popular, topRated, nowPlaying, upcoming] = await Promise.allSettled([
                apiService.getPopularMovies(),
                apiService.getTopRatedMovies(),
                apiService.getNowPlayingMovies(),
                apiService.getUpcomingMovies()
            ]);

            // Renderizar cada seção
            if (popular.status === 'fulfilled') {
                renderer.renderMovieSection(popular.value.results, 'popular-movies');
            } else {
                utils.showError('Erro ao carregar filmes populares', document.getElementById('popular-movies'));
            }

            if (topRated.status === 'fulfilled') {
                renderer.renderMovieSection(topRated.value.results, 'top-rated-movies');
            } else {
                utils.showError('Erro ao carregar filmes bem avaliados', document.getElementById('top-rated-movies'));
            }

            if (nowPlaying.status === 'fulfilled') {
                renderer.renderMovieSection(nowPlaying.value.results, 'now-playing-movies');
            } else {
                utils.showError('Erro ao carregar filmes em cartaz', document.getElementById('now-playing-movies'));
            }

            if (upcoming.status === 'fulfilled') {
                renderer.renderMovieSection(upcoming.value.results, 'upcoming-movies');
            } else {
                utils.showError('Erro ao carregar próximos lançamentos', document.getElementById('upcoming-movies'));
            }

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            utils.showError('Erro ao carregar filmes. Verifique sua conexão e tente novamente.');
        } finally {
            utils.hideLoading();
        }
    },

    // Carregar seção específica
    async loadSection(sectionType, containerId) {
        renderer.renderLoadingSkeleton(containerId);
        
        try {
            let data;
            switch (sectionType) {
                case 'popular':
                    data = await apiService.getPopularMovies();
                    break;
                case 'top_rated':
                    data = await apiService.getTopRatedMovies();
                    break;
                case 'now_playing':
                    data = await apiService.getNowPlayingMovies();
                    break;
                case 'upcoming':
                    data = await apiService.getUpcomingMovies();
                    break;
                default:
                    throw new Error('Tipo de seção inválido');
            }

            renderer.renderMovieSection(data.results, containerId);
        } catch (error) {
            console.error(`Erro ao carregar seção ${sectionType}:`, error);
            utils.showError(`Erro ao carregar ${sectionType}`, document.getElementById(containerId));
        }
    }
};

// Inicialização da aplicação
const app = {
    // Inicializar aplicação
    async init() {
        try {
            // Configurar event listeners
            this.setupEventListeners();
            
            // Carregar dados iniciais
            await dataLoader.loadAllSections();
            
            console.log('Aplicação inicializada com sucesso!');
        } catch (error) {
            console.error('Erro ao inicializar aplicação:', error);
            utils.showError('Erro ao inicializar aplicação. Recarregue a página.');
        }
    },

    // Configurar event listeners
    setupEventListeners() {
        // Scroll da navbar
        window.addEventListener('scroll', utils.debounce(() => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
            }
        }, 10));

        // Tratamento de erros globais
        window.addEventListener('error', (event) => {
            console.error('Erro global capturado:', event.error);
        });

        // Tratamento de promessas rejeitadas
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Promise rejeitada:', event.reason);
            event.preventDefault();
        });
    }
};

// Exportar funções para uso global
window.movieActions = movieActions;
window.dataLoader = dataLoader;
window.utils = utils;

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Exportar para uso em outros módulos
export { apiService, renderer, movieActions, dataLoader, utils };

// Funções globais para os botões
window.playMovie = function(movieId) {
    const tmdbUrl = `https://www.themoviedb.org/movie/${movieId}`;
    window.open(tmdbUrl, "_blank");
};

window.addToList = function(movieId) {
    console.log('Adicionar filme à lista:', movieId);
    // Implementar lógica de adicionar à lista
};