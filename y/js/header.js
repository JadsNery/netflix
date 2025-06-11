const headerContent = `
    <div class="collapse" id="navbarToggleExternalContent">
        <div class="bg-light p-4">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <ul class="navbar-nav">
                            <li class="nav-item"><a class="nav-link" href="/index.html"><i class="fas fa-home me-1"></i>Home</a></li>
                            <li class="nav-item"><a class="nav-link" href="#"><i class="fas fa-film me-1"></i>Lançamentos</a></li>
                            <li class="nav-item"><a class="nav-link" href="#"><i class="fas fa-flag me-1"></i>Nacionais</a></li>
                            <li class="nav-item"><a class="nav-link" href="#"><i class="fas fa-star me-1"></i>Favoritos</a></li>
                            <li class="nav-item"><a class="nav-link" href="#"><i class="fas fa-calendar me-1"></i>Em Cartaz</a></li>
                            <li class="nav-item"><a class="nav-link" href="#"><i class="fas fa-trophy me-1"></i>Mais Vistos</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="/index.html">CINEMA EM CASA</a>
            <div class="d-flex align-items-center">
                <div class="search-container me-3">
                    <input type="text" id="search-input" class="form-control search-input" placeholder="Buscar filmes..." aria-label="Buscar filmes">
                    <i class="fas fa-search search-icon"></i>
                </div>
                <div class="navbar-nav d-flex flex-row">
                    <a class="nav-link me-3" href="#" title="Notificações">
                        <i class="fas fa-bell"></i>
                    </a>
                    <a class="nav-link" href="#" title="Perfil">
                        <i class="fas fa-user"></i>
                    </a>
                </div>
                <button class="navbar-toggler ms-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>
        </div>
    </nav>
`;
document.getElementById('header').innerHTML = headerContent;