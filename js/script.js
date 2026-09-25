(function () {
  "use strict";

  const app = document.querySelector("#app");

  const assets = {
    loginBackground: "assets/auth-login-bg.png",
    teamBackground: "assets/auth-team-bg.png",
    brandLogo: "assets/vod-review-logo.png",
    eye: "assets/eye.svg",
    upload: "assets/image.svg",
    haven: "assets/haven.png",
    rushone: "assets/rushone.png",
    greenOwls: "assets/green-owls.png",
    caap: "assets/caap-hellhounds.png",
    a2e: "assets/a2e-uff.png",
    ufu: "assets/ufu-saints.png",
    ceub: "assets/ceub-octopus.png",
    azure: "assets/azure-bears.png",
    reviewMap: "assets/review-map.png",
    brazil: "assets/brazil.png",
    wolf: "assets/wolf-gaming.png",
    poli: "assets/poli-plague.png",
    pucc: "assets/pucc-cardinals.png",
    chartGrid: "assets/chart-grid.svg",
    chartAverage: "assets/chart-average.png",
    povs: [
      "assets/POV 1.jpg",
      "assets/POV 2.jpg",
      "assets/POV 3.jpg",
      "assets/POV 4.jpg",
      "assets/POV 5.jpg"
    ],
    agents: {
      omen: { portrait: "assets/agents/omen-portrait.png", icon: "assets/agents/omen-icon.png" },
      jett: { portrait: "assets/agents/jett-portrait.png", icon: "assets/agents/jett-icon.png" },
      sova: { portrait: "assets/agents/sova-portrait.png", icon: "assets/agents/sova-icon.png" },
      killjoy: { portrait: "assets/agents/killjoy-portrait.png", icon: "assets/agents/killjoy-icon.png" },
      viper: { portrait: "assets/agents/viper-portrait.png", icon: "assets/agents/viper-icon.png" }
    }
  };

  const routes = new Set([
    "login", "equipe", "dashboard", "partidas", "jogadores", "usuarios",
    "revisoes", "gravacoes", "sincronizacao", "revisao", "sintese"
  ]);

  function getRoute() {
    const route = window.location.hash.replace(/^#\/?/, "").split("?")[0];
    return routes.has(route) ? route : "login";
  }

  function navigate(route) {
    window.location.hash = route;
  }

  function getProfileFromUrl() {
    const searchProfile = new URLSearchParams(window.location.search).get("perfil");
    const hashQuery = window.location.hash.includes("?") ? window.location.hash.split("?")[1] : "";
    const hashProfile = new URLSearchParams(hashQuery).get("perfil");
    const requestedProfile = (searchProfile || hashProfile || "treinador").toLocaleLowerCase("pt-BR");
    return ["admin", "administrador"].includes(requestedProfile) ? "admin" : "trainer";
  }

  function globalNavigation(active, profile = "trainer") {
    const items = profile === "admin"
      ? [{ key: "users", label: "Usuários e Equipes", href: "#usuarios" }]
      : [
          { key: "team", label: "Meu Time", href: "#dashboard" },
          { key: "matches", label: "Partidas", href: "#partidas" },
          { key: "reviews", label: "Revisões", href: "#revisoes" }
        ];

    return `<nav class="global-nav" aria-label="Navegação principal">
      ${items.map((item) => `<a class="global-nav__item${item.key === active ? " is-active" : ""}" href="${item.href}"${item.demo ? " data-demo-link" : ""}${item.key === active ? ' aria-current="page"' : ""}>${item.label}</a>`).join("")}
    </nav>`;
  }

  function teamSectionNavigation(active) {
    const items = [
      { key: "overview", label: "Visão Geral", href: "#dashboard" },
      { key: "players", label: "Players", href: "#jogadores" }
    ];

    return `<nav class="content-tabs__nav" aria-label="Seções da equipe">
      ${items.map((item) => `<a class="content-tab${item.key === active ? " is-active" : ""}" href="${item.href}"${item.demo ? " data-demo-link" : ""}${item.key === active ? ' aria-current="page"' : ""}>${item.label}</a>`).join("")}
    </nav>`;
  }

  function teamSummary({ compact = false } = {}) {
    return `<section class="team-summary${compact ? " team-summary--compact" : ""}" aria-label="Resumo da equipe">
      <div class="team-summary__identity">
        <img class="team-summary__logo" src="${assets.rushone}" alt="Logo RUSH ONE">
        <h1 class="team-summary__name">RUSH ONE</h1>
        <div class="team-summary__meta"><span>RSH</span><span>·</span><img src="${assets.brazil}" alt="Brasil"><span>· 2W 1L · 33.85% WR</span></div>
      </div>
      ${compact ? "" : `<p class="team-summary__metric">43%</p>
      <dl class="team-summary__facts"><dt>Ranking:</dt><dd>#1</dd><dt>Info 2:</dt><dd>--</dd><dt>Info 3:</dt><dd>--</dd></dl>`}
    </section>`;
  }

  function authShell(options) {
    const isLogin = options.kind === "login";
    return `
      <section class="auth-screen" data-screen="${options.kind}">
        <aside class="auth-branding" style="--auth-background: url('../${options.background}')" aria-label="Identidade visual ${isLogin ? "da plataforma VOD Review" : "da equipe"}">
          <div class="brand-heading">
            ${isLogin ? `<img class="brand-logo" src="${assets.brandLogo}" alt="VOD Review">` : '<p class="brand-mark brand-mark--large">LOGO DA EQUIPE</p>'}
            ${isLogin ? "" : '<span class="brand-heading__rule" aria-hidden="true"></span>'}
          </div>
          <p class="brand-footer">
            <span class="brand-footer__identity">© 2026 ${isLogin ? `<img src="${assets.brandLogo}" alt="VOD Review">` : "RUSH ONE ESPORTS"}</span>
            <span>V4.2.1-RELEASE</span>
          </p>
        </aside>
        <div class="auth-panel">
          <div class="step-indicator" aria-hidden="true"><span></span><span></span><span></span></div>
          ${options.content}
          <div class="auth-panel__bottom-space${isLogin ? "" : " auth-panel__bottom-space--line"}" aria-hidden="true"></div>
        </div>
      </section>`;
  }

  function loginScreen() {
    const profile = getProfileFromUrl();
    const isAdmin = profile === "admin";
    return authShell({
      kind: "login",
      background: assets.loginBackground,
      content: `
        <form class="auth-card" data-form="login">
          <header class="auth-title-group">
            <h1 class="auth-title">LOGIN</h1>
            <p class="auth-description">Entre com suas credenciais para acessar a plataforma.</p>
            <p class="login-profile-hint"><span>PERFIL DO LINK</span><strong>${isAdmin ? "ADMINISTRADOR" : "TREINADOR"}</strong></p>
          </header>
          <div class="form-stack">
            <div class="field">
              <label for="login-user">E-MAIL OU USUÁRIO</label>
              <div class="input-shell"><input id="login-user" name="user" type="text" value="${isAdmin ? "admin@vodreview.gg" : "treinador@vodreview.gg"}" autocomplete="username"></div>
            </div>
            <div class="field">
              <div class="field__head">
                <label for="login-password">SENHA DE ACESSO</label>
              </div>
              <div class="input-shell">
                <input id="login-password" name="password" type="password" value="vodreview-demo" autocomplete="current-password">
                <button class="password-toggle" type="button" data-password-toggle aria-label="Mostrar senha"><img src="${assets.eye}" alt=""></button>
              </div>
            </div>
            <label class="check-row">
              <input type="checkbox" checked>
              <span class="check-row__box" aria-hidden="true"></span>
              <span>Lembra-me</span>
            </label>
          </div>
          <div class="actions">
            <button class="primary-button" type="submit">ENTRAR NO TERMINAL</button>
          </div>
        </form>`
    });
  }

  function teamScreen() {
    return authShell({
      kind: "equipe",
      background: assets.teamBackground,
      content: `
        <form class="auth-card auth-card--team" data-form="team">
          <header class="auth-title-group">
            <h1 class="auth-title">CRIAR EQUIPE</h1>
            <p class="auth-description">Cadastre as informações da equipe vinculada ao treinador responsável.</p>
          </header>
          <div class="form-stack form-stack--team">
            <label class="logo-uploader" for="team-logo-input">
              <input class="sr-only" id="team-logo-input" type="file" accept="image/png,image/jpeg">
              <span class="logo-uploader__preview" data-logo-preview><img src="${assets.upload}" alt=""></span>
              <span class="logo-uploader__copy">
                <strong class="logo-uploader__title">UPLOAD DA LOGO DA EQUIPE</strong>
                <span class="logo-uploader__help">Arraste arquivos PNG, JPG (recomendado 512x512px)</span>
              </span>
            </label>
            <div class="field">
              <label for="team-name">NOME DA EQUIPE</label>
              <div class="input-shell"><input id="team-name" name="teamName" type="text" value="RUSH ONE ESPORTS"></div>
            </div>
            <div class="form-row">
              <div class="field field--tag">
                <div class="field__head"><label for="team-tag">TAG / SIGLA</label><span class="hint">MÁX 4 CH.</span></div>
                <div class="input-shell"><input id="team-tag" name="tag" type="text" maxlength="4" value="RSH"></div>
              </div>
              <div class="field">
                <label for="team-region">REGIÃO / PAÍS</label>
                <div class="input-shell select-shell">
                  <select id="team-region" name="region">
                    <option>América do Sul (Brasil)</option>
                    <option>América do Norte</option>
                    <option>Europa</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="actions"><button class="primary-button" type="submit">FINALIZAR E ENTRAR NO PAINEL</button></div>
        </form>`
    });
  }

  const recentMatches = [
    { week: "2 Semana", rival: "CEUB Octopus", rivalLogo: assets.ceub, logoSize: 22, ours: 2, theirs: 1, result: "win" },
    { week: "3 Semana", rival: "Azure Bears", rivalLogo: assets.azure, logoSize: 20, ours: 0, theirs: 2, result: "loss" },
    { week: "2 Semana", rival: "CAAP Hellhounds", rivalLogo: assets.caap, logoSize: 17, ours: 2, theirs: 1, result: "win" },
    { week: "2 Semana", rival: "A2E UFF", rivalLogo: assets.a2e, logoSize: 20, ours: 2, theirs: 0, result: "win" },
    { week: "2 Semana", rival: "UFU Saints", rivalLogo: assets.ufu, logoSize: 19, ours: 2, theirs: 0, result: "win" },
    { week: "2 Semana", rival: "UFU Saints", rivalLogo: assets.ufu, logoSize: 19, ours: 2, theirs: 0, result: "win" }
  ];

  const players = [
    { rating: 82, name: "Psyder", agent: "Omen", portrait: assets.agents.omen.portrait, icons: [{ name: "Omen", src: assets.agents.omen.icon }, { name: "Viper", src: assets.agents.viper.icon }] },
    { rating: 93, name: "caKo", agent: "Jett", portrait: assets.agents.jett.portrait, icons: [{ name: "Jett", src: assets.agents.jett.icon }, { name: "Omen", src: assets.agents.omen.icon }] },
    { rating: 75, name: "Jhons", agent: "Sova", portrait: assets.agents.sova.portrait, icons: [{ name: "Sova", src: assets.agents.sova.icon }, { name: "Killjoy", src: assets.agents.killjoy.icon }] },
    { rating: 86, name: "iSay", agent: "Killjoy", portrait: assets.agents.killjoy.portrait, icons: [{ name: "Killjoy", src: assets.agents.killjoy.icon }, { name: "Viper", src: assets.agents.viper.icon }] },
    { rating: 71, name: "Ethan", agent: "Viper", portrait: assets.agents.viper.portrait, icons: [{ name: "Viper", src: assets.agents.viper.icon }, { name: "Sova", src: assets.agents.sova.icon }] }
  ];

  const recentNotes = [
    {
      tag: "TÁTICA",
      round: "ROUND 18",
      time: "12:42",
      title: "DEFESA — HAVEN A",
      body: "Rotação tardia após o contato. Revisar o utilitário do Sova no retake.",
      author: "caKo"
    },
    {
      tag: "ECONOMIA",
      round: "ROUND 07",
      time: "12:31",
      title: "PISTOL — SPLIT",
      body: "Evitar compra fragmentada. Priorizar entrada da Jett com flash coordenada.",
      author: "Psyder"
    },
    {
      tag: "SETUP",
      round: "ROUND 21",
      time: "12:18",
      title: "PÓS-PLANT — B",
      body: "Manter dupla em crossfire e guardar a Viper Pit para o segundo contato.",
      author: "iSay"
    }
  ];

  const chartData = [
    { x: "0%", date: "04/19", logo: assets.ceub, logoSize: 31, logoOffset: 8, logoTop: 257, a: ["W", 74, 95], b: ["L", 63, 64] },
    { x: "16.66%", date: "04/10", logo: assets.azure, logoSize: 31, logoOffset: 9, logoTop: 257, a: ["W", 72, 90], b: ["L", 65, 70] },
    { x: "33.33%", date: "02/07", logo: assets.caap, logoSize: 31, logoOffset: 11, logoTop: 257, a: ["L", 63, 64], b: ["L", 66, 73] },
    { x: "50%", date: "01/25", logo: assets.a2e, logoSize: 34, logoOffset: 10, logoTop: 255, a: ["L", 68, 78], b: ["L", 68, 78] },
    { x: "66.66%", date: "01/24", logo: assets.wolf, logoSize: 31, logoOffset: 9, logoTop: 257, a: ["W", 77, 104], b: ["L", 57, 48] },
    { x: "83.33%", date: "01/24", logo: assets.poli, logoSize: 33, logoOffset: 9, logoTop: 259, a: ["W", 73, 92], b: ["L", 68, 78] },
    { x: "100%", date: "01/18", logo: assets.pucc, logoSize: 29, logoOffset: -3, logoTop: 257, a: ["L", 68, 78], b: null }
  ];

  function matchRow(match) {
    const oursMuted = match.result === "loss" ? " is-muted" : "";
    const rivalMuted = match.result === "win" ? " is-muted" : "";
    return `
      <article class="match-row">
        <div class="match-row__meta"><span><strong>Mar 28</strong> · 12:20 PM</span><span>${match.week}</span></div>
        <div class="match-row__team${oursMuted}">
          <span class="match-row__identity"><span class="match-logo"><img src="${assets.rushone}" alt=""></span><span>UNIRV RUSH ONE</span></span>
          <span class="match-row__score">${match.ours}</span>
        </div>
        <div class="match-row__team${rivalMuted}">
          <span class="match-row__identity"><span class="match-logo" style="--logo-size:${match.logoSize}px"><img src="${match.rivalLogo}" alt=""></span><span>${match.rival}</span></span>
          <span class="match-row__score">${match.theirs}</span>
        </div>
      </article>`;
  }

  function playerCard(player) {
    return `
      <article class="player-card" aria-label="${player.name}, agente principal ${player.agent}">
        <img class="player-card__portrait" src="${player.portrait}" alt="${player.agent}">
        <span class="player-card__shade" aria-hidden="true"></span>
        <p class="player-card__rating">${player.rating}</p>
        <h3 class="player-card__name">${player.name}</h3>
        <div class="player-card__icons" aria-label="Agentes mais usados">
          ${player.icons.map((icon) => `<span><img src="${icon.src}" alt="${icon.name}" title="${icon.name}"></span>`).join("")}
        </div>
      </article>`;
  }

  function noteCard(note, index) {
    return `
      <article class="note-card" aria-label="Anotação ${index + 1}: ${note.title}">
        <div class="note-card__topline">
          <span class="note-card__index">0${index + 1}</span>
          <span class="note-card__tag">${note.tag}</span>
        </div>
        <h3 class="note-card__title">${note.title}</h3>
        <p class="note-card__body">${note.body}</p>
        <footer class="note-card__footer">
          <span>${note.round} · ${note.time}</span>
          <span>POR ${note.author}</span>
        </footer>
      </article>`;
  }

  function chartBar(data, position) {
    if (!data) return "";
    const isWin = data[0] === "W";
    return `<div class="chart-bar chart-bar--${position}${isWin ? " is-win" : ""}" style="height:${data[2]}px">
      <span class="chart-bar__result">${data[0]}</span><span class="chart-bar__score">${data[1]}</span>
    </div>`;
  }

  function chartGroup(item, index) {
    return `<div class="chart-group" style="--group-x:${item.x};--logo-size:${item.logoSize}px;--logo-offset:${item.logoOffset}px;--logo-top:${item.logoTop}px" data-chart-position="${index}">
      <span class="chart-group__date">${item.date}</span>
      ${chartBar(item.a, "first")}${chartBar(item.b, "second")}
      <img class="chart-group__logo" src="${item.logo}" alt="">
    </div>`;
  }

  const matchCatalog = [
    { status: "FINALIZADA", result: "WIN", date: "28 MAR · 12:20", event: "VPL · SEMANA 2", opponent: "GREEN OWLS", opponentTag: "UNB", logo: assets.greenOwls, score: "2 — 0", map: "HAVEN", selected: true },
    { status: "FINALIZADA", result: "LOSS", date: "21 MAR · 19:00", event: "VPL · SEMANA 2", opponent: "AZURE BEARS", opponentTag: "AZR", logo: assets.azure, score: "0 — 2", map: "ASCENT" },
    { status: "FINALIZADA", result: "WIN", date: "14 MAR · 18:30", event: "VPL · SEMANA 1", opponent: "CAAP HELLHOUNDS", opponentTag: "CAAP", logo: assets.caap, score: "2 — 1", map: "LOTUS" },
    { status: "AGENDADA", result: "UPCOMING", date: "30 MAR · 13:00", event: "VPL · SEMANA 3", opponent: "CEUB OCTOPUS", opponentTag: "CEUB", logo: assets.ceub, score: "—", map: "A DEFINIR" }
  ];

  const homeScoreboard = [
    { player: "caKo", agent: "Jett", icon: assets.agents.jett.icon, rating: "1.31", acs: 268, k: 22, d: 13, a: 5, diff: "+9", kast: "78%", hs: "31%", fk: 6, fd: 2 },
    { player: "Psyder", agent: "Omen", icon: assets.agents.omen.icon, rating: "1.18", acs: 224, k: 18, d: 14, a: 11, diff: "+4", kast: "74%", hs: "24%", fk: 3, fd: 2 },
    { player: "iSay", agent: "Killjoy", icon: assets.agents.killjoy.icon, rating: "1.12", acs: 208, k: 17, d: 13, a: 8, diff: "+4", kast: "81%", hs: "27%", fk: 2, fd: 1 },
    { player: "Jhons", agent: "Sova", icon: assets.agents.sova.icon, rating: "1.04", acs: 191, k: 15, d: 14, a: 13, diff: "+1", kast: "76%", hs: "22%", fk: 1, fd: 2 },
    { player: "Ethan", agent: "Viper", icon: assets.agents.viper.icon, rating: "0.98", acs: 176, k: 14, d: 15, a: 7, diff: "−1", kast: "71%", hs: "29%", fk: 1, fd: 3 }
  ];

  const opponentScoreboard = [
    { player: "luk", agent: "Jett", icon: assets.agents.jett.icon, rating: "1.09", acs: 216, k: 17, d: 17, a: 4, diff: "0", kast: "70%", hs: "28%", fk: 4, fd: 3 },
    { player: "koala", agent: "Omen", icon: assets.agents.omen.icon, rating: "0.97", acs: 188, k: 14, d: 16, a: 9, diff: "−2", kast: "68%", hs: "25%", fk: 2, fd: 3 },
    { player: "nzt", agent: "Sova", icon: assets.agents.sova.icon, rating: "0.91", acs: 174, k: 13, d: 17, a: 10, diff: "−4", kast: "65%", hs: "20%", fk: 1, fd: 2 },
    { player: "dalla", agent: "Killjoy", icon: assets.agents.killjoy.icon, rating: "0.86", acs: 162, k: 12, d: 17, a: 6, diff: "−5", kast: "63%", hs: "26%", fk: 2, fd: 3 },
    { player: "brave", agent: "Viper", icon: assets.agents.viper.icon, rating: "0.79", acs: 149, k: 10, d: 19, a: 7, diff: "−9", kast: "59%", hs: "23%", fk: 1, fd: 3 }
  ];

  function matchCatalogCard(match) {
    const resultClass = match.result === "WIN" ? " is-win" : match.result === "LOSS" ? " is-loss" : " is-upcoming";
    return `<button class="match-catalog-card${match.selected ? " is-selected" : ""}" type="button" aria-label="${match.opponent}, ${match.status}"${match.selected ? ' data-open-match-detail aria-controls="selected-match-detail"' : ""}>
      <span class="match-catalog-card__top"><span>${match.date}</span><span>${match.event}</span></span>
      <span class="match-catalog-card__body">
        <span class="match-catalog-card__team"><img src="${assets.rushone}" alt=""><span><strong>RUSH ONE</strong><small>RSH</small></span></span>
        <span class="match-catalog-card__score${resultClass}"><small>${match.result === "UPCOMING" ? match.status : match.result}</small><strong>${match.score}</strong></span>
        <span class="match-catalog-card__team match-catalog-card__team--opponent"><img src="${match.logo}" alt=""><span><strong>${match.opponent}</strong><small>${match.opponentTag}</small></span></span>
      </span>
      <span class="match-catalog-card__bottom"><span>${match.map}</span><span>${match.status}</span></span>
    </button>`;
  }

  function scoreboardRows(players) {
    return players.map((player, index) => `<tr>
      <td class="scoreboard-player"><span class="scoreboard-position">0${index + 1}</span><img src="${player.icon}" alt="${player.agent}"><span><strong>${player.player}</strong><small>${player.agent}</small></span></td>
      <td class="is-emphasis">${player.rating}</td><td>${player.acs}</td><td>${player.k}</td><td>${player.d}</td><td>${player.a}</td><td class="${player.diff.startsWith("+") ? "is-positive" : player.diff.startsWith("−") ? "is-negative" : ""}">${player.diff}</td><td>${player.kast}</td><td>${player.hs}</td><td>${player.fk}</td><td>${player.fd}</td>
    </tr>`).join("");
  }

  function scoreboardTable(team, tag, logo, score, side, players) {
    return `<section class="scoreboard-team scoreboard-team--${side}" aria-labelledby="scoreboard-${side}">
      <header class="scoreboard-team__header">
        <div class="scoreboard-team__identity"><img src="${logo}" alt=""><span><small>${tag}</small><strong id="scoreboard-${side}">${team}</strong></span></div>
        <div class="scoreboard-team__result"><span>${side === "home" ? "VITÓRIA" : "DERROTA"}</span><strong>${score}</strong></div>
      </header>
      <div class="scoreboard-table-scroll" tabindex="0" aria-label="Estatísticas de ${team}">
        <table class="scoreboard-table">
          <thead><tr><th>JOGADOR</th><th>RATING</th><th>ACS</th><th>K</th><th>D</th><th>A</th><th>+/−</th><th>KAST</th><th>HS%</th><th>FK</th><th>FD</th></tr></thead>
          <tbody>${scoreboardRows(players)}</tbody>
        </table>
      </div>
    </section>`;
  }

  function matchesScreen() {
    return `<section class="dashboard-screen matches-screen" data-screen="partidas">
      ${dashboardHeader("matches")}
      <div class="dashboard-workspace dashboard-workspace--module">
        ${matchSidebar()}
        <main class="dashboard-main dashboard-main--module">
        <div class="matches-page">
        <section class="matches-toolbar" aria-label="Pesquisa de partidas">
          <label class="matches-search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Buscar adversário ou evento" aria-label="Buscar adversário ou evento"></label>
        </section>
        <div class="matches-layout">
          <aside class="match-catalog" aria-label="Lista de partidas" data-match-catalog>
            <div class="match-catalog__heading"><div><span>PARTIDAS</span><strong>18 registros</strong></div><button type="button" aria-label="Ordenar partidas" data-demo-link>↕</button></div>
            <div class="match-catalog__list">${matchCatalog.map(matchCatalogCard).join("")}</div>
            <button class="match-catalog__more" type="button" data-demo-link>CARREGAR MAIS</button>
          </aside>
          <article class="match-detail" id="selected-match-detail" data-match-detail tabindex="-1" hidden>
            <div class="match-detail__navigation"><button class="module-secondary" type="button" data-close-match-detail>← VOLTAR À LISTAGEM</button></div>
            <header class="match-detail__hero">
              <img class="match-detail__backdrop" src="${assets.haven}" alt="">
              <div class="match-detail__meta"><span class="match-status-badge">FINALIZADA</span><span>VPL 2026 · FASE DE GRUPOS</span><span>28 MAR 2026 · 12:20</span></div>
              <div class="match-versus">
                <div class="match-versus__team"><img src="${assets.rushone}" alt="RUSH ONE"><strong>RUSH ONE</strong><span>RSH</span></div>
                <div class="match-versus__score"><span>MD3 · FINAL</span><strong><em>2</em><i>:</i><em>0</em></strong><small>VITÓRIA</small></div>
                <div class="match-versus__team"><img src="${assets.greenOwls}" alt="GREEN OWLS"><strong>GREEN OWLS</strong><span>UNB</span></div>
              </div>
              <div class="match-map-summary"><span><small>MAPA 1</small><strong>HAVEN</strong><em>13 — 8</em></span><span><small>MAPA 2</small><strong>ASCENT</strong><em>13 — 10</em></span><span class="is-disabled"><small>MAPA 3</small><strong>LOTUS</strong><em>—</em></span></div>
            </header>
            <nav class="match-detail__tabs" aria-label="Detalhes da partida"><button class="is-active" type="button">SCOREBOARD</button><button type="button" data-route="gravacoes">GRAVAÇÕES <span>5</span></button></nav>
            <div class="scoreboards">
              <div class="scoreboard-legend"><span>PLACAR FINAL E ESTATÍSTICAS INDIVIDUAIS</span><span><abbr title="Average Combat Score">ACS</abbr> · <abbr title="Kill, Assist, Survived, Traded">KAST</abbr> · <abbr title="First Kill">FK</abbr> · <abbr title="First Death">FD</abbr></span></div>
              ${scoreboardTable("RUSH ONE", "RSH", assets.rushone, "43", "home", homeScoreboard)}
              ${scoreboardTable("GREEN OWLS", "UNB", assets.greenOwls, "35", "away", opponentScoreboard)}
            </div>
          </article>
        </div>
        <section class="matches-kpis" aria-label="Resumo das partidas">
          <article><span>TOTAL DE PARTIDAS</span><strong>18</strong><small>Temporada 2026</small></article>
          <article><span>VITÓRIAS</span><strong>12</strong><small class="is-positive">+3 nos últimos 30 dias</small></article>
          <article><span>APROVEITAMENTO</span><strong>66.7%</strong><small>12W · 6L</small></article>
          <article><span>SALDO DE ROUNDS</span><strong>+34</strong><small>238 ganhos · 204 perdidos</small></article>
        </section>
        </div>
        </main>
        ${reviewPanel()}
      </div>
      <div class="app-toast" role="status" aria-live="polite" data-toast></div>
    </section>`;
  }

  const rosterPlayers = [
    { name: "Psyder", fullName: "Pedro 'Psyder' Almeida", role: "CONTROLADOR", portrait: assets.agents.omen.portrait, icon: assets.agents.omen.icon, agent: "Omen", rating: "1.18", selected: true },
    { name: "caKo", fullName: "Carlos 'caKo' Silva", role: "DUELISTA", portrait: assets.agents.jett.portrait, icon: assets.agents.jett.icon, agent: "Jett", rating: "1.31" },
    { name: "Jhons", fullName: "João 'Jhons' Souza", role: "INICIADOR", portrait: assets.agents.sova.portrait, icon: assets.agents.sova.icon, agent: "Sova", rating: "1.04" },
    { name: "iSay", fullName: "Isaias 'iSay' Santos", role: "SENTINELA", portrait: assets.agents.killjoy.portrait, icon: assets.agents.killjoy.icon, agent: "Killjoy", rating: "1.12" },
    { name: "Ethan", fullName: "Ethan Oliveira", role: "CONTROLADOR", portrait: assets.agents.viper.portrait, icon: assets.agents.viper.icon, agent: "Viper", rating: "0.98" }
  ];

  const playerMatchHistory = [
    { date: "28 MAR", opponent: "GREEN OWLS", logo: assets.greenOwls, result: "WIN", score: "2 — 0", agent: assets.agents.omen.icon, rating: "1.18", acs: 224, kd: "18 / 14", diff: "+4" },
    { date: "21 MAR", opponent: "AZURE BEARS", logo: assets.azure, result: "LOSS", score: "0 — 2", agent: assets.agents.omen.icon, rating: "0.94", acs: 187, kd: "14 / 17", diff: "−3" },
    { date: "14 MAR", opponent: "CAAP HELLHOUNDS", logo: assets.caap, result: "WIN", score: "2 — 1", agent: assets.agents.viper.icon, rating: "1.24", acs: 236, kd: "21 / 15", diff: "+6" },
    { date: "07 MAR", opponent: "A2E UFF", logo: assets.a2e, result: "WIN", score: "2 — 0", agent: assets.agents.omen.icon, rating: "1.15", acs: 218, kd: "17 / 13", diff: "+4" },
    { date: "28 FEV", opponent: "UFU SAINTS", logo: assets.ufu, result: "WIN", score: "2 — 0", agent: assets.agents.viper.icon, rating: "1.09", acs: 203, kd: "16 / 14", diff: "+2" }
  ];

  function rosterItem(player, index) {
    return `<button class="roster-item${player.selected ? " is-selected" : ""}" type="button" aria-label="${player.fullName}, ${player.role}">
      <span class="roster-item__number">0${index + 1}</span>
      <span class="roster-item__avatar"><img src="${player.portrait}" alt=""></span>
      <span class="roster-item__copy"><strong>${player.name}</strong><small>${player.role}</small></span>
      <span class="roster-item__rating"><small>RATING</small><strong>${player.rating}</strong></span>
      <span class="roster-item__status" aria-label="Ativo"></span>
    </button>`;
  }

  function playerHistoryRows() {
    return playerMatchHistory.map((match) => `<tr>
      <td><span class="history-date">${match.date}<small>2026</small></span></td>
      <td><span class="history-opponent"><img src="${match.logo}" alt=""><strong>${match.opponent}</strong></span></td>
      <td><span class="history-result ${match.result === "WIN" ? "is-win" : "is-loss"}">${match.result}<small>${match.score}</small></span></td>
      <td><img class="history-agent" src="${match.agent}" alt="Agente utilizado"></td>
      <td class="is-emphasis">${match.rating}</td><td>${match.acs}</td><td>${match.kd}</td><td class="${match.diff.startsWith("+") ? "is-positive" : "is-negative"}">${match.diff}</td>
    </tr>`).join("");
  }

  function dashboardHeader(active = "team", profile = active === "users" ? "admin" : "trainer") {
    return `<header class="dashboard-header">
      <a class="dashboard-logo-slot" href="${profile === "admin" ? "#usuarios" : "#dashboard"}" aria-label="${profile === "admin" ? "Ir para a administração" : "Ir para o dashboard"}"><img src="${assets.brandLogo}" alt="VOD Review"></a>
      <div class="dashboard-header__spacer"></div>
      ${globalNavigation(active, profile)}
      <div class="dashboard-header__spacer dashboard-header__profile"><span>${profile === "admin" ? "ADMINISTRADOR" : "TREINADOR"}</span><button type="button" data-logout data-profile="${profile}">SAIR</button></div>
    </header>`;
  }

  function dashboardTeamHeader(activeSection) {
    return `<div class="dashboard-team-header">
      ${teamSummary({ compact: true })}
      <div class="content-tabs players-section-bar">
        ${teamSectionNavigation(activeSection)}
      </div>
    </div>`;
  }

  function matchSidebar() {
    return `<aside class="match-sidebar" aria-label="Histórico de partidas">
      <section class="latest-match">
        <div class="latest-match__title"><span>ÚLTIMA PARTIDA</span><strong>WIN</strong></div>
        <div class="latest-match__hero">
          <img class="latest-match__map" src="${assets.haven}" alt="Mapa Haven">
          <div class="latest-match__versus">
            <img class="team-logo" src="${assets.rushone}" alt="RUSH ONE"><span>RSH</span><span class="score-chip">2-0</span><span>UNB</span><img class="team-logo" src="${assets.greenOwls}" alt="Green Owls">
          </div>
        </div>
        <button class="latest-match__details" type="button" data-route="partidas">VER DETALHES</button>
      </section>
      <section class="panel-box upcoming-card">
        <h2 class="section-strip">A SEGUIR</h2>
        <article class="match-row">
          <div class="match-row__meta"><span><strong>Mar 30</strong> · 12:20 PM</span><span>13:00</span></div>
          <div class="match-row__team"><span class="match-row__identity"><span class="match-logo"><img src="${assets.rushone}" alt=""></span><span>UNIRV RUSH ONE</span></span></div>
          <div class="match-row__team"><span class="match-row__identity"><span class="match-logo" style="--logo-size:22px"><img src="${assets.ceub}" alt=""></span><span>CEUB Octopus</span></span></div>
        </article>
      </section>
      <section class="panel-box recent-card">
        <h2 class="section-strip">RECENTE</h2>
        ${recentMatches.slice(0, 4).map(matchRow).join("")}
      </section>
    </aside>`;
  }

  function reviewPanel() {
    return `<aside class="agent-panel" aria-label="Painel de revisão">
      <button class="new-match-button" type="button" data-route="partidas">+ NOVA PARTIDA</button>
      <section class="review-card">
        <h2 class="review-card__title">REVISÃO EM ANDAMENTO</h2>
        <div class="review-match">
          <img src="${assets.reviewMap}" alt="Mapa da partida">
          <div class="review-match__copy"><p class="review-match__teams">UNIRV RUSH ONE<br>vs<br>UTFPR AZURE BEARS</p><p class="review-match__time">Sex 28 · 12:00H</p></div>
        </div>
        <div class="review-progress__label"><span>Progresso da revisão</span><span>4/5 POV’s</span></div>
        <div class="review-progress__segments" aria-label="Quatro de cinco pontos de vista concluídos"><span class="is-done"></span><span class="is-done"></span><span class="is-done"></span><span class="is-done"></span><span></span></div>
        <button class="continue-review" type="button" data-route="revisao">CONTINUAR REVISÃO</button>
      </section>
      <h2 class="notes-heading">Anotações Recentes</h2>
      ${recentNotes.map(noteCard).join("")}
    </aside>`;
  }

  function matchPlayerCard(player, side) {
    const agentKey = player.agent.toLocaleLowerCase("pt-BR");
    const portrait = assets.agents[agentKey]?.portrait || player.icon;
    return `<article class="match-player-card match-player-card--${side}">
      <span class="match-player-card__portrait"><img src="${portrait}" alt="Agente de ${player.player}"><i aria-hidden="true"></i></span>
      <div><strong>${player.player}</strong></div>
    </article>`;
  }

  function matchPlayersPanel() {
    return `<aside class="agent-panel match-players-panel" aria-label="Jogadores da partida selecionada">
      <header class="match-players-panel__heading"><span>PLAYERS DA PARTIDA</span><strong>10 JOGADORES</strong></header>
      <section class="match-team-roster match-team-roster--home" aria-labelledby="roster-home-title">
        <header><img src="${assets.rushone}" alt=""><span><strong id="roster-home-title">RUSH ONE</strong><small>RSH · EQUIPE DO TREINADOR</small></span></header>
        <div>${homeScoreboard.map((player) => matchPlayerCard(player, "home")).join("")}</div>
      </section>
      <section class="match-team-roster match-team-roster--away" aria-labelledby="roster-away-title">
        <header><img src="${assets.greenOwls}" alt=""><span><strong id="roster-away-title">GREEN OWLS</strong><small>UNB · ADVERSÁRIO</small></span></header>
        <div>${opponentScoreboard.map((player) => matchPlayerCard(player, "away")).join("")}</div>
      </section>
    </aside>`;
  }

  function dashboardShell({ screen, activeSection, mainClass = "", content }) {
    return `<section class="dashboard-screen${screen === "jogadores" ? " players-screen" : ""}" data-screen="${screen}">
      ${dashboardHeader()}
      <div class="dashboard-workspace">
        ${matchSidebar()}
        <main class="dashboard-main${mainClass ? ` ${mainClass}` : ""}">
          ${dashboardTeamHeader(activeSection)}
          ${content}
        </main>
        ${reviewPanel()}
      </div>
    </section>`;
  }

  function playersScreen() {
    return dashboardShell({
      screen: "jogadores",
      activeSection: "players",
      mainClass: "dashboard-main--players",
      content: `<div class="players-layout">
          <aside class="roster-panel" aria-label="Elenco da equipe">
            <header class="roster-panel__heading"><div><span>ELENCO ATIVO</span><strong>5 JOGADORES</strong></div><button type="button" aria-label="Adicionar jogador" data-demo-link>＋</button></header>
            <div class="roster-list">${rosterPlayers.map(rosterItem).join("")}</div>
            <div class="roster-panel__footer"><span><i></i> ATIVO</span><span>ATUALIZADO HOJE</span></div>
          </aside>
          <div class="individual-column">
            <section class="individual-hero">
              <div class="individual-hero__backdrop" aria-hidden="true"></div>
              <img class="individual-hero__portrait" src="${assets.agents.omen.portrait}" alt="Omen, agente principal de Psyder">
              <div class="individual-hero__identity">
                <div class="individual-hero__status"><span></span> JOGADOR ATIVO</div>
                <p>CONTROLADOR · RSH</p>
                <h1>PSYDER</h1>
                <span class="individual-hero__name">Pedro Almeida · Brasil</span>
                <div class="individual-hero__tags"><span>MAIN OMEN</span><span>FLEX VIPER</span></div>
              </div>
              <button class="individual-hero__edit" type="button" data-demo-link>EDITAR PERFIL</button>
            </section>
            <section class="individual-kpis" aria-label="Indicadores individuais">
              <article><span>RATING</span><strong>1.18</strong><small class="is-positive">▲ 0.06</small></article>
              <article><span>ACS MÉDIO</span><strong>224</strong><small>TOP 24%</small></article>
              <article><span>K / D</span><strong>1.28</strong><small>86 / 67</small></article>
              <article><span>KAST</span><strong>74%</strong><small class="is-positive">+3.2%</small></article>
            </section>
            <section class="individual-performance-card">
              <header class="component-heading"><div><span>EVOLUÇÃO DE PERFORMANCE</span><small>RATING · ÚLTIMAS 8 PARTIDAS</small></div><div class="performance-average"><small>MÉDIA</small><strong>1.18</strong></div></header>
              <div class="individual-trend" role="img" aria-label="Evolução do rating nas últimas oito partidas">
                <div class="individual-trend__scale"><span>1.40</span><span>1.20</span><span>1.00</span><span>0.80</span></div>
                <div class="individual-trend__grid"><span></span><span></span><span></span><span></span></div>
                <div class="individual-trend__bars">
                  ${[104, 92, 112, 121, 98, 116, 108, 128].map((value, index) => `<span style="--trend-height:${Math.max(28, (value - 70) * 2)}px"><i>${(value / 100).toFixed(2)}</i><small>${["02/07", "02/14", "02/21", "02/28", "03/07", "03/14", "03/21", "03/28"][index]}</small></span>`).join("")}
                </div>
                <div class="individual-trend__average"><span>AVG 1.18</span></div>
              </div>
            </section>
            <section class="player-history-card">
              <header class="component-heading"><div><span>HISTÓRICO INDIVIDUAL</span><small>DESEMPENHO POR PARTIDA</small></div><button type="button" data-demo-link>VER TODAS</button></header>
              <div class="player-history-scroll" tabindex="0">
                <table class="player-history-table"><thead><tr><th>DATA</th><th>ADVERSÁRIO</th><th>RESULTADO</th><th>AGENTE</th><th>RATING</th><th>ACS</th><th>K / D</th><th>+/−</th></tr></thead><tbody>${playerHistoryRows()}</tbody></table>
              </div>
            </section>
          </div>
          <aside class="player-insights" aria-label="Contexto de desempenho">
            <section class="last-performance-card">
              <header class="insight-heading"><div><span>ÚLTIMA PARTIDA</span><small>28 MAR · VPL 2026</small></div><a href="#partidas">VER PARTIDA</a></header>
              <div class="last-performance-card__match">
                <img src="${assets.haven}" alt="Mapa Haven">
                <div class="last-performance-card__versus"><span><img src="${assets.rushone}" alt=""><small>RSH</small></span><strong><em>2</em> — 0<small>WIN</small></strong><span><img src="${assets.greenOwls}" alt=""><small>UNB</small></span></div>
                <p>HAVEN · MD3 · FINALIZADA</p>
              </div>
              <div class="last-performance-card__stats"><span><small>RATING</small><strong>1.18</strong></span><span><small>ACS</small><strong>224</strong></span><span><small>K / D / A</small><strong>18 / 14 / 11</strong></span></div>
              <div class="performance-callout"><span>DESTAQUE</span><p>Melhor desempenho em assistências da equipe nesta partida.</p></div>
            </section>
            <section class="agent-pool-card">
              <header class="insight-heading"><div><span>POOL DE AGENTES</span><small>TEMPORADA 2026</small></div></header>
              <div class="agent-usage"><img src="${assets.agents.omen.icon}" alt="Omen"><div><span><strong>OMEN</strong><small>12 PARTIDAS</small></span><i><b style="width:72%"></b></i></div><em>72%</em></div>
              <div class="agent-usage"><img src="${assets.agents.viper.icon}" alt="Viper"><div><span><strong>VIPER</strong><small>5 PARTIDAS</small></span><i><b style="width:23%"></b></i></div><em>23%</em></div>
              <div class="agent-usage"><img src="${assets.agents.killjoy.icon}" alt="Killjoy"><div><span><strong>KILLJOY</strong><small>1 PARTIDA</small></span><i><b style="width:5%"></b></i></div><em>5%</em></div>
            </section>
            <section class="season-summary-card">
              <header class="insight-heading"><div><span>RESUMO DA TEMPORADA</span><small>18 PARTIDAS JOGADAS</small></div></header>
              <dl><div><dt>Rounds jogados</dt><dd>428</dd></div><div><dt>Abates</dt><dd>312</dd></div><div><dt>Assistências</dt><dd>184</dd></div><div><dt>First Kills</dt><dd>42</dd></div></dl>
            </section>
          </aside>
        </div>`
    });
  }

  function dashboardScreen() {
    return dashboardShell({
      screen: "dashboard",
      activeSection: "overview",
      content: `<section class="player-grid" aria-label="Jogadores">${players.map(playerCard).join("")}</section>
        <section class="performance">
          <h2 class="performance__title">DESEMPENHO DA PARTIDA</h2>
          <div class="chart" role="img" aria-label="Gráfico de desempenho das sete partidas mais recentes">
            <img class="chart__grid chart__grid--1" src="${assets.chartGrid}" alt="">
            <img class="chart__grid chart__grid--2" src="${assets.chartGrid}" alt="">
            <img class="chart__grid chart__grid--3" src="${assets.chartGrid}" alt="">
            <img class="chart__grid chart__grid--4" src="${assets.chartGrid}" alt="">
            <img class="chart__average-line" src="${assets.chartAverage}" alt="">
            <span class="chart__average-label">AVG 68.3</span>
            <div class="chart__groups">${chartData.map(chartGroup).join("")}</div>
          </div>
        </section>`
    });
  }

  const systemUsers = [
    { name: "Lucas Ferreira", email: "lucas@rushone.gg", team: "RUSH ONE ESPORTS", status: "ATIVO", access: "ONTEM · 21:18" },
    { name: "Rafael Nunes", email: "rafael@azure.gg", team: "AZURE BEARS", status: "ATIVO", access: "23 SET · 18:05" },
    { name: "Bianca Alves", email: "bianca@caap.gg", team: "CAAP HELLHOUNDS", status: "INATIVO", access: "14 AGO · 11:30" }
  ];

  const managedTeams = [
    { name: "RUSH ONE ESPORTS", tag: "RSH", region: "BRASIL", coach: "Lucas Ferreira", status: "ATIVA", logo: assets.rushone },
    { name: "AZURE BEARS", tag: "AZR", region: "BRASIL", coach: "Rafael Nunes", status: "ATIVA", logo: assets.azure },
    { name: "CAAP HELLHOUNDS", tag: "CAAP", region: "BRASIL", coach: "Bianca Alves", status: "ATIVA", logo: assets.caap }
  ];

  const reviewSessions = [
    { status: "EM ANDAMENTO", tone: "progress", opponent: "AZURE BEARS", date: "28 MAR 2026", map: "HAVEN", progress: "4/5 POVs", action: "CONTINUAR", route: "revisao", logo: assets.azure },
    { status: "FINALIZADA", tone: "done", opponent: "GREEN OWLS", date: "21 MAR 2026", map: "ASCENT", progress: "5/5 POVs", action: "VER SÍNTESE", route: "sintese", logo: assets.greenOwls },
    { status: "AGUARDANDO POVs", tone: "pending", opponent: "CAAP HELLHOUNDS", date: "14 MAR 2026", map: "LOTUS", progress: "3/5 POVs", action: "GERENCIAR", route: "gravacoes", logo: assets.caap }
  ];

  function moduleShell({ screen, activeNav, eyebrow, title, description, actions = "", showHeading = true, sidePanel = null, content }) {
    return `<section class="dashboard-screen module-screen" data-screen="${screen}">
      ${dashboardHeader(activeNav)}
      <div class="dashboard-workspace dashboard-workspace--module">
        ${matchSidebar()}
        <main class="dashboard-main dashboard-main--module">
        <div class="module-page">
        ${showHeading ? `<header class="module-heading">
          <div><p class="page-eyebrow">${eyebrow}</p><h1>${title}</h1><p>${description}</p></div>
          ${actions ? `<div class="module-heading__actions">${actions}</div>` : ""}
        </header>` : ""}
        ${content}
        </div>
      </main>
        ${sidePanel === null ? reviewPanel() : sidePanel}
      </div>
      <div class="app-toast" role="status" aria-live="polite" data-toast></div>
    </section>`;
  }

  function adminShell({ title, description, actions = "", content }) {
    return `<section class="dashboard-screen module-screen admin-screen" data-screen="usuarios">
      ${dashboardHeader("users", "admin")}
      <main class="admin-page">
        <header class="module-heading">
          <div><p class="page-eyebrow">ADMINISTRAÇÃO · ACESSOS E EQUIPES</p><h1>${title}</h1><p>${description}</p></div>
          <div class="module-heading__actions">${actions}</div>
        </header>
        <p class="admin-scope-notice"><strong>ESCOPO DO ADMINISTRADOR</strong><span>Cadastro de equipes e contas de treinadores. Painéis, partidas, estatísticas e revisões permanecem restritos aos treinadores responsáveis.</span></p>
        ${content}
      </main>
      <div class="app-toast" role="status" aria-live="polite" data-toast></div>
    </section>`;
  }

  function userRow(user, index) {
    return `<tr data-user-row data-user-index="${index}">
      <td><span class="user-identity"><span>${user.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><span><strong>${user.name}</strong><small>${user.email}</small></span></span></td>
      <td><span class="user-team"><strong>${user.team}</strong><small>TREINADOR RESPONSÁVEL</small></span></td>
      <td><span class="status-badge status-badge--${user.status === "ATIVO" ? "success" : "muted"}" data-user-status>${user.status}</span></td>
      <td>${user.access}</td>
      <td class="module-table__actions"><button type="button" data-edit-user="${index}">EDITAR</button><button type="button" data-toggle-user>${user.status === "ATIVO" ? "DESATIVAR" : "ATIVAR"}</button></td>
    </tr>`;
  }

  function userRows() {
    return systemUsers.map(userRow).join("");
  }

  function teamRow(team, index) {
    const isActive = team.status === "ATIVA";
    return `<tr data-team-row data-team-index="${index}"><td><span class="managed-team"><img src="${team.logo}" alt=""><span><strong>${team.name}</strong><small>${team.tag}</small></span></span></td><td>${team.region}</td><td><span class="user-team"><strong>${team.coach}</strong><small>${isActive ? "CONTA DE TREINADOR" : "CRIE E VINCULE UMA CONTA"}</small></span></td><td><span class="status-badge status-badge--${isActive ? "success" : "pending"}">${team.status}</span></td><td class="module-table__actions"><button type="button" data-edit-team="${index}">EDITAR</button></td></tr>`;
  }

  function teamRows() {
    return managedTeams.map(teamRow).join("");
  }

  function usersScreen() {
    return adminShell({
      title: "GESTÃO ADMINISTRATIVA",
      description: "Cadastre equipes e gerencie somente as contas dos treinadores vinculados a elas.",
      actions: '<button class="module-secondary" type="button" data-open-team-dialog>＋ NOVA EQUIPE</button><button class="module-primary" type="button" data-open-user-dialog>＋ NOVO TREINADOR</button>',
      content: `<section class="module-stats" aria-label="Resumo administrativo"><article><span>EQUIPES CADASTRADAS</span><strong data-team-total>3</strong><small>Ativas e cadastros pendentes</small></article><article><span>TREINADORES</span><strong data-user-total>3</strong><small>Contas vinculadas a equipes</small></article><article><span>ACESSOS ATIVOS</span><strong data-user-active>2</strong><small data-user-active-detail>67% dos treinadores</small></article></section>
        <section class="module-card admin-management-card">
          <div class="module-toolbar"><div><span class="module-label">EQUIPES CADASTRADAS</span><small>Informações cadastrais e treinador responsável</small></div></div>
          <div class="module-table-scroll"><table class="module-table"><thead><tr><th>EQUIPE</th><th>REGIÃO</th><th>TREINADOR</th><th>STATUS</th><th>AÇÕES</th></tr></thead><tbody data-teams-body>${teamRows()}</tbody></table></div>
        </section>
        <section class="module-card admin-management-card">
          <div class="module-toolbar"><div><span class="module-label">CONTAS DE TREINADORES</span><small>O administrador não possui acesso aos dados competitivos destas equipes</small></div><label class="module-search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Buscar treinador ou equipe" aria-label="Buscar treinador"></label></div>
          <div class="module-table-scroll"><table class="module-table"><thead><tr><th>TREINADOR</th><th>EQUIPE VINCULADA</th><th>STATUS</th><th>ÚLTIMO ACESSO</th><th>AÇÕES</th></tr></thead><tbody data-users-body>${userRows()}</tbody></table></div>
        </section>
        <dialog class="module-dialog" data-team-dialog><form method="dialog" data-team-form><header><div><span class="module-label">CADASTRO ADMINISTRATIVO</span><h2 data-team-dialog-title>NOVA EQUIPE</h2></div><button type="button" data-close-team-dialog aria-label="Fechar">×</button></header><div class="dialog-fields"><label><span>NOME DA EQUIPE</span><input name="name" required placeholder="Nome da equipe"></label><label><span>TAG / SIGLA</span><input name="tag" required maxlength="4" placeholder="TAG"></label><label><span>REGIÃO / PAÍS</span><select name="region"><option>BRASIL</option><option>AMÉRICA DO SUL</option><option>AMÉRICA DO NORTE</option><option>EUROPA</option></select></label><p class="module-notice"><strong>Próxima etapa:</strong> após salvar a equipe, crie a conta do treinador e selecione esta equipe para concluir o vínculo.</p></div><footer><button class="module-secondary" type="button" data-close-team-dialog>CANCELAR</button><button class="module-primary" type="submit">SALVAR EQUIPE</button></footer></form></dialog>
        <dialog class="module-dialog" data-user-dialog><form method="dialog" data-user-form><header><div><span class="module-label">CONTA DE TREINADOR</span><h2 data-user-dialog-title>NOVO TREINADOR</h2></div><button type="button" data-close-user-dialog aria-label="Fechar">×</button></header><div class="dialog-fields"><label><span>NOME COMPLETO</span><input name="name" required placeholder="Nome do treinador"></label><label><span>E-MAIL</span><input name="email" type="email" required placeholder="treinador@equipe.gg"></label><label><span>EQUIPE VINCULADA</span><select name="team">${managedTeams.map((team) => `<option>${team.name}</option>`).join("")}</select></label></div><footer><button class="module-secondary" type="button" data-close-user-dialog>CANCELAR</button><button class="module-primary" type="submit">SALVAR TREINADOR</button></footer></form></dialog>`
    });
  }

  function reviewsScreen() {
    return moduleShell({
      screen: "revisoes",
      activeNav: "reviews",
      showHeading: false,
      content: `<section class="module-stats" aria-label="Resumo das revisões"><article><span>EM ANDAMENTO</span><strong>1</strong><small>4 de 5 POVs revisados</small></article><article><span>FINALIZADAS</span><strong>12</strong><small>Temporada 2026</small></article><article><span>AGUARDANDO ARQUIVOS</span><strong>1</strong><small>2 gravações pendentes</small></article></section>
        <section class="review-session-list" aria-label="Sessões de revisão">${reviewSessions.map((session) => `<article class="review-session-card"><div class="review-session-card__status"><span class="status-badge status-badge--${session.tone}">${session.status}</span><small>${session.date}</small></div><div class="review-session-card__match"><img src="${assets.rushone}" alt="RUSH ONE"><span><small>RUSH ONE</small><strong>VS</strong></span><img src="${session.logo}" alt="${session.opponent}"><span><strong>${session.opponent}</strong><small>${session.map} · MD3</small></span></div><div class="review-session-card__progress"><span>${session.progress}</span><i><b style="width:${session.progress.startsWith("5") ? "100" : session.progress.startsWith("4") ? "80" : "60"}%"></b></i></div><button class="module-secondary" type="button" data-route="${session.route}">${session.action}</button></article>`).join("")}</section>`
    });
  }

  function recordingsScreen() {
    return moduleShell({
      screen: "gravacoes",
      activeNav: "matches",
      eyebrow: "PARTIDA · RUSH ONE VS GREEN OWLS",
      title: "GRAVAÇÕES DA PARTIDA",
      description: "Vincule de uma a cinco gravações POV aos participantes antes de iniciar a sincronização.",
      actions: '<button class="module-secondary" type="button" data-route="partidas">VOLTAR À PARTIDA</button><button class="module-primary" type="button" data-route="sincronizacao">SINCRONIZAR POVs</button>',
      content: `<section class="match-context"><div><img src="${assets.rushone}" alt=""><span><small>28 MAR 2026 · VPL</small><strong>RUSH ONE 2 — 0 GREEN OWLS</strong><em>HAVEN · MAPA 1</em></span></div><span class="status-badge status-badge--success">4 ARQUIVOS PRONTOS</span></section>
        <section class="recording-grid" aria-label="Gravações dos jogadores">${rosterPlayers.map((player, index) => `<article class="recording-card${index === 4 ? " is-pending" : ""}" data-recording-card><header><img src="${player.icon}" alt="${player.agent}"><span><strong>${player.name}</strong><small>${player.role} · ${player.agent}</small></span><span class="status-badge status-badge--${index === 4 ? "pending" : "success"}" data-recording-status>${index === 4 ? "PENDENTE" : "PRONTO"}</span></header><div class="recording-card__file" data-recording-file><span aria-hidden="true">${index === 4 ? "＋" : "▶"}</span><div><strong>${index === 4 ? "Nenhum arquivo vinculado" : `${player.name.toLowerCase()}_haven_pov.mp4`}</strong><small>${index === 4 ? "MP4, WEBM ou MOV · até 5 GB" : `${(1.8 + index * .4).toFixed(1)} GB · 42:18`}</small></div></div><footer><label class="module-secondary recording-upload"><input type="file" accept="video/mp4,video/webm,video/quicktime" data-recording-input>SELECIONAR ARQUIVO</label><button type="button" data-remove-recording ${index === 4 ? "disabled" : ""}>REMOVER</button></footer></article>`).join("")}</section>
        <p class="module-notice"><strong>Validação local:</strong> os arquivos são simulados e não são enviados a um servidor. É possível iniciar a sincronização com pelo menos um POV.</p>`
    });
  }

  function synchronizationScreen() {
    return moduleShell({
      screen: "sincronizacao",
      activeNav: "reviews",
      eyebrow: "PREPARAÇÃO DA REVISÃO · HAVEN",
      title: "SINCRONIZAÇÃO DE POVs",
      description: "Ajuste o início de cada gravação em relação ao POV de referência para manter uma linha do tempo comum.",
      actions: '<button class="module-secondary" type="button" data-route="gravacoes">VOLTAR ÀS GRAVAÇÕES</button><button class="module-primary" type="button" data-validate-sync>VALIDAR E REVISAR</button>',
      content: `<section class="sync-overview"><div><span class="module-label">POV DE REFERÊNCIA</span><label><select data-reference-pov>${rosterPlayers.slice(0, 4).map((player, index) => `<option${index === 0 ? " selected" : ""}>${player.name} · ${player.agent}</option>`).join("")}</select></label></div><div><span class="module-label">DETECÇÃO DO PLACAR</span><strong data-ocr-summary>AGUARDANDO ANÁLISE</strong><small>OCR identifica o primeiro round visível em cada gravação.</small></div><button class="module-secondary" type="button" data-auto-sync>DETECTAR AUTOMATICAMENTE</button></section>
        <section class="sync-list" aria-label="Ajustes de sincronização"><header><span>PARTICIPANTE</span><span>MARCO DETECTADO</span><span>AJUSTE MANUAL</span><span>ESTADO</span></header>${rosterPlayers.slice(0, 4).map((player, index) => `<article class="sync-row" data-sync-row><div><img src="${player.icon}" alt="${player.agent}"><span><strong>${player.name}</strong><small>${player.agent}</small></span></div><div><strong data-sync-marker>${index === 0 ? "ROUND 01 · 00:08" : "NÃO ANALISADO"}</strong><small>placar ${index === 0 ? "0 — 0" : "—"}</small></div><label><input type="range" min="-30" max="30" value="${index === 0 ? 0 : index * 2}" data-sync-range><output data-offset-value>${index === 0 ? "0.0" : `+${index * 2}.0`}s</output></label><span class="status-badge status-badge--${index === 0 ? "success" : "pending"}" data-sync-status>${index === 0 ? "REFERÊNCIA" : "PENDENTE"}</span></article>`).join("")}</section>
        <p class="module-notice"><strong>Critério de validação:</strong> todos os POVs devem possuir um marco temporal e os ajustes precisam permanecer dentro da duração disponível.</p>`
    });
  }

  const reviewPovSlots = [
    ...rosterPlayers.slice(0, 4).map((player, index) => ({
      ...player,
      povImage: assets.povs[index] || null
    })),
    null
  ];

  function reviewPovViewer(activeIndex = 0) {
    const activePlayer = reviewPovSlots[activeIndex]?.povImage ? reviewPovSlots[activeIndex] : reviewPovSlots.find((player) => player?.povImage);
    if (!activePlayer) return "";
    const activePlayerIndex = reviewPovSlots.indexOf(activePlayer);
    const thumbnailIndexes = reviewPovSlots.map((_, index) => index).filter((index) => index !== activePlayerIndex);
    return `<article class="pov-main" data-active-pov-index="${activePlayerIndex}" aria-label="POV principal de ${activePlayer.name}">
        <img src="${activePlayer.povImage}" alt="POV simulado de ${activePlayer.name}">
        <span class="pov-main__shade" aria-hidden="true"></span>
        <span class="pov-main__status"><i></i> POV PRINCIPAL · SINCRONIZADO</span>
        <span class="pov-main__identity"><strong>${activePlayer.name}</strong><small>${activePlayer.role} · ${activePlayer.agent}</small></span>
        <span class="pov-time pov-main__time" data-pov-offset="0">${formatInitialPovTime(762)}</span>
      </article>
      <div class="pov-thumbnails" aria-label="Demais posições de POV">
        ${thumbnailIndexes.map((index) => {
          const player = reviewPovSlots[index];
          if (!player?.povImage) return `<button class="pov-thumbnail is-empty" type="button" disabled aria-label="POV ${index + 1} indisponível">
            <span class="pov-thumbnail__empty" aria-hidden="true">?</span><span><strong>POV INDISPONÍVEL</strong><small>ARQUIVO NÃO ENVIADO</small></span>
          </button>`;
          return `<button class="pov-thumbnail" type="button" data-select-pov="${index}" aria-label="Exibir POV de ${player.name} no frame principal">
            <img src="${player.povImage}" alt=""><span class="pov-thumbnail__shade" aria-hidden="true"></span>
            <span class="pov-thumbnail__identity"><strong>${player.name}</strong><small>${player.agent}</small></span>
            <span class="pov-time pov-thumbnail__time" data-pov-offset="0">${formatInitialPovTime(762)}</span>
          </button>`;
        }).join("")}
      </div>`;
  }

  function formatInitialPovTime(seconds) {
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }

  function reviewScreen() {
    return moduleShell({
      screen: "revisao",
      activeNav: "reviews",
      eyebrow: "SESSÃO EM ANDAMENTO · MAPA 1",
      title: "REVISÃO MULTI-POV",
      description: "Compare as perspectivas sincronizadas, registre observações e complete o scoreboard da partida.",
      actions: '<button class="module-secondary" type="button" data-route="sincronizacao">AJUSTAR SINCRONIA</button><button class="module-primary" type="button" data-finalize-review>FINALIZAR REVISÃO</button><button class="module-primary is-hidden" type="button" data-open-synthesis data-route="sintese">GERAR SÍNTESE</button>',
      sidePanel: matchPlayersPanel(),
      content: `<div class="review-workspace"><section class="pov-stage"><div class="pov-viewer" data-pov-viewer aria-label="Visualizador de cinco posições Multi-POV">${reviewPovViewer()}</div>
        <div class="review-player" data-review-player style="--timeline-progress:30.02%">
          <div class="review-timeline">
            <div class="review-timeline__track">
              <button class="review-timeline__event is-alert" style="left:18%" type="button" data-timeline-marker="457" aria-label="Ir para o round 7, aos 7 minutos e 37 segundos"><span>R07</span></button>
              <button class="review-timeline__event" style="left:31%" type="button" data-timeline-marker="787" aria-label="Ir para o round 12, aos 13 minutos e 7 segundos"><span>R12</span></button>
              <button class="review-timeline__event is-alert" style="left:49%" type="button" data-timeline-marker="1244" aria-label="Ir para o round 18, aos 20 minutos e 44 segundos"><span>R18</span></button>
              <button class="review-timeline__event" style="left:72%" type="button" data-timeline-marker="1827" aria-label="Ir para o round 21, aos 30 minutos e 27 segundos"><span>R21</span></button>
              <span class="review-timeline__playhead" aria-hidden="true"><output data-time-tooltip>12:42</output></span>
              <input type="range" min="0" max="2538" value="762" step="1" data-review-timeline aria-label="Linha do tempo comum dos POVs">
            </div>
          </div>
          <div class="playback-bar">
            <div class="playback-transport" aria-label="Controles de reprodução">
              <button class="playback-control is-primary" type="button" data-playback aria-label="Reproduzir" title="Reproduzir ou pausar"><span aria-hidden="true">▶</span></button>
              <button class="playback-control" type="button" data-review-step="-5" aria-label="Voltar 5 segundos" title="Voltar 5 segundos"><span aria-hidden="true">|◀</span></button>
              <button class="playback-control" type="button" data-review-step="5" aria-label="Avançar 5 segundos" title="Avançar 5 segundos"><span aria-hidden="true">▶|</span></button>
              <button class="playback-control" type="button" data-review-restart aria-label="Reiniciar reprodução" title="Reiniciar"><span aria-hidden="true">↻</span></button>
            </div>
            <div class="playback-time" aria-label="Tempo da reprodução"><strong data-current-time>12:42</strong><span>/</span><span data-total-time>42:18</span></div>
            <div class="playback-round"><span>ROUND</span><strong data-round-position>12 / 24</strong></div>
            <div class="playback-speeds" aria-label="Velocidade da reprodução">
              <button type="button" data-playback-speed="0.5">0.5x</button><button class="is-active" type="button" data-playback-speed="1" aria-pressed="true">1x</button><button type="button" data-playback-speed="2">2x</button><button type="button" data-playback-speed="4">4x</button>
            </div>
          </div>
        </div></section>
          <aside class="review-notes"><header><div><span class="module-label">ANOTAÇÕES DA SESSÃO</span><strong data-note-count>3 REGISTROS</strong></div><span class="status-badge status-badge--progress" data-review-current-time>12:42</span></header><form data-note-form><label><span>CATEGORIA</span><select name="tag"><option>TÁTICA</option><option>ECONOMIA</option><option>SETUP</option><option>INDIVIDUAL</option></select></label><label><span>OBSERVAÇÃO</span><textarea name="body" required placeholder="Registre o ponto observado neste instante..."></textarea></label><button class="module-primary" type="submit">＋ ADICIONAR EM <span data-note-time-label>12:42</span></button></form><div class="review-note-list" data-review-note-list>${recentNotes.map((note, index) => `<article data-review-note><div><span>${note.tag} · ${note.round}</span><strong>${note.time}</strong></div><p>${note.body}</p><footer><button type="button" data-edit-note>EDITAR</button><button type="button" data-delete-note>EXCLUIR</button></footer></article>`).join("")}</div></aside></div>
        <section class="review-completion"><div><span class="module-label">COMPLETUDE DA REVISÃO</span><strong data-review-state>4/5 POVs REVISADOS</strong></div><div class="review-checks"><span class="is-done">SINCRONIA VALIDADA</span><span class="is-done">SCOREBOARD 5/5</span><span data-final-check>REVISÃO PENDENTE</span></div></section>`
    });
  }

  function synthesisScreen() {
    return moduleShell({
      screen: "sintese",
      activeNav: "reviews",
      eyebrow: "REVISÃO FINALIZADA · RUSH ONE VS GREEN OWLS",
      title: "SÍNTESE DA REVISÃO",
      description: "Consolide os principais pontos registrados e mantenha o histórico de versões da análise.",
      actions: '<button class="module-secondary" type="button" data-route="revisao">VOLTAR À REVISÃO</button><button class="module-primary" type="button" data-generate-synthesis>GERAR NOVA VERSÃO</button>',
      content: `<section class="synthesis-summary"><article><span>PARTIDA</span><strong>RUSH ONE 2 — 0 GREEN OWLS</strong><small>HAVEN · 28 MAR 2026</small></article><article><span>BASE DA SÍNTESE</span><strong>3 ANOTAÇÕES</strong><small>4 POVs sincronizados</small></article><article><span>STATUS</span><strong>REVISÃO FINALIZADA</strong><small>Scoreboard completo</small></article></section>
        <div class="synthesis-layout"><section class="module-card synthesis-result"><header><div><span class="module-label">VERSÃO ATUAL</span><h2>SÍNTESE TÁTICA</h2></div><span class="status-badge status-badge--muted" data-synthesis-status>NÃO GERADA</span></header><div class="synthesis-placeholder" data-synthesis-placeholder><span>Σ</span><strong>NENHUMA SÍNTESE GERADA</strong><p>Use as anotações da revisão para criar uma versão consolidada e editável.</p></div><div class="synthesis-copy is-hidden" data-synthesis-copy><h3>VISÃO GERAL</h3><p>A equipe manteve boa organização defensiva, mas apresentou atraso nas rotações para o bomb A. O uso coordenado de utilitários foi decisivo nos retakes dos rounds finais.</p><h3>PONTOS DE ATENÇÃO</h3><ul><li>Antecipar a rotação após o primeiro contato no A.</li><li>Evitar compras fragmentadas em rounds de economia.</li><li>Preservar a Viper Pit para o segundo contato no pós-plant.</li></ul><h3>PRÓXIMA SESSÃO</h3><p>Treinar comunicação de retake e execução de crossfire em situações 3v3.</p></div></section><aside class="module-card synthesis-history"><header><span class="module-label">HISTÓRICO DE VERSÕES</span><small>Registro local da prototipação</small></header><div data-synthesis-history><p class="empty-history">A primeira versão aparecerá após a geração.</p></div></aside></div>`
    });
  }

  function bindCommonInteractions() {
    const showToast = (message) => {
      const toast = document.querySelector("[data-toast]");
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add("is-visible");
      window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
    };

    document.querySelectorAll("[data-route]").forEach((button) => {
      button.addEventListener("click", () => navigate(button.dataset.route));
    });

    document.querySelectorAll("[data-demo-link]").forEach((link) => {
      link.addEventListener("click", (event) => event.preventDefault());
    });

    const matchCatalogPanel = document.querySelector("[data-match-catalog]");
    const selectedMatchDetail = document.querySelector("[data-match-detail]");
    const openMatchDetail = document.querySelector("[data-open-match-detail]");
    const closeMatchDetail = document.querySelector("[data-close-match-detail]");
    if (matchCatalogPanel && selectedMatchDetail && openMatchDetail) {
      openMatchDetail.addEventListener("click", () => {
        matchCatalogPanel.hidden = true;
        selectedMatchDetail.hidden = false;
        selectedMatchDetail.focus({ preventScroll: true });
      });
    }
    if (matchCatalogPanel && selectedMatchDetail && closeMatchDetail) {
      closeMatchDetail.addEventListener("click", () => {
        selectedMatchDetail.hidden = true;
        matchCatalogPanel.hidden = false;
        openMatchDetail.focus({ preventScroll: true });
      });
    }

    document.querySelectorAll("[data-password-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const input = button.parentElement.querySelector("input");
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        button.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
      });
    });

    const loginForm = document.querySelector('[data-form="login"]');
    if (loginForm) loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const profile = getProfileFromUrl();
      window.sessionStorage.setItem("tactivod-profile", profile);
      navigate(profile === "admin" ? "usuarios" : "dashboard");
    });

    document.querySelectorAll("[data-logout]").forEach((button) => button.addEventListener("click", () => {
      const profile = button.dataset.profile === "admin" ? "admin" : "treinador";
      window.sessionStorage.removeItem("tactivod-profile");
      const loginUrl = new URL(window.location.href);
      loginUrl.search = `?perfil=${profile}`;
      loginUrl.hash = "login";
      window.location.assign(loginUrl.toString());
    }));

    const teamSetupForm = document.querySelector('[data-form="team"]');
    if (teamSetupForm) teamSetupForm.addEventListener("submit", (event) => { event.preventDefault(); navigate("dashboard"); });

    const logoInput = document.querySelector("#team-logo-input");
    if (logoInput) {
      logoInput.addEventListener("change", () => {
        const file = logoInput.files && logoInput.files[0];
        if (!file) return;
        const preview = document.querySelector("[data-logo-preview]");
        const image = preview.querySelector("img");
        image.src = URL.createObjectURL(file);
        image.alt = "Prévia da logo selecionada";
        preview.classList.add("has-image");
      });
    }

    const userDialog = document.querySelector("[data-user-dialog]");
    const userForm = document.querySelector("[data-user-form]");
    const usersBody = document.querySelector("[data-users-body]");
    const teamDialog = document.querySelector("[data-team-dialog]");
    const teamForm = document.querySelector("[data-team-form]");
    const teamsBody = document.querySelector("[data-teams-body]");
    const refreshUserStats = () => {
      const total = systemUsers.length;
      const active = systemUsers.filter((user) => user.status === "ATIVO").length;
      const totalOutput = document.querySelector("[data-user-total]");
      const activeOutput = document.querySelector("[data-user-active]");
      const detailOutput = document.querySelector("[data-user-active-detail]");
      if (totalOutput) totalOutput.textContent = String(total);
      if (activeOutput) activeOutput.textContent = String(active);
      if (detailOutput) detailOutput.textContent = `${Math.round((active / total) * 100)}% dos treinadores`;
    };
    const openUserEditor = (index) => {
      const user = systemUsers[index];
      if (!user || !userForm || !userDialog) return;
      userForm.dataset.userIndex = String(index);
      userForm.elements.name.value = user.name;
      userForm.elements.email.value = user.email;
      userForm.elements.team.value = user.team;
      document.querySelector("[data-user-dialog-title]").textContent = "EDITAR TREINADOR";
      userDialog.showModal();
    };
    const bindUserRowActions = (row) => {
      const index = Number(row.dataset.userIndex);
      row.querySelector("[data-edit-user]").addEventListener("click", () => openUserEditor(index));
      row.querySelector("[data-toggle-user]").addEventListener("click", (event) => {
        const status = row.querySelector("[data-user-status]");
        const activating = status.textContent === "INATIVO";
        systemUsers[index].status = activating ? "ATIVO" : "INATIVO";
        status.textContent = systemUsers[index].status;
        status.className = `status-badge status-badge--${activating ? "success" : "muted"}`;
        event.currentTarget.textContent = activating ? "DESATIVAR" : "ATIVAR";
        refreshUserStats();
        showToast(`Usuário ${activating ? "ativado" : "desativado"}.`);
      });
    };
    document.querySelectorAll("[data-open-user-dialog]").forEach((button) => button.addEventListener("click", () => {
      if (userForm) {
        userForm.reset();
        delete userForm.dataset.userIndex;
      }
      const title = document.querySelector("[data-user-dialog-title]");
      if (title) title.textContent = "NOVO TREINADOR";
      if (userDialog) userDialog.showModal();
    }));
    document.querySelectorAll("[data-close-user-dialog]").forEach((button) => button.addEventListener("click", () => userDialog && userDialog.close()));
    document.querySelectorAll("[data-user-row]").forEach(bindUserRowActions);
    const userSearch = document.querySelector('.module-search input[type="search"]');
    if (userSearch) userSearch.addEventListener("input", () => {
      const term = userSearch.value.trim().toLocaleLowerCase("pt-BR");
      usersBody.querySelectorAll("[data-user-row]").forEach((row) => {
        row.hidden = !row.textContent.toLocaleLowerCase("pt-BR").includes(term);
      });
    });
    if (userForm) userForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const index = userForm.dataset.userIndex === undefined ? -1 : Number(userForm.dataset.userIndex);
      const previousTeamName = index >= 0 ? systemUsers[index].team : "";
      const user = {
        name: userForm.elements.name.value.trim(),
        email: userForm.elements.email.value.trim(),
        team: userForm.elements.team.value,
        status: index >= 0 ? systemUsers[index].status : "ATIVO",
        access: index >= 0 ? systemUsers[index].access : "AINDA NÃO ACESSOU"
      };
      if (index >= 0) {
        systemUsers[index] = user;
        const currentRow = usersBody.querySelector(`[data-user-index="${index}"]`);
        currentRow.insertAdjacentHTML("afterend", userRow(user, index));
        const updatedRow = currentRow.nextElementSibling;
        currentRow.remove();
        bindUserRowActions(updatedRow);
      } else {
        const newIndex = systemUsers.push(user) - 1;
        usersBody.insertAdjacentHTML("beforeend", userRow(user, newIndex));
        bindUserRowActions(usersBody.lastElementChild);
      }
      userDialog.close();
      refreshUserStats();
      if (previousTeamName && previousTeamName !== user.team) {
        const previousTeam = managedTeams.find((team) => team.name === previousTeamName);
        if (previousTeam) {
          previousTeam.coach = "AGUARDANDO VÍNCULO";
          previousTeam.status = "PENDENTE";
        }
      }
      const linkedTeam = managedTeams.find((team) => team.name === user.team);
      if (linkedTeam) {
        linkedTeam.coach = user.name;
        linkedTeam.status = "ATIVA";
      }
      if (teamsBody) {
        teamsBody.innerHTML = teamRows();
        teamsBody.querySelectorAll("[data-team-row]").forEach(bindTeamRowActions);
      }
      showToast(index >= 0 ? "Treinador atualizado." : "Treinador cadastrado e vinculado.");
    });

    const openTeamEditor = (index) => {
      const team = managedTeams[index];
      if (!team || !teamForm || !teamDialog) return;
      teamForm.dataset.teamIndex = String(index);
      teamForm.elements.name.value = team.name;
      teamForm.elements.tag.value = team.tag;
      teamForm.elements.region.value = team.region;
      document.querySelector("[data-team-dialog-title]").textContent = "EDITAR EQUIPE";
      teamDialog.showModal();
    };
    function bindTeamRowActions(row) {
      const button = row.querySelector("[data-edit-team]");
      if (button) button.addEventListener("click", () => openTeamEditor(Number(row.dataset.teamIndex)));
    }
    document.querySelectorAll("[data-team-row]").forEach(bindTeamRowActions);
    document.querySelectorAll("[data-open-team-dialog]").forEach((button) => button.addEventListener("click", () => {
      if (!teamForm || !teamDialog) return;
      teamForm.reset();
      delete teamForm.dataset.teamIndex;
      document.querySelector("[data-team-dialog-title]").textContent = "NOVA EQUIPE";
      teamDialog.showModal();
    }));
    document.querySelectorAll("[data-close-team-dialog]").forEach((button) => button.addEventListener("click", () => teamDialog && teamDialog.close()));
    if (teamForm) teamForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const index = teamForm.dataset.teamIndex === undefined ? -1 : Number(teamForm.dataset.teamIndex);
      const previousName = index >= 0 ? managedTeams[index].name : "";
      const team = {
        name: teamForm.elements.name.value.trim().toUpperCase(),
        tag: teamForm.elements.tag.value.trim().toUpperCase(),
        region: teamForm.elements.region.value,
        coach: index >= 0 ? managedTeams[index].coach : "AGUARDANDO VÍNCULO",
        status: index >= 0 ? managedTeams[index].status : "PENDENTE",
        logo: index >= 0 ? managedTeams[index].logo : assets.rushone
      };
      if (index >= 0) managedTeams[index] = team;
      else managedTeams.push(team);
      systemUsers.forEach((user) => {
        if (user.team === previousName) user.team = team.name;
      });
      teamsBody.innerHTML = teamRows();
      teamsBody.querySelectorAll("[data-team-row]").forEach(bindTeamRowActions);
      usersBody.innerHTML = userRows();
      usersBody.querySelectorAll("[data-user-row]").forEach(bindUserRowActions);
      document.querySelector("[data-team-total]").textContent = String(managedTeams.length);
      const teamSelect = userForm && userForm.elements.team;
      if (teamSelect) teamSelect.innerHTML = managedTeams.map((item) => `<option>${item.name}</option>`).join("");
      teamDialog.close();
      showToast(index >= 0 ? "Equipe atualizada." : "Equipe cadastrada. Agora vincule o treinador.");
    });

    document.querySelectorAll("[data-recording-input]").forEach((input) => input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const card = input.closest("[data-recording-card]");
      card.classList.remove("is-pending");
      card.querySelector("[data-recording-status]").className = "status-badge status-badge--success";
      card.querySelector("[data-recording-status]").textContent = "PRONTO";
      card.querySelector("[data-recording-file] strong").textContent = file.name;
      card.querySelector("[data-recording-file] small").textContent = `${(file.size / 1073741824).toFixed(2)} GB · arquivo local`;
      card.querySelector("[data-recording-file] > span").textContent = "▶";
      card.querySelector("[data-remove-recording]").disabled = false;
      showToast("Gravação vinculada ao participante.");
    }));
    document.querySelectorAll("[data-remove-recording]").forEach((button) => button.addEventListener("click", () => {
      const card = button.closest("[data-recording-card]");
      card.classList.add("is-pending");
      card.querySelector("[data-recording-status]").className = "status-badge status-badge--pending";
      card.querySelector("[data-recording-status]").textContent = "PENDENTE";
      card.querySelector("[data-recording-file] strong").textContent = "Nenhum arquivo vinculado";
      card.querySelector("[data-recording-file] small").textContent = "MP4, WEBM ou MOV · até 5 GB";
      card.querySelector("[data-recording-file] > span").textContent = "＋";
      const input = card.querySelector("[data-recording-input]");
      if (input) input.value = "";
      button.disabled = true;
      showToast("Gravação removida da partida.");
    }));

    document.querySelectorAll("[data-sync-range]").forEach((range) => range.addEventListener("input", () => {
      const value = Number(range.value);
      range.closest("label").querySelector("[data-offset-value]").textContent = `${value > 0 ? "+" : ""}${value.toFixed(1)}s`;
    }));
    const autoSync = document.querySelector("[data-auto-sync]");
    if (autoSync) autoSync.addEventListener("click", () => {
      document.querySelectorAll("[data-sync-row]").forEach((row, index) => {
        row.querySelector("[data-sync-marker]").textContent = `ROUND 01 · 00:${String(8 + index * 2).padStart(2, "0")}`;
        const status = row.querySelector("[data-sync-status]");
        status.className = "status-badge status-badge--success";
        status.textContent = index === 0 ? "REFERÊNCIA" : "SINCRONIZADO";
      });
      document.querySelector("[data-ocr-summary]").textContent = "4/4 MARCOS IDENTIFICADOS";
      showToast("Detecção automática concluída.");
    });
    const validateSync = document.querySelector("[data-validate-sync]");
    if (validateSync) validateSync.addEventListener("click", () => {
      showToast("Sincronização validada. Abrindo a revisão...");
      window.setTimeout(() => navigate("revisao"), 450);
    });

    const playback = document.querySelector("[data-playback]");
    const reviewTimeline = document.querySelector("[data-review-timeline]");
    const reviewPlayer = document.querySelector("[data-review-player]");
    const formatReviewTime = (seconds) => {
      const value = Math.max(0, Math.round(Number(seconds)));
      return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
    };
    const updateReviewTimeline = (value) => {
      if (!reviewTimeline || !reviewPlayer) return;
      const seconds = Math.max(Number(reviewTimeline.min), Math.min(Number(reviewTimeline.max), Number(value)));
      reviewTimeline.value = String(seconds);
      const percentage = (seconds / Number(reviewTimeline.max)) * 100;
      reviewPlayer.style.setProperty("--timeline-progress", `${percentage}%`);
      const currentTime = document.querySelector("[data-current-time]");
      const tooltip = document.querySelector("[data-time-tooltip]");
      const reviewCurrentTime = document.querySelector("[data-review-current-time]");
      const noteTimeLabel = document.querySelector("[data-note-time-label]");
      const roundPosition = document.querySelector("[data-round-position]");
      const formatted = formatReviewTime(seconds);
      if (currentTime) currentTime.textContent = formatted;
      if (tooltip) tooltip.textContent = formatted;
      if (reviewCurrentTime) reviewCurrentTime.textContent = formatted;
      if (noteTimeLabel) noteTimeLabel.textContent = formatted;
      document.querySelectorAll("[data-pov-offset]").forEach((time) => {
        time.textContent = formatReviewTime(seconds + Number(time.dataset.povOffset));
      });
      if (roundPosition) {
        const roundAnchors = [
          { time: 0, round: 1 }, { time: 457, round: 7 }, { time: 787, round: 12 },
          { time: 1244, round: 18 }, { time: 1827, round: 21 }, { time: 2538, round: 24 }
        ];
        const nextAnchorIndex = roundAnchors.findIndex((anchor) => anchor.time >= seconds);
        const nextAnchor = roundAnchors[nextAnchorIndex < 0 ? roundAnchors.length - 1 : nextAnchorIndex];
        const previousAnchor = roundAnchors[Math.max(0, (nextAnchorIndex < 0 ? roundAnchors.length - 1 : nextAnchorIndex) - 1)];
        const segmentProgress = nextAnchor.time === previousAnchor.time ? 0 : (seconds - previousAnchor.time) / (nextAnchor.time - previousAnchor.time);
        const round = Math.max(1, Math.min(24, Math.round(previousAnchor.round + segmentProgress * (nextAnchor.round - previousAnchor.round))));
        roundPosition.textContent = `${String(round).padStart(2, "0")} / 24`;
      }
    };
    if (playback) playback.addEventListener("click", () => {
      const playing = playback.getAttribute("aria-label") === "Pausar";
      playback.querySelector("span").textContent = playing ? "▶" : "❚❚";
      playback.setAttribute("aria-label", playing ? "Reproduzir" : "Pausar");
      playback.setAttribute("aria-pressed", String(!playing));
      document.querySelector(".pov-stage").classList.toggle("is-playing", !playing);
    });
    if (reviewTimeline) reviewTimeline.addEventListener("input", () => updateReviewTimeline(reviewTimeline.value));
    document.querySelectorAll("[data-review-step]").forEach((button) => button.addEventListener("click", () => {
      updateReviewTimeline(Number(reviewTimeline.value) + Number(button.dataset.reviewStep));
    }));
    const restartReview = document.querySelector("[data-review-restart]");
    if (restartReview) restartReview.addEventListener("click", () => updateReviewTimeline(0));
    document.querySelectorAll("[data-timeline-marker]").forEach((button) => button.addEventListener("click", () => updateReviewTimeline(button.dataset.timelineMarker)));
    document.querySelectorAll("[data-playback-speed]").forEach((button) => button.addEventListener("click", () => {
      document.querySelectorAll("[data-playback-speed]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
    }));
    const povViewer = document.querySelector("[data-pov-viewer]");
    const bindPovSelectors = () => {
      if (!povViewer) return;
      povViewer.querySelectorAll("[data-select-pov]").forEach((button) => button.addEventListener("click", () => {
        povViewer.innerHTML = reviewPovViewer(Number(button.dataset.selectPov));
        bindPovSelectors();
        updateReviewTimeline(reviewTimeline ? reviewTimeline.value : 762);
      }));
    };
    bindPovSelectors();
    const noteList = document.querySelector("[data-review-note-list]");
    const updateNoteCount = () => {
      const count = noteList ? noteList.querySelectorAll("[data-review-note]").length : 0;
      const output = document.querySelector("[data-note-count]");
      if (output) output.textContent = `${count} ${count === 1 ? "REGISTRO" : "REGISTROS"}`;
    };
    const bindNoteActions = (scope = document) => {
      scope.querySelectorAll("[data-delete-note]").forEach((button) => button.addEventListener("click", () => {
        button.closest("[data-review-note]").remove();
        updateNoteCount();
        showToast("Anotação excluída.");
      }));
      scope.querySelectorAll("[data-edit-note]").forEach((button) => button.addEventListener("click", () => {
        const note = button.closest("[data-review-note]");
        const text = note.querySelector("p");
        const edited = window.prompt("Edite a anotação:", text.textContent);
        if (edited && edited.trim()) {
          text.textContent = edited.trim();
          showToast("Anotação atualizada.");
        }
      }));
    };
    bindNoteActions();
    const noteForm = document.querySelector("[data-note-form]");
    if (noteForm) noteForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const tag = noteForm.elements.tag.value;
      const body = noteForm.elements.body.value.trim();
      if (!body) return;
      const wrapper = document.createElement("div");
      const reviewTime = document.querySelector("[data-current-time]")?.textContent || "12:42";
      wrapper.innerHTML = `<article data-review-note><div><span>${tag} · ROUND ATUAL</span><strong>${reviewTime}</strong></div><p></p><footer><button type="button" data-edit-note>EDITAR</button><button type="button" data-delete-note>EXCLUIR</button></footer></article>`;
      const note = wrapper.firstElementChild;
      note.querySelector("p").textContent = body;
      noteList.prepend(note);
      bindNoteActions(note);
      noteForm.reset();
      updateNoteCount();
      showToast("Anotação adicionada à linha do tempo.");
    });
    const finalizeReview = document.querySelector("[data-finalize-review]");
    if (finalizeReview) finalizeReview.addEventListener("click", () => {
      finalizeReview.disabled = true;
      finalizeReview.textContent = "REVISÃO FINALIZADA";
      document.querySelector("[data-review-state]").textContent = "5/5 POVs REVISADOS";
      const finalCheck = document.querySelector("[data-final-check]");
      finalCheck.textContent = "REVISÃO FINALIZADA";
      finalCheck.classList.add("is-done");
      document.querySelector("[data-open-synthesis]").classList.remove("is-hidden");
      showToast("Revisão finalizada. A síntese está disponível.");
    });

    const generateSynthesis = document.querySelector("[data-generate-synthesis]");
    if (generateSynthesis) generateSynthesis.addEventListener("click", () => {
      document.querySelector("[data-synthesis-placeholder]").classList.add("is-hidden");
      document.querySelector("[data-synthesis-copy]").classList.remove("is-hidden");
      const status = document.querySelector("[data-synthesis-status]");
      status.className = "status-badge status-badge--success";
      status.textContent = "VERSÃO 1 GERADA";
      document.querySelector("[data-synthesis-history]").innerHTML = '<article class="history-version"><span>V1</span><div><strong>SÍNTESE TÁTICA</strong><small>Gerada agora · 3 anotações</small></div><span class="status-badge status-badge--success">ATUAL</span></article>';
      generateSynthesis.textContent = "GERAR NOVA VERSÃO";
      showToast("Síntese gerada a partir das anotações.");
    });
  }

  function render() {
    const route = getRoute();
    if (!window.location.hash) window.history.replaceState(null, "", "#login");
    const authenticatedProfile = window.sessionStorage.getItem("tactivod-profile");
    if (authenticatedProfile === "admin" && !["login", "usuarios", "equipe"].includes(route)) {
      navigate("usuarios");
      return;
    }
    if (authenticatedProfile === "trainer" && ["usuarios", "equipe"].includes(route)) {
      navigate("dashboard");
      return;
    }

    const screens = {
      login: loginScreen,
      equipe: usersScreen,
      dashboard: dashboardScreen,
      partidas: matchesScreen,
      jogadores: playersScreen,
      usuarios: usersScreen,
      revisoes: reviewsScreen,
      gravacoes: recordingsScreen,
      sincronizacao: synchronizationScreen,
      revisao: reviewScreen,
      sintese: synthesisScreen
    };

    app.innerHTML = screens[route]();
    const titles = { equipe: "VOD Review — Administração", dashboard: "RUSH ONE — Dashboard", partidas: "RUSH ONE — Partidas", jogadores: "RUSH ONE — Jogadores", usuarios: "VOD Review — Administração", revisoes: "RUSH ONE — Revisões", gravacoes: "RUSH ONE — Gravações", sincronizacao: "RUSH ONE — Sincronização", revisao: "RUSH ONE — Revisão Multi-POV", sintese: "RUSH ONE — Síntese" };
    document.title = titles[route] || "VOD Review — Plataforma de análise competitiva";
    bindCommonInteractions();
  }

  window.addEventListener("hashchange", render);
  render();
})();
