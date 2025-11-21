// Variáveis do DOM
const cardContainer = document.querySelector(".card-container");
const inputBusca = document.getElementById("input-busca");

// Variável para armazenar os dados carregados apenas uma vez
let todasLinguagens = [];

/**
 * Carrega o arquivo JSON e armazena os dados.
 * É chamada apenas uma vez ao carregar a página.
 */
async function carregarDados() {
  try {
    // Note: O nome do arquivo foi padronizado para 'data.json'
    const resposta = await fetch("data.json");
    
    if (!resposta.ok) {
        throw new Error(`Erro ao carregar dados: ${resposta.status}`);
    }
    
    todasLinguagens = await resposta.json();
    
    // Renderiza todos os cards após o carregamento inicial
    renderizarCards(todasLinguagens);
  } catch (erro) {
    console.error("Falha no carregamento da base de dados:", erro);
    cardContainer.innerHTML = `<p class="erro-mensagem">⚠️ Não foi possível carregar a base de conhecimento. Tente novamente mais tarde.</p>`;
  }
}

/**
 * Lógica principal de busca. Filtra os cards com base no input do usuário.
 * É chamada pelo 'onsubmit' do formulário (ao clicar em 'Buscar' ou apertar Enter).
 */
function iniciarBusca() {
  // Garantia: Se o input não existir (improvável com o HTML sugerido), a busca não ocorre
  if (!inputBusca) return; 

  // 1. Obtém o termo de busca em minúsculas
  const termo = inputBusca.value.toLowerCase().trim();

  // 2. Filtra o array de dados
  const dadosFiltrados = todasLinguagens.filter(dado => {
    // Verifica se o termo de busca está no nome OU na descrição
    const nome = dado.nome.toLowerCase();
    const descricao = dado.descricao.toLowerCase();
    
    return nome.includes(termo) || descricao.includes(termo);
  });
  
  // 3. Renderiza os resultados filtrados
  renderizarCards(dadosFiltrados);
}

/**
 * Limpa o container e renderiza os cards de um array de dados específico.
 * @param {Array<Object>} dados - O array de linguagens a ser renderizado.
 */
function renderizarCards(dados) {
  // Limpa o conteúdo anterior
  cardContainer.innerHTML = ""; 
  
  // Se não houver resultados, mostra uma mensagem de feedback
  if (dados.length === 0) {
    cardContainer.innerHTML = `<p class="feedback-mensagem">Nenhuma linguagem encontrada com esse termo.</p>`;
    return;
  }

  // Cria e anexa os elementos Article
  for (let dado of dados) {
    const article = document.createElement("article");
    article.classList.add("card");
    
    // Template String melhorado (usando a classe .card-year sugerida no CSS)
    article.innerHTML = `
      <h2>${dado.nome} <span class="card-year">(${dado.ano_lancamento})</span></h2>
      <p>${dado.descricao}</p>
      <a href="${dado.link}" target="_blank">Saiba mais...</a>
    `;
    
    cardContainer.appendChild(article);
  }
}

// Ouve o evento 'input' para buscar dinamicamente enquanto o usuário digita
if (inputBusca) {
    inputBusca.addEventListener('input', iniciarBusca);
}

// Inicia o carregamento dos dados quando o script é executado (ao carregar a página)
document.addEventListener('DOMContentLoaded', carregarDados);
