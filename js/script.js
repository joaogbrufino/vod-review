(function () {
  "use strict";

  const app = document.querySelector("#app");

  const assets = {
    loginBackground: "assets/auth-login-bg.png",
    registerBackground: "assets/auth-register-bg.png",
    teamBackground: "assets/auth-team-bg.png",
    eye: "assets/eye.svg",
    upload: "assets/image.svg",
    shield: "assets/shield.svg",
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
    agents: {
      omen: { portrait: "assets/agents/omen-portrait.png", icon: "assets/agents/omen-icon.png" },
      jett: { portrait: "assets/agents/jett-portrait.png", icon: "assets/agents/jett-icon.png" },
      sova: { portrait: "assets/agents/sova-portrait.png", icon: "assets/agents/sova-icon.png" },
      killjoy: { portrait: "assets/agents/killjoy-portrait.png", icon: "assets/agents/killjoy-icon.png" },
      viper: { portrait: "assets/agents/viper-portrait.png", icon: "assets/agents/viper-icon.png" }
    }
  };

  const routes = new Set(["login", "cadastro", "equipe", "dashboard", "partidas", "jogadores"]);

  function getRoute() {
    const route = window.location.hash.replace(/^#\/?/, "").split("?")[0];
    return routes.has(route) ? route : "login";
  }

  function navigate(route) {
    window.location.hash = route;
  }

  function globalNavigation(active) {
    const items = [
      { key: "team", label: "Meu Time", href: "#dashboard" },
      { key: "matches", label: "Partidas", href: "#partidas" },
      { key: "reviews", label: "Revisões", href: "#", demo: true }
    ];

    return `<nav class="global-nav" aria-label="Navegação principal">
      ${items.map((item) => `<a class="global-nav__item${item.key === active ? " is-active" : ""}" href="${item.href}"${item.demo ? " data-demo-link" : ""}${item.key === active ? ' aria-current="page"' : ""}>${item.label}</a>`).join("")}
    </nav>`;
  }

  function teamSectionNavigation(active) {
    const items = [
      { key: "overview", label: "Visão Geral", href: "#dashboard" },
      { key: "history", label: "Histórico", href: "#", demo: true },
      { key: "players", label: "Players", href: "#jogadores" },
      { key: "metrics", label: "Métricas", href: "#", demo: true }
    ];

    return `<nav class="content-tabs__nav" aria-label="Seções da equipe">
      ${items.map((item) => `<a class="content-tab${item.key === active ? " is-active" : ""}" href="${item.href}"${item.demo ? " data-demo-link" : ""}${item.key === active ? ' aria-current="page"' : ""}>${item.label}</a>`).join("")}
    </nav>`;
  }

  function teamSummary() {
    return `<section class="team-summary" aria-label="Resumo da equipe">
      <div class="team-summary__identity">
        <img class="team-summary__logo" src="${assets.rushone}" alt="Logo RUSH ONE">
        <h1 class="team-summary__name">RUSH ONE</h1>
        <div class="team-summary__meta"><span>RSH</span><span>·</span><img src="${assets.brazil}" alt="Brasil"><span>· 2W 1L · 33.85% WR</span></div>
      </div>
      <p class="team-summary__metric">43%</p>
      <dl class="team-summary__facts"><dt>Ranking:</dt><dd>#1</dd><dt>Info 2:</dt><dd>--</dd><dt>Info 3:</dt><dd>--</dd></dl>
    </section>`;
  }

  function authShell(options) {
    const isLogin = options.kind === "login";
    return `
      <section class="auth-screen" data-screen="${options.kind}">
        <aside class="auth-branding" style="--auth-background: url('../${options.background}')" aria-label="Identidade visual RUSH ONE">
          <div class="brand-heading">
            <p class="brand-mark ${isLogin ? "" : "brand-mark--large"}">LOGO</p>
            ${isLogin ? "" : '<span class="brand-heading__rule" aria-hidden="true"></span>'}
          </div>
          <p class="brand-footer">
            <span>© 2026 ${isLogin ? "NOME DO SISTEMA" : "RUSH ONE ESPORTS"}</span>
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
    return authShell({
      kind: "login",
      background: assets.loginBackground,
      content: `
        <form class="auth-card" data-form="login">
          <header class="auth-title-group">
            <h1 class="auth-title">LOGIN</h1>
            <p class="auth-description">Entre com as suas credenciais de analista ou jogador.</p>
          </header>
          <div class="form-stack">
            <div class="field">
              <label for="login-user">E-MAIL OU USUÁRIO</label>
              <div class="input-shell"><input id="login-user" name="user" type="text" value="analista@rushone.gg" autocomplete="username"></div>
            </div>
            <div class="field">
              <div class="field__head">
                <label for="login-password">SENHA DE ACESSO</label>
                <a href="#" data-demo-link>Esqueceu a senha?</a>
              </div>
              <div class="input-shell">
                <input id="login-password" name="password" type="password" value="rushone-terminal" autocomplete="current-password">
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
            <div class="auth-footer"><span>Não possui uma conta?</span><a href="#cadastro">Criar conta</a></div>
          </div>
        </form>`
    });
  }

  function registerScreen() {
    return authShell({
      kind: "cadastro",
      background: assets.registerBackground,
      content: `
        <form class="auth-card" data-form="register">
          <header class="auth-title-group">
            <h1 class="auth-title">CRIAR CONTA</h1>
            <p class="auth-description">Após finalizar seu cadastro de conta, você será direcionado para a <strong>etapa de criação da sua equipe.</strong></p>
          </header>
          <div class="form-stack form-stack--compact">
            <div class="field">
              <label for="register-name">NOME COMPLETO</label>
              <div class="input-shell"><input id="register-name" name="name" type="text" value="Carlos Henrique 'caKo' Silva" autocomplete="name"></div>
            </div>
            <div class="field">
              <label for="register-email">ENDEREÇO DE E-MAIL</label>
              <div class="input-shell input-shell--muted"><input id="register-email" name="email" type="email" value="carlos.cako@rushone.gg" autocomplete="email"></div>
            </div>
            <div class="form-row">
              <div class="field">
                <label for="register-password">SENHA DE ACESSO</label>
                <div class="input-shell"><input id="register-password" name="password" type="password" value="rushone2026" autocomplete="new-password"></div>
              </div>
              <div class="field">
                <label for="register-confirm">CONFIRMAR SENHA</label>
                <div class="input-shell"><input id="register-confirm" name="confirm" type="password" value="rushone2026" autocomplete="new-password"></div>
              </div>
            </div>
            <label class="check-row check-row--offset">
              <input type="checkbox" checked required>
              <span class="check-row__box" aria-hidden="true"></span>
              <span>Li e aceito os <a href="#" data-demo-link>Termos de Uso</a> e <a href="#" data-demo-link>Política de Privacidade</a></span>
            </label>
          </div>
          <div class="actions">
            <button class="primary-button" type="submit">CRIAR CONTA DA EQUIPE</button>
            <div class="auth-footer"><span>Já possui uma conta?</span><a href="#login">Fazer login</a></div>
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
            <p class="auth-description">Cada treinador/analista pode possuir apenas <strong>uma equipe ativa</strong> no sistema RUSH ONE.</p>
          </header>
          <div class="form-stack form-stack--team">
            <div class="license-box">
              <img class="license-box__icon" src="${assets.shield}" alt="">
              <div class="license-box__copy">
                <span class="license-box__eyebrow">TIPO DE LICENÇA MANDATÓRIA</span>
                <strong class="license-box__name">VALORANT PROFESSIONAL LEAGUE</strong>
              </div>
              <span class="license-box__badge">LOCKED</span>
            </div>
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
    return `<button class="match-catalog-card${match.selected ? " is-selected" : ""}" type="button" aria-label="${match.opponent}, ${match.status}">
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
    return `<section class="matches-screen" data-screen="partidas">
      <header class="dashboard-header">
        <a class="dashboard-logo-slot" href="#dashboard" aria-label="Voltar para Meu Time"></a>
        <div class="dashboard-header__spacer"></div>
        ${globalNavigation("matches")}
        <div class="dashboard-header__spacer"></div>
      </header>
      <main class="matches-page">
        <header class="matches-page__heading">
          <div><p class="page-eyebrow">COMPETITIVO · 2026</p><h1>PARTIDAS</h1><p>Consulte resultados, participantes e estatísticas registradas no scoreboard.</p></div>
          <button class="matches-primary-action" type="button" data-demo-link><span aria-hidden="true">＋</span> NOVA PARTIDA</button>
        </header>
        <section class="matches-kpis" aria-label="Resumo das partidas">
          <article><span>TOTAL DE PARTIDAS</span><strong>18</strong><small>Temporada 2026</small></article>
          <article><span>VITÓRIAS</span><strong>12</strong><small class="is-positive">+3 nos últimos 30 dias</small></article>
          <article><span>APROVEITAMENTO</span><strong>66.7%</strong><small>12W · 6L</small></article>
          <article><span>SALDO DE ROUNDS</span><strong>+34</strong><small>238 ganhos · 204 perdidos</small></article>
        </section>
        <section class="matches-toolbar" aria-label="Filtros de partidas">
          <label class="matches-search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Buscar adversário ou evento" aria-label="Buscar adversário ou evento"></label>
          <label class="matches-select"><span>STATUS</span><select aria-label="Status"><option>TODOS</option><option>FINALIZADA</option><option>AGENDADA</option></select></label>
          <label class="matches-select"><span>EVENTO</span><select aria-label="Evento"><option>VPL 2026</option><option>TODOS</option></select></label>
          <label class="matches-select"><span>FASE</span><select aria-label="Fase"><option>TODAS</option><option>GRUPOS</option><option>PLAYOFFS</option></select></label>
        </section>
        <div class="matches-layout">
          <aside class="match-catalog" aria-label="Lista de partidas">
            <div class="match-catalog__heading"><div><span>PARTIDAS</span><strong>18 registros</strong></div><button type="button" aria-label="Ordenar partidas" data-demo-link>↕</button></div>
            <div class="match-catalog__list">${matchCatalog.map(matchCatalogCard).join("")}</div>
            <button class="match-catalog__more" type="button" data-demo-link>CARREGAR MAIS</button>
          </aside>
          <article class="match-detail">
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
            <nav class="match-detail__tabs" aria-label="Detalhes da partida"><button class="is-active" type="button">SCOREBOARD</button><button type="button" data-demo-link>VISÃO GERAL</button><button type="button" data-demo-link>GRAVAÇÕES <span>5</span></button></nav>
            <div class="scoreboards">
              <div class="scoreboard-legend"><span>PLACAR FINAL E ESTATÍSTICAS INDIVIDUAIS</span><span><abbr title="Average Combat Score">ACS</abbr> · <abbr title="Kill, Assist, Survived, Traded">KAST</abbr> · <abbr title="First Kill">FK</abbr> · <abbr title="First Death">FD</abbr></span></div>
              ${scoreboardTable("RUSH ONE", "RSH", assets.rushone, "43", "home", homeScoreboard)}
              ${scoreboardTable("GREEN OWLS", "UNB", assets.greenOwls, "35", "away", opponentScoreboard)}
            </div>
          </article>
        </div>
      </main>
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

  function playersScreen() {
    return `<section class="players-screen" data-screen="jogadores">
      <header class="dashboard-header">
        <a class="dashboard-logo-slot" href="#dashboard" aria-label="Voltar para Meu Time"></a>
        <div class="dashboard-header__spacer"></div>
        ${globalNavigation("team")}
        <div class="dashboard-header__spacer"></div>
      </header>
      <main class="players-page">
        <div class="players-page__navigation">
          ${teamSummary()}
          <div class="content-tabs players-section-bar">
            ${teamSectionNavigation("players")}
            <div class="filters">
              <label class="filter filter--year"><span>ANO</span><select aria-label="Ano"><option>2026</option><option>2025</option></select></label>
              <label class="filter filter--event"><span>FUNÇÃO</span><select aria-label="Função"><option>ALL</option><option>CONTROLADOR</option><option>DUELISTA</option></select></label>
              <label class="filter filter--phase"><span>STATUS</span><select aria-label="Status"><option>ATIVOS</option><option>TODOS</option></select></label>
            </div>
          </div>
        </div>
        <div class="players-layout">
          <aside class="roster-panel" aria-label="Elenco da equipe">
            <header class="roster-panel__heading"><div><span>ELENCO ATIVO</span><strong>5 / 5 JOGADORES</strong></div><button type="button" aria-label="Adicionar jogador" data-demo-link>＋</button></header>
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
        </div>
      </main>
    </section>`;
  }

  function dashboardScreen() {
    return `
      <section class="dashboard-screen" data-screen="dashboard">
        <header class="dashboard-header">
          <div class="dashboard-logo-slot" aria-label="Área reservada para o logo"></div>
          <div class="dashboard-header__spacer"></div>
          ${globalNavigation("team")}
          <div class="dashboard-header__spacer"></div>
        </header>
        <div class="dashboard-workspace">
          <aside class="match-sidebar" aria-label="Histórico de partidas">
            <section class="latest-match">
              <div class="latest-match__title"><span>ÚLTIMA PARTIDA</span><strong>WIN</strong></div>
              <div class="latest-match__hero">
                <img class="latest-match__map" src="${assets.haven}" alt="Mapa Haven">
                <div class="latest-match__versus">
                  <img class="team-logo" src="${assets.rushone}" alt="RUSH ONE"><span>RSH</span><span class="score-chip">2-0</span><span>UNB</span><img class="team-logo" src="${assets.greenOwls}" alt="Green Owls">
                </div>
              </div>
              <button class="latest-match__details" type="button">VER DETALHES</button>
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
              ${recentMatches.map(matchRow).join("")}
            </section>
          </aside>
          <main class="dashboard-main">
            <div>
              ${teamSummary()}
              <div class="content-tabs">
                ${teamSectionNavigation("overview")}
                <div class="filters">
                  <label class="filter filter--year"><span>ANO</span><select aria-label="Ano"><option>2026</option><option>2025</option></select></label>
                  <label class="filter filter--event"><span>EVENTO</span><select aria-label="Evento"><option>ALL</option><option>VPL</option></select></label>
                  <label class="filter filter--phase"><span>FASE</span><select aria-label="Fase"><option>ALL</option><option>GROUP</option></select></label>
                </div>
              </div>
            </div>
            <section class="player-grid" aria-label="Jogadores">${players.map(playerCard).join("")}</section>
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
            </section>
          </main>
          <aside class="agent-panel" aria-label="Painel de revisão">
            <button class="new-match-button" type="button">+ NOVA PARTIDA</button>
            <section class="review-card">
              <h2 class="review-card__title">REVISÃO EM ANDAMENTO</h2>
              <div class="review-match">
                <img src="${assets.reviewMap}" alt="Mapa da partida">
                <div class="review-match__copy"><p class="review-match__teams">UNIRV RUSH ONE<br>vs<br>UTFPR AZURE BEARS</p><p class="review-match__time">Sex 28 · 12:00H</p></div>
              </div>
              <div class="review-progress__label"><span>Progresso da revisão</span><span>4/5 POV’s</span></div>
              <div class="review-progress__segments" aria-label="Quatro de cinco pontos de vista concluídos"><span class="is-done"></span><span class="is-done"></span><span class="is-done"></span><span class="is-done"></span><span></span></div>
              <button class="continue-review" type="button">CONTINUAR REVISÃO</button>
            </section>
            <h2 class="notes-heading">Anotações Recentes</h2>
            ${recentNotes.map(noteCard).join("")}
          </aside>
        </div>
      </section>`;
  }

  function bindCommonInteractions() {
    document.querySelectorAll("[data-demo-link]").forEach((link) => {
      link.addEventListener("click", (event) => event.preventDefault());
    });

    document.querySelectorAll("[data-password-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const input = button.parentElement.querySelector("input");
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        button.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
      });
    });

    const loginForm = document.querySelector('[data-form="login"]');
    if (loginForm) loginForm.addEventListener("submit", (event) => { event.preventDefault(); navigate("dashboard"); });

    const registerForm = document.querySelector('[data-form="register"]');
    if (registerForm) registerForm.addEventListener("submit", (event) => { event.preventDefault(); navigate("equipe"); });

    const teamForm = document.querySelector('[data-form="team"]');
    if (teamForm) teamForm.addEventListener("submit", (event) => { event.preventDefault(); navigate("dashboard"); });

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

    function bindTabGroup(selector) {
      // O Figma só detalha a Visão Geral do Dashboard. As demais abas mudam
      // apenas o estado visual ativo, sem criar conteúdo que não existe no protótipo.
      document.querySelectorAll(selector).forEach((button) => {
        button.addEventListener("click", () => {
          document.querySelectorAll(selector).forEach((item) => item.classList.toggle("is-active", item === button));
        });
      });
    }

    bindTabGroup("[data-nav-tab]");
    bindTabGroup("[data-content-tab]");
  }

  function render() {
    const route = getRoute();
    if (!window.location.hash) window.history.replaceState(null, "", "#login");

    const screens = {
      login: loginScreen,
      cadastro: registerScreen,
      equipe: teamScreen,
      dashboard: dashboardScreen,
      partidas: matchesScreen,
      jogadores: playersScreen
    };

    app.innerHTML = screens[route]();
    const titles = { dashboard: "RUSH ONE — Dashboard", partidas: "RUSH ONE — Partidas", jogadores: "RUSH ONE — Jogadores" };
    document.title = titles[route] || "RUSH ONE — Terminal";
    bindCommonInteractions();
  }

  window.addEventListener("hashchange", render);
  render();
})();
