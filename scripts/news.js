const newsContainer = document.getElementById("newsContainer");

async function carregarNoticias() {
  newsContainer.innerHTML = "<p>Carregando notícias...</p>";

  try {
    const res = await fetch("https://gnews.io/api/v4/search?q=football&lang=en&max=10&apikey=6e55df53fb852f29b86cc53cbec1705a");
    const data = await res.json();

    if (!data.articles || data.articles.length === 0) {
      newsContainer.innerHTML = "<p>Nenhuma notícia encontrada.</p>";
      return;
    }

    newsContainer.innerHTML = "";
    
    const first = data.articles[0];

newsContainer.innerHTML += `
  <div class="news-hero" onclick="window.open('${first.url}', '_blank')">
    <img src="${first.image}">
    <div class="overlay">
      <span class="badge"> Destaque</span>
      <h2>${first.title}</h2>
    </div>
  </div>
`;

    data.articles.slice(1).forEach(article => {
      newsContainer.innerHTML += `
        <div class="news-card" onclick='abrirNoticia(${JSON.stringify(article)})'>
          <img src="${article.image}">
          <div class="news-card-content">
            <h4>${article.title}</h4>
            <p>${article.description?.substring(0, 80) || ""}...</p>
            <span class="source">
              <i class="ri-global-line"></i> ${article.source.name}
            </span>
            
            <button class="save-btn">
  <i class="ri-bookmark-line"></i>
</button>
            
          </div>
        </div>
      `;
    });

  } catch (err) {
    newsContainer.innerHTML = "<p>Erro ao carregar notícias.</p>";
    console.error(err);
  }
}

carregarNoticias();

// FUNÇÃO PARA ABRIR NOTÍCIAS 
const newsOpenContent = document.getElementById("newsOpenContent");

function abrirNoticia(article) {

  // muda de página
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("newsOpen").classList.add("active");

  // conteúdo
  newsOpenContent.innerHTML = `
    <img src="${article.image}">
    <h2>${article.title}</h2>
    <p>${article.description || "Sem descrição disponível."}</p>

    <a href="${article.url}" target="_blank" class="read-btn">
      Ler notícia completa
    </a>
  `;
}

// FUNÇÃO VOLTAR 
function voltarNoticias() {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("news").classList.add("active");
}
