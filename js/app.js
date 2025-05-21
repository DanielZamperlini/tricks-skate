// Classe para gerenciar o estado da aplicação
class SkateApp {
  constructor() {
    this.minhaLista = JSON.parse(localStorage.getItem('minhaLista')) || [];
    this.manobrasDisponiveis = manobrasDisponiveis;
    this.init();
    this.setupEventListeners();
  }

  init() {
    this.renderizarManobrasDisponiveis();
    this.renderizarMinhaLista();
    this.filtrarManobras(); // Filtra para mostrar apenas manobras iniciantes inicialmente
  }

  setupEventListeners() {
    // Evento de pesquisa
    const searchInput = document.getElementById('searchInput');
    const dificuldadeFilter = document.getElementById('dificuldadeFilter');

    if (searchInput) {
      searchInput.addEventListener('input', () => this.filtrarManobras());
    }
    if (dificuldadeFilter) {
      dificuldadeFilter.addEventListener('change', () =>
        this.filtrarManobras(),
      );
    }
  }

  filtrarManobras() {
    const searchTerm =
      document.getElementById('searchInput')?.value.toLowerCase() || '';
    const dificuldade =
      document.getElementById('dificuldadeFilter')?.value || 'todas';

    const manobrasFiltradas = this.manobrasDisponiveis.filter((manobra) => {
      const matchSearch =
        manobra.nome.toLowerCase().includes(searchTerm) ||
        manobra.descricao.toLowerCase().includes(searchTerm);
      const matchDificuldade =
        dificuldade === 'todas' || manobra.dificuldade === dificuldade;
      return matchSearch && matchDificuldade;
    });

    this.renderizarManobrasFiltradas(manobrasFiltradas);
  }

  renderizarManobrasFiltradas(manobras) {
    const container = document.getElementById('manobrasDisponiveis');
    if (!container) return;

    container.innerHTML = '';

    manobras.forEach((manobra) => {
      const manobraElement = this.criarElementoManobra(manobra, false);
      container.appendChild(manobraElement);
    });
  }

  // Renderiza a lista de manobras disponíveis
  renderizarManobrasDisponiveis() {
    const container = document.getElementById('manobrasDisponiveis');
    if (!container) return;

    container.innerHTML = '';

    this.manobrasDisponiveis.forEach((manobra) => {
      const manobraElement = this.criarElementoManobra(manobra, false);
      container.appendChild(manobraElement);
    });
  }

  // Renderiza a lista pessoal de manobras
  renderizarMinhaLista() {
    const container = document.getElementById('minhaLista');
    if (!container) return;

    container.innerHTML = '';

    this.minhaLista.forEach((manobra) => {
      const manobraElement = this.criarElementoManobra(manobra, true);
      container.appendChild(manobraElement);
    });
  }

  // Cria um elemento HTML para uma manobra
  criarElementoManobra(manobra, naMinhaLista) {
    const div = document.createElement('div');
    div.className = 'manobra-item';
    if (manobra.concluida) {
      div.classList.add('manobra-concluida');
    }

    const info = document.createElement('div');
    info.innerHTML = `
            <strong>${manobra.nome}</strong>
            <span>(${manobra.dificuldade})</span>
        `;

    const botoes = document.createElement('div');
    botoes.className = 'botoes';

    if (naMinhaLista) {
      const btnConcluir = document.createElement('button');
      btnConcluir.className = 'btn-concluir';
      btnConcluir.innerHTML = manobra.concluida
        ? '<i class="fas fa-redo"></i> Refazer'
        : '<i class="fas fa-check"></i> Concluir';
      btnConcluir.onclick = () => this.toggleConcluida(manobra.id);
      botoes.appendChild(btnConcluir);

      const btnRemover = document.createElement('button');
      btnRemover.className = 'btn-remover';
      btnRemover.innerHTML = '<i class="fas fa-trash"></i> Remover';
      btnRemover.onclick = () => this.removerManobra(manobra.id);
      botoes.appendChild(btnRemover);
    } else {
      const btnAdicionar = document.createElement('button');
      btnAdicionar.className = 'btn-adicionar';
      btnAdicionar.innerHTML = '<i class="fas fa-plus"></i> Adicionar';
      btnAdicionar.onclick = () => this.adicionarManobra(manobra);
      botoes.appendChild(btnAdicionar);
    }

    div.appendChild(info);
    div.appendChild(botoes);
    return div;
  }

  // Adiciona uma manobra à lista pessoal
  adicionarManobra(manobra) {
    if (!this.minhaLista.find((m) => m.id === manobra.id)) {
      this.minhaLista.push({ ...manobra, concluida: false });
      this.salvarLista();
      this.renderizarMinhaLista();
    }
  }

  // Remove uma manobra da lista pessoal
  removerManobra(id) {
    this.minhaLista = this.minhaLista.filter((m) => m.id !== id);
    this.salvarLista();
    this.renderizarMinhaLista();
  }

  // Marca uma manobra como concluída ou não
  toggleConcluida(id) {
    const manobra = this.minhaLista.find((m) => m.id === id);
    if (manobra) {
      manobra.concluida = !manobra.concluida;
      this.salvarLista();
      this.renderizarMinhaLista();
    }
  }

  // Salva a lista no localStorage
  salvarLista() {
    localStorage.setItem('minhaLista', JSON.stringify(this.minhaLista));
  }
}

// Função para gerar lista aleatória de treino
function gerarListaAleatoria() {
  const app = new SkateApp();
  const numManobras =
    parseInt(document.getElementById('numManobras').value) || 5;
  const categoriaSelecionada = document.getElementById('categoriaFilter').value;

  // Filtra as manobras pela categoria selecionada
  let manobrasFiltradas = app.manobrasDisponiveis;
  if (categoriaSelecionada !== 'todas') {
    const categorias = categoriaSelecionada.split(',');
    manobrasFiltradas = app.manobrasDisponiveis.filter((manobra) =>
      categorias.includes(manobra.dificuldade),
    );
  }

  // Verifica se há manobras suficientes
  if (manobrasFiltradas.length < numManobras) {
    alert(
      `Não há manobras suficientes na categoria selecionada. Máximo disponível: ${manobrasFiltradas.length}`,
    );
    return;
  }

  // Seleciona manobras aleatórias
  const manobrasSelecionadas = [];
  const manobrasDisponiveis = [...manobrasFiltradas];

  for (let i = 0; i < numManobras; i++) {
    const randomIndex = Math.floor(Math.random() * manobrasDisponiveis.length);
    manobrasSelecionadas.push(manobrasDisponiveis[randomIndex]);
    manobrasDisponiveis.splice(randomIndex, 1);
  }

  // Limpa a lista atual e adiciona as novas manobras
  app.minhaLista = manobrasSelecionadas.map((manobra) => ({
    ...manobra,
    concluida: false,
  }));
  app.salvarLista();
  app.renderizarMinhaLista();
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new SkateApp();
});
