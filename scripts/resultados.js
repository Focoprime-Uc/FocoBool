let jogosCache = [];

const LEAGUE_ID = 4328; // Premier League
const RESULTS_CONTAINER = document.getElementById("results");

async function carregarResultadosPremium() {
  mostrarSkeleton();

  try {
    // 1️⃣ Buscar últimos jogos da liga
    const resMatches = await fetch(`https://www.thesportsdb.com/api/v1/json/3/eventspastleague.php?id=${LEAGUE_ID}`);
    const dataMatches = await resMatches.json();

    // 2️⃣ Buscar tabela da liga
    const resTable = await fetch(`https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=${LEAGUE_ID}&s=2025-2026`);
    const dataTable = await resTable.json();

    RESULTS_CONTAINER.innerHTML = "";

    // 3️⃣ Mostrar últimos 8 jogos
    dataMatches.events.slice(0, 8).forEach(match => {

  jogosCache.push(match); // 👈 AQUI

  const home = match.strHomeTeam;
  const away = match.strAwayTeam;
  const homeScore = match.intHomeScore ?? "-";
  const awayScore = match.intAwayScore ?? "-";
  const homeLogo = match.strHomeTeamBadge ?? "";
  const awayLogo = match.strAwayTeamBadge ?? "";
  const status = match.strStatus || "Finalizado";

  let resultColor = "black";
  if (homeScore > awayScore) resultColor = "green";
  else if (homeScore < awayScore) resultColor = "red";
  else resultColor = "orange";

  RESULTS_CONTAINER.innerHTML += `
    <div class="match premium" onclick="abrirJogo(${jogosCache.length - 1})">
      
      <div class="team-logo">
        ${homeLogo ? `<img src="${homeLogo}" alt="${home}"/>` : ""}
        <span class="team-name">${home}</span>
      </div>

      <div class="score" style="color:${resultColor}">
        ${homeScore} - ${awayScore}
        ${status === "LIVE" ? '<span class="live-badge">🔴 AO VIVO</span>' : ''}
      </div>

      <div class="team-logo">
        ${awayLogo ? `<img src="${awayLogo}" alt="${away}"/>` : ""}
        <span class="team-name">${away}</span>
      </div>

    </div>
  `;
});

    // 4️⃣ Mostrar tabela de classificação
    RESULTS_CONTAINER.innerHTML += `<h4 class="table-title"> Classificação Premier League</h4>`;
    RESULTS_CONTAINER.innerHTML += `<div class="league-table"><div class="table-header">
      <span>Pos</span><span>Time</span><span>P</span><span>V</span><span>E</span><span>D</span><span>GP</span><span>GC</span><span>SG</span>
    </div></div>`;
    
    const tableDiv = RESULTS_CONTAINER.querySelector(".league-table");

    dataTable.table.forEach(team => {
      tableDiv.innerHTML += `
        <div class="table-row">
          <span>${team.intRank}</span>
          <span>${team.strTeam}</span>
          <span>${team.intPoints}</span>
          <span>${team.intWin}</span>
          <span>${team.intDraw}</span>
          <span>${team.intLoss}</span>
          <span>${team.intGoalsFor}</span>
          <span>${team.intGoalsAgainst}</span>
          <span>${team.intGoalDifference}</span>
        </div>
      `;
      
    });

  } catch (error) {
    RESULTS_CONTAINER.innerHTML = "Erro ao carregar dados premium";
    console.error(error);
  }
}

// carregar e atualizar
carregarResultadosPremium();
setInterval(carregarResultadosPremium, 60000);

// SKELETON AO PROCESSAR 
function mostrarSkeleton() {
  let skeletonHTML = "";

  // skeleton jogos
  for (let i = 0; i < 6; i++) {
    skeletonHTML += `
      <div class="skeleton-match">
        <div class="skeleton skeleton-team"></div>
        <div class="skeleton skeleton-score"></div>
        <div class="skeleton skeleton-team"></div>
      </div>
    `;
  }

  // skeleton tabela
  skeletonHTML += `<div style="margin-top:10px;">`;

  for (let i = 0; i < 6; i++) {
    skeletonHTML += `
      <div class="skeleton-table-row">
        ${'<div class="skeleton skeleton-cell"></div>'.repeat(9)}
      </div>
    `;
  }

  skeletonHTML += `</div>`;

  RESULTS_CONTAINER.innerHTML = skeletonHTML;
}

// ABRIR JOGO
function abrirJogo(index) {
  const jogo = jogosCache[index];

  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("ticketPage").classList.add("active");

  const container = document.getElementById("ticketDetalhe");

  const isFav = localStorage.getItem(jogo.idEvent);

  // stats fake (API free não tem)
  const homeStats = Math.floor(Math.random() * 60) + 20;
  const awayStats = 100 - homeStats;

  container.innerHTML = `
    <div class="detalhe-jogo premium-open">

      <!-- FAVORITO -->
      <button class="fav-btn" onclick="toggleFavorito('${jogo.idEvent}')">
        <i class="ri-heart-${isFav ? 'fill' : 'line'}"></i>
      </button>

      <!-- TIMES -->
      <div class="teams-open">
        <div class="team-open">
          <img src="${jogo.strHomeTeamBadge}" />
          <span>${jogo.strHomeTeam}</span>
        </div>

        <div class="score-open">
          ${jogo.intHomeScore ?? "-"} 
          <span>vs</span> 
          ${jogo.intAwayScore ?? "-"}
        </div>

        <div class="team-open">
          <img src="${jogo.strAwayTeamBadge}" />
          <span>${jogo.strAwayTeam}</span>
        </div>
      </div>

      <!-- INFO -->
      <div class="game-info">
        <div><i class="ri-calendar-line"></i> ${jogo.dateEvent}</div>
        <div><i class="ri-time-line"></i> ${jogo.strTime}</div>
        <div><i class="ri-trophy-line"></i> ${jogo.strLeague}</div>
        <div><i class="ri-map-pin-line"></i> ${jogo.strVenue ?? "Desconhecido"}</div>
      </div>

      <!-- ESTATÍSTICAS -->
      <div class="stats">
        <h4>Estatísticas</h4>

        <div class="stat-row">
          <span>${homeStats}%</span>
          <div class="bar">
            <div style="width:${homeStats}%"></div>
          </div>
          <span>${awayStats}%</span>
        </div>

        <small>Posse de bola</small>

        <div class="stat-row">
          <span>${Math.floor(Math.random()*10)}</span>
          <div class="bar">
            <div style="width:50%"></div>
          </div>
          <span>${Math.floor(Math.random()*10)}</span>
        </div>

        <small>Remates</small>

      </div>

    </div>
  `;
}

// FUNÇÃO FAVORITE 
function toggleFavorito(id) {
  if (localStorage.getItem(id)) {
    localStorage.removeItem(id);
  } else {
    localStorage.setItem(id, true);
  }

  carregarResultadosPremium(); // atualiza UI
}