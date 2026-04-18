// EXEMPLO DE INTEGRAÇÃO - adicionar ao script.js do index.html

// Modificar a função que cria os cards para adicionar navegação
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
    window.location.href = `detalhe.html?id=${animal.id}`;
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
