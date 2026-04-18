const pets = [
  {
    nome: "Luna",
    tipo: "gato",
    tamanho: "pequeno",
    ambiente: "apartamento",
    comportamento: "calmo",
    compatibilidade: 92,
    imagem: "https://placecats.com/400/300",
    caracteristicas: "Calma, gosta de colo e adora uma soneca ao sol"
  },
  {
    nome: "Max",
    tipo: "gato",
    tamanho: "medio",
    ambiente: "apartamento",
    comportamento: "calmo",
    compatibilidade: 75,
    imagem: "https://placecats.com/401/300",
    caracteristicas: "Tranquilo e amigável, se dá bem com crianças"
  },
  {
    nome: "Bella",
    tipo: "cao",
    tamanho: "grande",
    ambiente: "casa",
    comportamento: "ativo",
    compatibilidade: 60,
    imagem: "https://place.dog/400/300",
    caracteristicas: "Energia alta, ama corridas e brincadeiras ao ar livre"
  },
  {
    nome: "Thor",
    tipo: "cao",
    tamanho: "grande",
    ambiente: "casa",
    comportamento: "ativo",
    compatibilidade: 85,
    imagem: "https://place.dog/401/300",
    caracteristicas: "Brincalhão e leal, ideal para famílias com espaço"
  },
  {
    nome: "Mel",
    tipo: "cao",
    tamanho: "pequeno",
    ambiente: "apartamento",
    comportamento: "calmo",
    compatibilidade: 78,
    imagem: "https://place.dog/402/300",
    caracteristicas: "Pequenina e dócil, perfeita para apartamentos"
  },
  {
    nome: "Simba",
    tipo: "gato",
    tamanho: "medio",
    ambiente: "casa",
    comportamento: "ativo",
    compatibilidade: 55,
    imagem: "https://placecats.com/402/300",
    caracteristicas: "Curioso e aventureiro, adora explorar cada cantinho"
  },
  {
    nome: "Nina",
    tipo: "cao",
    tamanho: "medio",
    ambiente: "apartamento",
    comportamento: "calmo",
    compatibilidade: 88,
    imagem: "https://place.dog/403/300",
    caracteristicas: "Meiga e obediente, se adapta bem a qualquer ambiente"
  },
  {
    nome: "Rex",
    tipo: "cao",
    tamanho: "grande",
    ambiente: "casa",
    comportamento: "ativo",
    compatibilidade: 70,
    imagem: "https://place.dog/404/300",
    caracteristicas: "Protetor e companheiro, precisa de muito espaço para correr"
  }
];

// --- Estado de favoritos ---
let favoritos = new Set();

// --- Elementos do DOM ---
const galeria = document.getElementById("galeria");
const resultadosInfo = document.getElementById("resultadosInfo");
const modalOverlay = document.getElementById("modalOverlay");
const modalFechar = document.getElementById("modalFechar");
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
function renderPets(lista) {
  galeria.innerHTML = "";

  // Ordenar por compatibilidade (maior primeiro)
  const ordenada = [...lista].sort((a, b) => b.compatibilidade - a.compatibilidade);

  if (ordenada.length === 0) {
    galeria.innerHTML = `
      <div class="estado-vazio">
        <span class="vazio-icon">🐾</span>
        <p>Nenhum pet encontrado com esses filtros.</p>
        <small>Tente ajustar os filtros acima.</small>
      </div>`;
    resultadosInfo.textContent = "";
    return;
  }

  resultadosInfo.textContent = `${ordenada.length} pet${ordenada.length > 1 ? "s" : ""} encontrado${ordenada.length > 1 ? "s" : ""}`;

  ordenada.forEach(pet => {
    const match   = getClassificacao(pet.compatibilidade);
    const isFav   = favoritos.has(pet.nome);

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${pet.imagem}" alt="Foto de ${pet.nome}" loading="lazy">
        <span class="match-badge ${match.classe}">${match.texto} ${pet.compatibilidade}%</span>
        <button class="btn-fav ${isFav ? "favoritado" : ""}" data-nome="${pet.nome}" aria-label="${isFav ? "Remover dos favoritos" : "Favoritar"} ${pet.nome}">
          ${isFav ? "❤" : "🤍"}
        </button>
      </div>
      <div class="card-content">
        <div class="card-header">
          <span class="nome">${pet.nome}</span>
          <div class="tags">
            <span class="tag">${tamanhoLabel[pet.tamanho]}</span>
            <span class="tag">${ambienteLabel[pet.ambiente]}</span>
            <span class="tag">${comportLabel[pet.comportamento]}</span>
          </div>
        </div>
        <p class="caracteristicas">${pet.caracteristicas}</p>
        <div class="botoes">
          <button class="btn-detalhes" data-nome="${pet.nome}">Ver detalhes</button>
          <button class="btn-fav-card ${isFav ? "favoritado" : ""}" data-nome="${pet.nome}">
            ${isFav ? "❤ Favoritado" : "🤍 Favoritar"}
          </button>
        </div>
      </div>
    `;

    galeria.appendChild(card);
  });

  // Eventos dos cards
  galeria.querySelectorAll(".btn-detalhes").forEach(btn => {
    btn.addEventListener("click", () => abrirModal(btn.dataset.nome));
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

// --- Modal de detalhes ---
function abrirModal(nome) {
  const pet = pets.find(p => p.nome === nome);
  if (!pet) return;

  const match = getClassificacao(pet.compatibilidade);

  document.getElementById("modalImg").src = pet.imagem;
  document.getElementById("modalImg").alt = "Foto de " + pet.nome;
  document.getElementById("modalNome").textContent = pet.nome;
  document.getElementById("modalCaracteristicas").textContent = pet.caracteristicas;
  document.getElementById("modalMatch").textContent = `${match.texto} ${pet.compatibilidade}%`;
  document.getElementById("modalMatch").className = "modal-match-badge " + match.classe;

  const tagsEl = document.getElementById("modalTags");
  tagsEl.innerHTML = `
    <span class="tag">${tamanhoLabel[pet.tamanho]}</span>
    <span class="tag">${ambienteLabel[pet.ambiente]}</span>
    <span class="tag">${comportLabel[pet.comportamento]}</span>
  `;

  const btnAdotar = document.getElementById("modalAdotar");
  btnAdotar.onclick = () => {
    fecharModal();
    showToast(`Solicitação de adoção de ${pet.nome} enviada! 🐾`);
  };

  modalOverlay.classList.add("aberto");
  document.body.style.overflow = "hidden";
}

function fecharModal() {
  modalOverlay.classList.remove("aberto");
  document.body.style.overflow = "";
}

modalFechar.addEventListener("click", fecharModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) fecharModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") fecharModal();
});

// --- Toast ---
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("visivel");
  setTimeout(() => toast.classList.remove("visivel"), 2800);
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
renderPets(pets);
