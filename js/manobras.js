let manobrasDisponiveis = [];

// Função para carregar as manobras do arquivo JSON
async function carregarManobras() {
  try {
    const response = await fetch('js/manobras.json');
    const data = await response.json();

    // Transforma o objeto em um array plano com a dificuldade incluída
    manobrasDisponiveis = [
      ...data.manobras.iniciante.map((m) => ({
        ...m,
        dificuldade: 'Iniciante',
      })),
      ...data.manobras.intermediario.map((m) => ({
        ...m,
        dificuldade: 'Intermediário',
      })),
      ...data.manobras.avancado.map((m) => ({ ...m, dificuldade: 'Avançado' })),
    ];

    // Inicializa a aplicação após carregar as manobras
    new SkateApp();
  } catch (error) {
    console.error('Erro ao carregar as manobras:', error);
  }
}

// Carrega as manobras quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', carregarManobras);
