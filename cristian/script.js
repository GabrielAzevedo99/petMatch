// --- Estado de favoritos ---
let favoritos = new Set();

// --- Elementos do DOM ---
const galeria = document.getElementById("galeria");
const resultadosInfo = document.getElementById("resultadosInfo");
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});


// --- Classificação de match ---
function getClassificacao(pct) {
  if (pct >= 90) return { texto: "⭐ Super Match", classe: "super" };
  if (pct >= 70) return { texto: "✓ Bom Match",   classe: "bom"   };
  return           { texto: "Match",                classe: "padrao" };
}

// --- Rótulos de tamanho ---
const tamanhoLabel = { pequeno: "🐾 Pequeno", medio: "🐾 Médio", grande: "🐾 Grande" };
const ambienteLabel = { apartamento: "🏢 Apartamento", casa: "🏡 Casa" };
const comportLabel  = { calmo: "😌 Calmo", ativo: "⚡ Ativo" };

// --- Renderizar galeria ---
async function renderPets() {
  galeria.innerHTML = "";

  const response = await fetch('../data/animals.json');
  const animals = await response.json();
  lista = animals;

  if (lista.length === 0) {
    galeria.innerHTML = `
      <div class="estado-vazio">
        <span class="vazio-icon">🐾</span>
        <p>Nenhum pet encontrado com esses filtros.</p>
        <small>Tente ajustar os filtros acima.</small>
      </div>`;
    resultadosInfo.textContent = "";
    return;
  }

  resultadosInfo.textContent = `${lista.length} pet${lista.length > 1 ? "s" : ""} encontrado${lista.length > 1 ? "s" : ""}`;

  lista.forEach(animal => {
    galeria.appendChild(renderCard(animal));
  });

  galeria.querySelectorAll(".btn-fav, .btn-fav-card").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorito(btn.dataset.nome);
    });
  });
}

// --- Favoritar ---
function toggleFavorito(nome) {
  if (favoritos.has(nome)) {
    favoritos.delete(nome);
    showToast(`${nome} removido dos favoritos`);
  } else {
    favoritos.add(nome);
    showToast(`${nome} adicionado aos favoritos! ❤`);
  }
  aplicarFiltros();
}

// --- Filtros ---
function aplicarFiltros() {
  const tipo        = document.getElementById("tipoFiltro").value;
  const tamanho     = document.getElementById("tamanhoFiltro").value;
  const ambiente    = document.getElementById("ambienteFiltro").value;
  const comportamento = document.getElementById("comportamentoFiltro").value;

  const filtrados = pets.filter(pet =>
    (tipo         === "todos" || pet.tipo         === tipo)        &&
    (tamanho      === "todos" || pet.tamanho      === tamanho)     &&
    (ambiente     === "todos" || pet.ambiente     === ambiente)    &&
    (comportamento === "todos" || pet.comportamento === comportamento)
  );

  renderPets(filtrados);
}

// Listeners dos selects
document.querySelectorAll("select").forEach(select => {
  select.addEventListener("change", aplicarFiltros);
});

// Botão limpar filtros
document.getElementById("btnLimpar").addEventListener("click", () => {
  document.querySelectorAll("select").forEach(s => s.value = "todos");
  aplicarFiltros();
  showToast("Filtros limpos!");
});

// --- Inicial ---
renderPets();

// by cristian
function renderCard(animal) {
  const matchScore = animal.matchScore;
  let matchClass = 'padrao';
  let matchText = `${matchScore}%`;

  if (matchScore >= 85) {
    matchClass = 'super';
    matchText = '⭐ SUPER MATCH';
  } else if (matchScore >= 70) {
    matchClass = 'bom';
    matchText = `✓ ${matchScore}%`;
  }

  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="card-img-wrap">
      <img src="${animal.images[0]}" alt="${animal.name}" />
      <div class="match-badge ${matchClass}">${matchText}</div>
      <button class="btn-fav" id="fav-${animal.id}" aria-label="Adicionar aos favoritos">🤍</button>
    </div>
    <div class="card-content">
      <div class="card-header">
        <span class="nome">${animal.name}</span>
        <div class="tags">
          <span class="tag">${animal.species}</span>
          <span class="tag">${animal.size}</span>
        </div>
      </div>
      <p class="caracteristicas">${animal.behaviors.join(', ')}</p>
      <div class="botoes">
        <button class="btn-detalhes" data-animal-id="${animal.id}">👁️ Ver Detalhes</button>
        <button class="btn-fav-card" data-animal-id="${animal.id}">❤️</button>
      </div>
    </div>
  `;

  // ADICIONAR EVENT LISTENER PARA NAVEGAÇÃO
  const btnDetalhes = card.querySelector('.btn-detalhes');
  btnDetalhes.addEventListener('click', () => {
    window.location.href = `detalhe/index.html?id=${animal.id}`;
  });

  // Adicionar evento de favorito
  const btnFav = card.querySelector(`#fav-${animal.id}`);
  const btnFavCard = card.querySelector('.btn-fav-card');
  
  // Verificar se já é favorito
  if (localStorage.getItem(`fav-${animal.id}`)) {
    btnFav.textContent = '❤️';
    btnFavCard.textContent = '❤️';
  }

  // Toggle favorito
  const toggleFav = () => {
    if (localStorage.getItem(`fav-${animal.id}`)) {
      localStorage.removeItem(`fav-${animal.id}`);
      btnFav.textContent = '🤍';
      btnFavCard.textContent = '❤️';
    } else {
      localStorage.setItem(`fav-${animal.id}`, 'true');
      btnFav.textContent = '❤️';
      btnFavCard.textContent = '❤️';
    }
  };

  btnFav.addEventListener('click', toggleFav);
  btnFavCard.addEventListener('click', toggleFav);

  return card;
}

// ALTERNATIVA: Se você quer clicar no card inteiro
function makeCardClickable(card, animalId) {
  card.style.cursor = 'pointer';
  
  card.addEventListener('click', (e) => {
    // Não navegar se clicou nos botões
    if (e.target.closest('.btn-fav, .botoes')) {
      return;
    }
    window.location.href = `detalhe.html?id=${animalId}`;
  });
}
