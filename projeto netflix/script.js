// ==============================
// 1. CONFIGURAÇÃO DO FIREBASE
// ==============================
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCwxwssYA4es33zOoY9jH8pts47SzbOilU",
  authDomain: "projeto-netflix-98011.firebaseapp.com",
  projectId: "projeto-netflix-98011",
  storageBucket: "projeto-netflix-98011.firebasestorage.app",
  messagingSenderId: "918024231494",
  appId: "1:918024231494:web:6906b8db300e5d4227c847",
  measurementId: "G-4PKFC8142Q"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Inicializa o Firestore

// ==============================
// 2. FUNÇÕES RELACIONADAS À API DO TMDB
// ==============================
const API_KEY = 'SUA_API_KEY';
const BASE_URL = 'https://api.themoviedb.org/3';

// Função para buscar filmes populares
async function fetchPopularMovies() {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
}

// Função para renderizar o carrossel
function renderCarousel(movies) {
    const carouselInner = document.querySelector('.carousel-inner');
    movies.forEach((movie, index) => {
        const item = document.createElement('div');
        item.classList.add('carousel-item', index === 0 ? 'active' : '');
        item.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="d-block w-100" alt="${movie.title}">
            <div class="carousel-caption d-none d-md-block">
                <h5>${movie.title}</h5>
            </div>
        `;
        carouselInner.appendChild(item);
    });
}

// Função para mostrar detalhes de um filme
function showMovieDetails(movie) {
    const movieDetails = document.getElementById('movieDetails');
    movieDetails.innerHTML = `
        <h2>${movie.title}</h2>
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <p>${movie.overview}</p>
        <p><strong>Classificação:</strong> ${movie.vote_average}</p>
    `;
}

// ==============================
// 3. FUNÇÕES RELACIONADAS AO FIRESTORE
// ==============================

// Salvar filmes favoritos no Firestore
async function saveFavoriteMovie(movie) {
    try {
        await addDoc(collection(db, "favorites"), {
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            overview: movie.overview,
            vote_average: movie.vote_average,
            timestamp: new Date()
        });
        alert(`"${movie.title}" foi adicionado aos favoritos!`);
    } catch (error) {
        console.error("Erro ao salvar filme favorito:", error);
        alert("Ocorreu um erro ao salvar o filme favorito.");
    }
}

// Buscar filmes favoritos do Firestore
async function fetchFavoriteMovies() {
    const favoritesContainer = document.getElementById('favoriteMovies');
    favoritesContainer.innerHTML = ''; // Limpa o container

    try {
        const q = query(collection(db, "favorites"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const movie = doc.data();
            const card = document.createElement('div');
            card.classList.add('col-md-4', 'movie-card');
            card.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <h4>${movie.title}</h4>
                <p><strong>Classificação:</strong> ${movie.vote_average}</p>
            `;
            favoritesContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao buscar filmes favoritos:", error);
        alert("Ocorreu um erro ao buscar os filmes favoritos.");
    }
}

// ==============================
// 4. EVENTOS E INICIALIZAÇÃO
// ==============================

// Função para buscar e renderizar a lista de filmes
async function fetchAndRenderMovies() {
    const movies = await fetchPopularMovies();
    const movieList = document.getElementById('movieList');
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.classList.add('col-md-4', 'movie-card');
        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h4>${movie.title}</h4>
            <button class="btn btn-primary favorite-btn" data-id="${movie.id}">Favoritar</button>
        `;
        card.addEventListener('click', () => showMovieDetails(movie));
        movieList.appendChild(card);

        // Adiciona evento ao botão de favoritar
        const favoriteButton = card.querySelector('.favorite-btn');
        favoriteButton.addEventListener('click', async (event) => {
            event.stopPropagation(); // Evita que o clique abra os detalhes do filme
            await saveFavoriteMovie(movie);
        });
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    fetchPopularMovies().then(renderCarousel);
    fetchAndRenderMovies();

    // Adiciona evento ao botão de mostrar favoritos
    document.getElementById('showFavoritesBtn').addEventListener('click', fetchFavoriteMovies);
});