(function () {
  "use strict";

  const app = document.querySelector("#app");

  const assets = {
    teamBackground: "assets/auth-team-bg.png",
    brandLogo: "assets/vod-review-logo.png",
    eye: "assets/eye.svg",
    upload: "assets/image.svg",
    shieldLogo: "assets/shield.svg",
    haven: "assets/haven.png",
    rushone: "assets/rushone.png",
    greenOwls: "assets/green-owls.png",
    caap: "assets/caap-hellhounds.png",
    a2e: "assets/a2e-uff.png",
    ufu: "assets/ufu-saints.png",
    ceub: "assets/ceub-octopus.png",
    azure: "assets/azure-bears.png",
    wolf: "assets/wolf-gaming.png",
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
    "revisoes", "gravacoes", "sincronizacao", "preparando", "revisao", "sintese", "nova-partida", "scoreboard", "rastreabilidade"
  ]);

  // Estado exclusivamente visual: é descartado ao atualizar a página.
  const prototypeState = {
    matchStep: 1,
    participants: new Set(["André", "kick", "greinzera"]),
    recordingMode: "multi",
    syncState: "pending",
    scoreboardState: "incomplete",
    reviewReady: false,
    synthesisVersions: 0,
    selectedPlayer: "André"
  };

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
      ? [{ key: "users", label: "Gestão", href: "#usuarios" }]
      : [
          { key: "team", label: "Meu Time", href: "#dashboard" },
          { key: "matches", label: "Partidas", href: "#partidas" },
          { key: "reviews", label: "Revisões", href: "#revisoes" }
        ];

    return `<nav class="global-nav" aria-label="Navegação principal">
      ${items.map((item) => `<a class="global-nav__item${item.key === active ? " is-active" : ""}" href="${item.href}"${item.demo ? " data-demo-link" : ""}${item.key === active ? ' aria-current="page"' : ""}>${item.label}</a>`).join("")}
    </nav>`;
  }

  function getAuthenticatedUserName(profile = "trainer") {
    const storedName = window.sessionStorage.getItem("vodreview-user-name");
    if (storedName) return storedName;
    return profile === "admin" ? "Administrador" : "Lucas Ferreira";
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
        <img class="team-summary__logo" src="${assets.azure}" alt="Logo AZURE BEARS">
        <h1 class="team-summary__name">AZURE BEARS</h1>
        <div class="team-summary__meta"><span>AZR</span><span>·</span><span>GO</span><span>${getHashParams().has("vazio") ? "· SEM PARTIDAS CONSIDERADAS" : "· 12V 6D 0E · 66,7% DE VITÓRIAS"}</span></div>
      </div>
      ${compact ? "" : `<p class="team-summary__metric">43%</p>
      <dl class="team-summary__facts"><dt>Ranking:</dt><dd>#1</dd><dt>Info 2:</dt><dd>--</dd><dt>Info 3:</dt><dd>--</dd></dl>`}
    </section>`;
  }

  function authShell(options) {
    const isLogin = options.kind === "login";
    return `
      <section class="auth-screen${isLogin ? " auth-screen--centered" : ""}" data-screen="${options.kind}">
        ${isLogin ? "" : `<aside class="auth-branding" style="--auth-background: url('../${options.background}')" aria-label="Identidade visual da equipe">
          <div class="brand-heading">
            <p class="brand-mark brand-mark--large">LOGO DA EQUIPE</p>
            <span class="brand-heading__rule" aria-hidden="true"></span>
          </div>
          <p class="brand-footer">
            <span class="brand-footer__identity">© 2026 AZURE BEARS</span>
            <span>1.0.0 RELEASE</span>
          </p>
        </aside>`}
        <div class="auth-panel">
          ${isLogin ? "" : `<div class="step-indicator" aria-hidden="true"><span></span><span></span><span></span></div>`}
          ${options.content}
          ${isLogin ? "" : `<div class="auth-panel__bottom-space auth-panel__bottom-space--line" aria-hidden="true"></div>`}
        </div>
      </section>`;
  }

  function loginScreen() {
    return authShell({
      kind: "login",
      content: `
        <form class="auth-card" data-form="login">
          <header class="auth-title-group">
            <img class="auth-title-logo" src="${assets.brandLogo}" alt="VOD Review">
            <h1 class="auth-title">LOGIN</h1>
            <p class="auth-description">Entre com suas credenciais para acessar a plataforma.</p>
          </header>
          <div class="form-stack">
            <div class="field field--invalid">
              <label for="login-user">E-MAIL OU USUÁRIO</label>
              <div class="input-shell"><input id="login-user" name="user" type="text" value="" autocomplete="username" aria-invalid="true" aria-describedby="login-user-error"></div>
              <p class="field-error" id="login-user-error">E-mail ou usuário é obrigatório</p>
            </div>
            <div class="field field--invalid">
              <div class="field__head">
                <label for="login-password">SENHA DE ACESSO</label>
              </div>
              <div class="input-shell">
                <input id="login-password" name="password" type="text" value="vodreview-demo" autocomplete="current-password" aria-invalid="true" aria-describedby="login-password-error">
                <button class="password-toggle is-active" type="button" data-password-toggle aria-label="Ocultar senha" aria-pressed="true"><img src="${assets.eye}" alt=""></button>
              </div>
              <p class="field-error" id="login-password-error">Senha é obrigatória</p>
            </div>
          </div>
          <div class="actions">
            <button class="primary-button" type="submit">ENTRAR NO TERMINAL</button>
          </div>
        </form>
        <div class="login-toast-region" aria-label="Notificações de autenticação" aria-live="polite">
          <div class="login-toast login-toast--error" role="alert"><i data-lucide="circle-alert" aria-hidden="true"></i><span>E-mail, nome de usuário ou senha inválidos</span></div>
          <div class="login-toast login-toast--error" role="alert"><i data-lucide="user-x" aria-hidden="true"></i><span>Sua conta está inativa</span></div>
          <div class="login-toast login-toast--warning" role="alert"><i data-lucide="clock-3" aria-hidden="true"></i><span>Sua sessão expirou. Entre novamente</span></div>
        </div>`
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
              <div class="input-shell"><input id="team-name" name="teamName" type="text" value="AZURE BEARS"></div>
            </div>
            <div class="form-row">
              <div class="field field--tag">
                <div class="field__head"><label for="team-tag">TAG / SIGLA</label><span class="hint">MÁX 4 CH.</span></div>
                <div class="input-shell"><input id="team-tag" name="tag" type="text" maxlength="4" value="AZR"></div>
              </div>
              <div class="field">
                <label for="team-state">ESTADO (UF)</label>
                ${stateField("GO", "team-state")}
              </div>
            </div>
          </div>
          <div class="actions"><button class="primary-button" type="submit">FINALIZAR E ENTRAR NO PAINEL</button></div>
        </form>`
    });
  }

  const recentMatches = [
    { week: "Haven", rival: "Green Owls", rivalLogo: assets.greenOwls, logoSize: 20, ours: 13, theirs: 8, result: "win" },
    { week: "Ascent", rival: "Wolf Gaming", rivalLogo: assets.wolf, logoSize: 20, ours: 9, theirs: 13, result: "loss" },
    { week: "Lotus", rival: "CAAP Hellhounds", rivalLogo: assets.caap, logoSize: 17, ours: 13, theirs: 11, result: "win" },
    { week: "Split", rival: "A2E UFF", rivalLogo: assets.a2e, logoSize: 20, ours: 13, theirs: 6, result: "win" },
    { week: "Bind", rival: "UFU Saints", rivalLogo: assets.ufu, logoSize: 19, ours: 13, theirs: 10, result: "win" },
    { week: "Haven", rival: "UFU Saints", rivalLogo: assets.ufu, logoSize: 19, ours: 13, theirs: 7, result: "win" }
  ];

  const playerPhotos = {
    "André": "assets/players/Andr%C3%A9.webp",
    kick: "assets/players/kick.webp",
    greinzera: "assets/players/greinzera.webp",
    pim: "assets/players/pim_new.webp",
    taek: "assets/players/taek.webp"
  };
  function playerInitials(name) {
    return String(name || "?").replace(/[^\p{L}\p{N} ]/gu, "").trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toLocaleUpperCase("pt-BR") || "?";
  }
  function playerAvatar(name, cls = "") {
    const roster = (typeof rosterPlayers !== "undefined" ? rosterPlayers : []).find((r) => r.name === name);
    const src = roster ? roster.photo : playerPhotos[name];
    return src
      ? `<img class="player-photo ${cls}" src="${src}" alt="Foto de ${name}">`
      : `<span class="player-photo player-photo--empty ${cls}" role="img" aria-label="${name} sem foto"><b>${playerInitials(name)}</b></span>`;
  }

  const players = [
    { rating: "+3,2", name: "André", agent: "Omen", portrait: assets.agents.omen.portrait, icons: [{ name: "Omen", src: assets.agents.omen.icon }, { name: "Viper", src: assets.agents.viper.icon }] },
    { rating: "+5,1", name: "kick", agent: "Jett", portrait: assets.agents.jett.portrait, icons: [{ name: "Jett", src: assets.agents.jett.icon }, { name: "Omen", src: assets.agents.omen.icon }] },
    { rating: "+0,8", name: "greinzera", agent: "Sova", portrait: assets.agents.sova.portrait, icons: [{ name: "Sova", src: assets.agents.sova.icon }, { name: "Killjoy", src: assets.agents.killjoy.icon }] },
    { rating: "+2,4", name: "pim", agent: "Killjoy", portrait: assets.agents.killjoy.portrait, icons: [{ name: "Killjoy", src: assets.agents.killjoy.icon }, { name: "Viper", src: assets.agents.viper.icon }] },
    { rating: "−1,3", name: "taek", agent: "Viper", portrait: assets.agents.viper.portrait, icons: [{ name: "Viper", src: assets.agents.viper.icon }, { name: "Sova", src: assets.agents.sova.icon }] }
  ];

  const recentNotes = [
    { target: "JOGADOR · kick", time: "12:42", match: "VS WOLF GAMING · ASCENT", body: "Rotação tardia após o contato. Revisar o utilitário do Sova no retake." },
    { target: "JOGADOR · André", time: "07:31", match: "VS WOLF GAMING · ASCENT", body: "Evitar compra fragmentada. Priorizar entrada da Jett com flash coordenada." },
    { target: "EQUIPE", time: "03:18", match: "VS WOLF GAMING · ASCENT", body: "Manter dupla em crossfire e guardar a Viper Pit para o segundo contato." }
  ];

  const chartData = [
    { x: "0%", date: "28/03", logo: assets.greenOwls, logoSize: 31, logoOffset: 8, logoTop: 257, a: ["W", 13, 104], b: ["L", 8, 64] },
    { x: "16.66%", date: "21/03", logo: assets.wolf, logoSize: 31, logoOffset: 9, logoTop: 257, a: ["L", 9, 72], b: ["W", 13, 104] },
    { x: "33.33%", date: "14/03", logo: assets.caap, logoSize: 31, logoOffset: 11, logoTop: 257, a: ["W", 13, 104], b: ["L", 11, 88] },
    { x: "50%", date: "07/03", logo: assets.a2e, logoSize: 34, logoOffset: 10, logoTop: 255, a: ["W", 13, 104], b: ["L", 6, 48] },
    { x: "66.66%", date: "28/02", logo: assets.ufu, logoSize: 31, logoOffset: 9, logoTop: 257, a: ["W", 13, 104], b: ["L", 10, 80] },
    { x: "83.33%", date: "21/02", logo: assets.poli, logoSize: 33, logoOffset: 9, logoTop: 259, a: ["L", 11, 88], b: ["W", 13, 104] },
    { x: "100%", date: "14/02", logo: assets.pucc, logoSize: 29, logoOffset: -3, logoTop: 257, a: ["W", 13, 104], b: ["L", 7, 56] }
  ];

  function matchRow(match) {
    const oursMuted = match.result === "loss" ? " is-muted" : "";
    const rivalMuted = match.result === "win" ? " is-muted" : "";
    return `
      <article class="match-row">
        <div class="match-row__meta"><span><strong>Mar 28</strong> · 12:20 PM</span><span>${match.week}</span></div>
        <div class="match-row__team${oursMuted}">
          <span class="match-row__identity"><span class="match-logo"><img src="${assets.azure}" alt=""></span><span>AZURE BEARS</span></span>
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
      <article class="player-card" role="button" tabindex="0" aria-label="${player.name}" data-proto-action="select-player" data-player="${player.name}" data-goto="jogadores">
        ${playerAvatar(player.name, "player-card__photo")}
        <span class="player-card__shade" aria-hidden="true"></span>
        <h3 class="player-card__name">${player.name}</h3>
        <div class="player-card__icons" aria-label="Agentes mais usados">
          ${player.icons.map((icon) => `<span><img src="${icon.src}" alt="${icon.name}" title="${icon.name}"></span>`).join("")}
        </div>
      </article>`;
  }

  function noteCard(note, index) {
    return `
      <article class="note-card" aria-label="Anotação ${index + 1}: ${note.target}">
        <div class="note-card__topline">
          <span class="note-card__index">0${index + 1}</span>
          <span class="note-card__tag">${note.target}</span>
        </div>
        <h3 class="note-card__title">${note.match}</h3>
        <p class="note-card__body">${note.body}</p>
        <footer class="note-card__footer">
          <span>INSTANTE ${note.time}</span>
          <span>EM ANDAMENTO</span>
        </footer>
      </article>`;
  }

  function chartBar(data, position) {
    if (!data) return "";
    const isTeam = position === "first";
    return `<div class="chart-bar chart-bar--${position}${isTeam ? " is-win" : ""}" style="height:${data[2]}px">
      <span class="chart-bar__result">${isTeam ? (data[0] === "W" ? "V" : "D") : ""}</span><span class="chart-bar__score">${data[1]}</span>
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
    { status: "REVISÃO FINALIZADA", result: "WIN", date: "28 MAR · 12:20", event: "VPL · SEMANA 2", opponent: "GREEN OWLS", opponentTag: "UNB", logo: assets.greenOwls, score: "13 — 8", map: "HAVEN", selected: true },
    { status: "REVISÃO EM ANDAMENTO", result: "LOSS", date: "21 MAR · 19:00", event: "VPL · SEMANA 2", opponent: "WOLF GAMING", opponentTag: "WLF", logo: assets.wolf, score: "9 — 13", map: "ASCENT" },
    { status: "AGUARDANDO GRAVAÇÕES", result: "PENDING", date: "14 MAR · 18:30", event: "VPL · SEMANA 1", opponent: "CAAP HELLHOUNDS", opponentTag: "CAAP", logo: assets.caap, score: "— : —", map: "LOTUS" }
  ];

  const homeScoreboard = [
    { player: "kick", agent: "Jett", icon: assets.agents.jett.icon, rating: "1.31", acs: 268, k: 22, d: 13, a: 5, diff: "+9", kast: "78%", hs: "31%", fk: 6, fd: 2 },
    { player: "André", agent: "Omen", icon: assets.agents.omen.icon, rating: "1.18", acs: 224, k: 18, d: 14, a: 11, diff: "+4", kast: "74%", hs: "24%", fk: 3, fd: 2 },
    { player: "pim", agent: "Killjoy", icon: assets.agents.killjoy.icon, rating: "1.12", acs: 208, k: 17, d: 13, a: 8, diff: "+4", kast: "81%", hs: "27%", fk: 2, fd: 1 },
    { player: "greinzera", agent: "Sova", icon: assets.agents.sova.icon, rating: "1.04", acs: 191, k: 15, d: 14, a: 13, diff: "+1", kast: "76%", hs: "22%", fk: 1, fd: 2 },
    { player: "taek", agent: "Viper", icon: assets.agents.viper.icon, rating: "0.98", acs: 176, k: 14, d: 15, a: 7, diff: "−1", kast: "71%", hs: "29%", fk: 1, fd: 3 }
  ];

  const opponentScoreboard = [
    { player: "luk", agent: "Jett", icon: assets.agents.jett.icon, rating: "1.09", acs: 216, k: 17, d: 17, a: 4, diff: "0", kast: "70%", hs: "28%", fk: 4, fd: 3 },
    { player: "koala", agent: "Omen", icon: assets.agents.omen.icon, rating: "0.97", acs: 188, k: 14, d: 16, a: 9, diff: "−2", kast: "68%", hs: "25%", fk: 2, fd: 3 },
    { player: "nzt", agent: "Sova", icon: assets.agents.sova.icon, rating: "0.91", acs: 174, k: 13, d: 17, a: 10, diff: "−4", kast: "65%", hs: "20%", fk: 1, fd: 2 },
    { player: "dalla", agent: "Killjoy", icon: assets.agents.killjoy.icon, rating: "0.86", acs: 162, k: 12, d: 17, a: 6, diff: "−5", kast: "63%", hs: "26%", fk: 2, fd: 3 },
    { player: "brave", agent: "Viper", icon: assets.agents.viper.icon, rating: "0.79", acs: 149, k: 10, d: 19, a: 7, diff: "−9", kast: "59%", hs: "23%", fk: 1, fd: 3 }
  ];

  // Partidas da equipe (RF006) e gravações dos participantes (RF008): estado da demonstração
  const matchStatusLabel = { finalized: "REVISÃO FINALIZADA", progress: "REVISÃO EM ANDAMENTO", waiting: "AGUARDANDO GRAVAÇÕES" };
  const opponentLogos = { "GREEN OWLS": assets.greenOwls, "WOLF GAMING": assets.wolf, "CAAP HELLHOUNDS": assets.caap, "A2E UFF": assets.a2e, "UFU SAINTS": assets.ufu };
  const mapOptions = ["Ascent", "Bind", "Haven", "Lotus", "Split"];
  const mapImages = { Ascent: "assets/maps/Ascent.webp", Bind: "assets/maps/Bind.webp", Haven: "assets/maps/Haven.png", Lotus: "assets/maps/Lotus.jpg", Split: "assets/maps/Split.webp" };
  const fullFive = ["kick", "André", "pim", "greinzera", "taek"];
  const recordingOf = (name, gb, dur) => ({ file: `${name.toLowerCase()}_pov.mp4`, size: gb, duration: dur });
  prototypeState.matches = [
    { id: "m1", opponent: "GREEN OWLS", tag: "UNB", datetime: "2026-03-28T12:20", event: "VPL 2026 · Semana 2", type: "CAMPEONATO", map: "Haven", status: "finalized", ours: 13, theirs: 8,
      participants: [...fullFive], recordings: Object.fromEntries(fullFive.slice(0, 4).map((n, i) => [n, recordingOf(n, 1.2 + i * .2, "42:18")])) },
    { id: "m2", opponent: "WOLF GAMING", tag: "WLF", datetime: "2026-03-21T19:00", event: "VPL 2026 · Semana 2", type: "CAMPEONATO", map: "Ascent", status: "progress", ours: null, theirs: null,
      participants: [...fullFive], recordings: Object.fromEntries(fullFive.slice(0, 4).map((n, i) => [n, recordingOf(n, 1.1 + i * .2, "38:52")])) },
    { id: "m3", opponent: "CAAP HELLHOUNDS", tag: "CAAP", datetime: "2026-03-14T18:30", event: "VPL 2026 · Semana 1", type: "CAMPEONATO", map: "Lotus", status: "waiting", ours: null, theirs: null,
      participants: ["André", "kick", "greinzera"], recordings: { "André": recordingOf("André", 1.2, "41:05"), kick: recordingOf("kick", 1.1, "39:48") } },
    { id: "m4", opponent: "A2E UFF", tag: "A2E", datetime: "2026-03-07T19:00", event: "Copa Aliança 2026", type: "CAMPEONATO", map: "Split", status: "finalized", ours: 13, theirs: 6,
      participants: [...fullFive], recordings: Object.fromEntries(fullFive.map((n, i) => [n, recordingOf(n, 1.0 + i * .1, "36:40")])) },
    { id: "m5", opponent: "UFU SAINTS", tag: "UFU", datetime: "2026-02-28T19:00", event: "Copa Aliança 2026", type: "CAMPEONATO", map: "Bind", status: "finalized", ours: 13, theirs: 10,
      participants: [...fullFive], recordings: Object.fromEntries(fullFive.map((n, i) => [n, recordingOf(n, 1.1 + i * .1, "40:02")])) }
  ];
  prototypeState.selectedMatch = null;
  prototypeState.recordingMatch = "m2";
  const findMatch = (id) => prototypeState.matches.find((match) => match.id === id);
  const monthsPt = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
  function matchDate(value, withYear = false) {
    const [date, time] = value.split("T");
    const [y, mo, d] = date.split("-");
    return `${d} ${monthsPt[Number(mo) - 1]}${withYear ? ` ${y}` : ""} · ${time}`;
  }
  function matchResult(match) {
    if (match.status !== "finalized") return { key: "PENDING", label: "SEM PLACAR", score: "— : —" };
    const key = match.ours > match.theirs ? "WIN" : match.ours < match.theirs ? "LOSS" : "DRAW";
    return { key, label: key === "WIN" ? "VITÓRIA" : key === "LOSS" ? "DERROTA" : "EMPATE", score: `${match.ours} — ${match.theirs}` };
  }

  function matchCatalogCard(match) {
    const result = matchResult(match);
    const resultClass = result.key === "WIN" ? " is-win" : result.key === "LOSS" ? " is-loss" : " is-upcoming";
    const search = `${match.opponent} ${match.event} ${match.map}`.toLocaleLowerCase("pt-BR");
    return `<button class="match-catalog-card${prototypeState.selectedMatch === match.id ? " is-selected" : ""}" type="button" aria-label="${match.opponent}, ${matchStatusLabel[match.status]}" data-proto-action="select-match" data-match="${match.id}" data-search="${search}">
      <span class="match-catalog-card__top"><span>${matchDate(match.datetime)}</span><span>${match.event || match.type}</span></span>
      <span class="match-catalog-card__body">
        <span class="match-catalog-card__team"><img src="${assets.azure}" alt=""><span><strong>AZURE BEARS</strong><small>AZR</small></span></span>
        <span class="match-catalog-card__score${resultClass}"><small>${result.label}</small><strong>${result.score}</strong></span>
        <span class="match-catalog-card__team match-catalog-card__team--opponent"><img src="${opponentLogos[match.opponent] || assets.shieldLogo}" alt=""><span><strong>${match.opponent}</strong><small>${match.tag || ""}</small></span></span>
      </span>
      <span class="match-catalog-card__bottom"><span>${match.map.toLocaleUpperCase("pt-BR")}</span><span>${matchStatusLabel[match.status]}</span></span>
    </button>`;
  }

  function scoreboardRows(players) {
    return players.map((player, index) => `<tr>
      <td class="scoreboard-player"><span class="scoreboard-position">0${index + 1}</span><img src="${player.icon}" alt="${player.agent}"><span><strong>${player.player}</strong><small>${player.agent}</small></span></td>
      <td>${player.k}</td><td>${player.d}</td><td>${player.a}</td><td>${player.fk}</td><td class="is-emphasis ${player.diff.startsWith("+") ? "is-positive" : player.diff.startsWith("−") ? "is-negative" : ""}">${player.diff}</td>
    </tr>`).join("");
  }

  function scoreboardTable(team, tag, logo, score, side, players) {
    return `<section class="scoreboard-team scoreboard-team--${side}" aria-labelledby="scoreboard-${side}">
      <header class="scoreboard-team__header">
        <div class="scoreboard-team__identity"><img src="${logo}" alt=""><span><small>${tag}</small><strong id="scoreboard-${side}">${team}</strong></span></div>
        <div class="scoreboard-team__result"><span>RODADAS VENCIDAS</span><strong>${score}</strong></div>
      </header>
      <div class="scoreboard-table-scroll" tabindex="0" aria-label="Estatísticas de ${team}">
        <table class="scoreboard-table">
          <thead><tr><th>PARTICIPANTE / AGENTE</th><th>K</th><th>D</th><th>A</th><th>FK</th><th>SALDO</th></tr></thead>
          <tbody>${scoreboardRows(players)}</tbody>
        </table>
      </div>
    </section>`;
  }

  // Aba ANOTAÇÕES do detalhe da partida (RF011): consulta das anotações da sessão,
  // disponível durante a revisão em andamento e após a finalização.
  function matchNotesPanel(match) {
    const all = [...prototypeState.notes].sort((a, b) => a.time - b.time);
    const filter = prototypeState.matchNotesFilter || "all";
    const notes = filter === "all" ? all : filter === "team" ? all.filter((n) => n.target === "EQUIPE") : all.filter((n) => n.target !== "EQUIPE");
    const live = match.status === "progress";
    const counts = { all: all.length, team: all.filter((n) => n.target === "EQUIPE").length, players: all.filter((n) => n.target !== "EQUIPE").length };
    const chips = [["all", "TODAS"], ["team", "EQUIPE"], ["players", "JOGADORES"]]
      .map(([key, label]) => `<button type="button" class="notes-chip${filter === key ? " is-active" : ""}" data-proto-action="match-notes-filter" data-filter="${key}" aria-pressed="${filter === key}">${label}<span>${counts[key]}</span></button>`).join("");

    const item = (note, index) => {
      const team = note.target === "EQUIPE";
      const player = team ? null : rosterPlayers.find((r) => r.name === note.target);
      return `<article class="match-note" aria-label="Anotação ${index + 1} de ${notes.length}">
          <span class="match-note__rail" aria-hidden="true"><i></i></span>
          <span class="match-note__time"><i data-lucide="clock-3" aria-hidden="true"></i>${mmss(note.time)}</span>
          <div class="match-note__body">
            <header class="match-note__head">
              ${team
                ? '<span class="match-note__target match-note__target--team"><i data-lucide="users-round" aria-hidden="true"></i>EQUIPE</span>'
                : `<span class="match-note__target">${playerAvatar(note.target)}<strong>${note.target}</strong>${player ? `<small>${player.role}</small>` : ""}</span>`}
              <span class="match-note__index">#${String(index + 1).padStart(2, "0")}</span>
            </header>
            <p>${note.body.replace(/</g, "&lt;")}</p>
          </div>
        </article>`;
    };

    const body = notes.length
      ? `<ol class="match-notes__list">${notes.map((n, i) => `<li>${item(n, i)}</li>`).join("")}</ol>`
      : `<div class="match-empty-state">
          <i data-lucide="notebook-pen" aria-hidden="true"></i>
          <strong>${all.length ? "NENHUMA ANOTAÇÃO NESTE FILTRO" : "NENHUMA ANOTAÇÃO REGISTRADA"}</strong>
          <p>${all.length ? "Ajuste o filtro acima para visualizar as demais anotações da sessão." : "As anotações são registradas na sessão de revisão, vinculadas ao instante do vídeo e à equipe ou a um jogador."}</p>
        </div>`;

    return `<div class="match-notes-panel">
        <div class="match-panel__head">
          <div><span class="module-label">ANOTAÇÕES DA REVISÃO</span><strong>${all.length} ${all.length === 1 ? "anotação registrada" : "anotações registradas"}</strong></div>
          <span class="status-badge status-badge--${live ? "progress" : "success"}">${live ? "REVISÃO EM ANDAMENTO" : "REVISÃO FINALIZADA"}</span>
        </div>
        <div class="match-notes__filters" role="group" aria-label="Filtrar anotações">${chips}</div>
        ${body}
        <p class="dialog-info">${live
          ? "A sessão está em andamento: as anotações aparecem aqui conforme são criadas na revisão. A edição e a exclusão são feitas na própria sessão."
          : "A sessão está finalizada: as anotações ficam disponíveis somente para consulta e compõem a base da síntese da partida."}</p>
      </div>`;
  }

  // Aba SÍNTESE do detalhe da partida (RF013): gerada uma única vez por partida,
  // somente após a finalização da sessão de revisão.
  function matchSynthesisPanel(match) {
    prototypeState.matchSynthesis = prototypeState.matchSynthesis || {};
    const entry = prototypeState.matchSynthesis[match.id];
    const finalized = match.status === "finalized";
    const notes = prototypeState.notes.length;

    const frame = (inner, actions = "") => `<div class="match-synthesis-panel">
        <div class="match-panel__head">
          <div><span class="module-label">SÍNTESE DA PARTIDA</span><strong>AZURE BEARS × ${match.opponent} · ${match.map.toLocaleUpperCase("pt-BR")}</strong></div>
          <span class="status-badge status-badge--${entry && entry.status === "ready" ? "success" : entry && entry.status === "generating" ? "progress" : "pending"}">${
            !finalized ? "INDISPONÍVEL" : entry && entry.status === "ready" ? "GERADA" : entry && entry.status === "generating" ? "GERANDO" : entry && entry.status === "failed" ? "FALHA" : "NÃO GERADA"}</span>
        </div>
        ${inner}
        ${actions}
      </div>`;

    if (!finalized) {
      return frame(`<div class="match-empty-state">
          <i data-lucide="lock" aria-hidden="true"></i>
          <strong>SÍNTESE INDISPONÍVEL</strong>
          <p>A síntese é gerada a partir das anotações e do scoreboard, por isso só pode ser solicitada após a finalização da sessão de revisão desta partida.</p>
        </div>
        <p class="dialog-info">Finalize a sessão de revisão registrando o scoreboard da partida para liberar a geração da síntese.</p>`);
    }

    if (entry && entry.status === "generating") {
      return frame(`<div class="match-empty-state is-loading">
          <i data-lucide="sparkles" aria-hidden="true"></i>
          <strong>GERANDO SÍNTESE…</strong>
          <p>As anotações e o scoreboard estão sendo enviados ao modelo de linguagem com os nomes dos jogadores substituídos por pseudônimos.</p>
          <i class="recording-progress" aria-hidden="true"><b></b></i>
        </div>`);
    }

    if (entry && entry.status === "failed") {
      return frame(`<div class="match-empty-state is-error">
          <i data-lucide="circle-alert" aria-hidden="true"></i>
          <strong>NÃO FOI POSSÍVEL GERAR A SÍNTESE</strong>
          <p>O serviço do modelo de linguagem não respondeu. Nenhuma síntese foi registrada para esta partida; você pode solicitar a geração novamente.</p>
        </div>
        <div class="match-panel__actions"><button class="module-primary" type="button" data-proto-action="match-generate-synthesis" data-match="${match.id}">TENTAR NOVAMENTE</button></div>`);
    }

    if (!entry) {
      return frame(`<div class="match-empty-state">
          <i data-lucide="sparkles" aria-hidden="true"></i>
          <strong>NENHUMA SÍNTESE GERADA</strong>
          <p>A síntese reúne as ${notes} ${notes === 1 ? "anotação" : "anotações"} da revisão e o scoreboard final em uma leitura única da partida, com visão geral, pontos de atenção e foco para a próxima sessão.</p>
        </div>
        <ul class="synthesis-basis-list">
          <li><i data-lucide="notebook-pen" aria-hidden="true"></i><span><strong>${notes} ${notes === 1 ? "anotação" : "anotações"}</strong><small>Registradas na sessão de revisão</small></span></li>
          <li><i data-lucide="chart-no-axes-combined" aria-hidden="true"></i><span><strong>Scoreboard ${match.ours} — ${match.theirs}</strong><small>Estatísticas dos ${match.participants.length} participantes</small></span></li>
          <li><i data-lucide="shield-check" aria-hidden="true"></i><span><strong>Pseudônimos</strong><small>Nomes dos jogadores não são enviados ao modelo (LGPD)</small></span></li>
        </ul>
        <p class="dialog-info">A síntese é gerada uma única vez por partida e fica preservada para consulta.</p>
        <div class="match-panel__actions"><button class="module-primary" type="button" data-proto-action="match-generate-synthesis" data-match="${match.id}">GERAR SÍNTESE</button></div>`);
    }

    const text = SYNTH_TEXT[2];
    return frame(`<p class="synthesis-basis"><i data-lucide="sparkles" aria-hidden="true"></i>Gerada em ${entry.at} · ${entry.notes} ${entry.notes === 1 ? "anotação" : "anotações"} · placar ${entry.score}</p>
        <div class="synthesis-copy">
          <section><h3><i data-lucide="eye" aria-hidden="true"></i>VISÃO GERAL</h3><p>${text.overview}</p></section>
          <section><h3><i data-lucide="target" aria-hidden="true"></i>PONTOS DE ATENÇÃO</h3><ul class="synthesis-points">${text.points.map((x) => `<li>${x}</li>`).join("")}</ul></section>
          <section><h3><i data-lucide="arrow-right" aria-hidden="true"></i>PRÓXIMA SESSÃO</h3><p>${text.next}</p></section>
        </div>
        <p class="dialog-info">Esta síntese foi gerada uma única vez a partir das anotações e do scoreboard registrados na finalização da revisão, e é preservada como registro da partida.</p>`);
  }

  function matchDetail(match) {
    const result = matchResult(match);
    const finalized = match.status === "finalized";
    const sent = Object.keys(match.recordings).length;
    const players = match.participants.map((name) => rosterPlayers.find((player) => player.name === name)).filter(Boolean);
    const body = finalized ? `<div class="scoreboards">
              <div class="scoreboard-legend"><span>PLACAR FINAL E ESTATÍSTICAS DOS PARTICIPANTES</span><span>K · D · A · <abbr title="Primeiros abates">FK</abbr> · SALDO</span></div>
              ${scoreboardTable("AZURE BEARS", "AZR", assets.azure, String(match.ours), "home", homeScoreboard.filter((row) => match.participants.includes(row.player)))}</div>`
      : `<div class="match-participants"><div class="scoreboard-legend"><span>PARTICIPANTES DA PARTIDA</span><span>${players.length} DE 5</span></div><div class="match-participants__list">${players.map((player) => `<span>${playerAvatar(player.name)}<strong>${player.name}</strong><small>${player.role} · ${match.recordings[player.name] ? "gravação enviada" : "sem gravação"}</small></span>`).join("")}</div><p class="dialog-info">O placar final e as estatísticas individuais são registrados na finalização da sessão de revisão.</p></div>`;
    const tab = ["recordings", "notes", "synthesis"].includes(prototypeState.matchTab) ? prototypeState.matchTab : "main";
    if (tab === "recordings") prototypeState.recordingMatch = match.id;
    return `<article class="match-detail" id="selected-match-detail" data-match-detail tabindex="-1">
            <div class="match-detail__navigation"><button class="module-secondary" type="button" data-proto-action="close-match">← VOLTAR À LISTAGEM</button></div>
            <header class="match-detail__hero">
              <img class="match-detail__backdrop" src="${match.map === "Ascent" ? assets.reviewMap : assets.haven}" alt="">
              <div class="match-detail__meta"><span class="match-status-badge">${matchStatusLabel[match.status]}</span><span>${match.type}${match.event ? ` · ${match.event.toLocaleUpperCase("pt-BR")}` : ""}</span><span>${matchDate(match.datetime, true)}</span></div>
              <div class="match-versus">
                <div class="match-versus__team"><img src="${assets.azure}" alt="AZURE BEARS"><strong>AZURE BEARS</strong><span>AZR</span></div>
                <div class="match-versus__score"><span>${match.map.toLocaleUpperCase("pt-BR")} · PLACAR FINAL</span><strong>${finalized ? `<em>${match.ours}</em><i>:</i><em>${match.theirs}</em>` : "<em>—</em><i>:</i><em>—</em>"}</strong><small>${result.label}</small></div>
                <div class="match-versus__team"><img src="${opponentLogos[match.opponent] || assets.shieldLogo}" alt="${match.opponent}"><strong>${match.opponent}</strong><span>${match.tag || ""}</span></div>
              </div>
            </header>
            <nav class="match-detail__tabs" role="tablist" aria-label="Detalhes da partida"><button class="${tab === "main" ? "is-active" : ""}" type="button" role="tab" aria-selected="${tab === "main"}" data-proto-action="match-tab" data-tab="main"><i data-lucide="${finalized ? "chart-no-axes-combined" : "users-round"}" aria-hidden="true"></i>${finalized ? "SCOREBOARD" : "PARTICIPANTES"}</button><button class="${tab === "recordings" ? "is-active" : ""}" type="button" role="tab" aria-selected="${tab === "recordings"}" data-proto-action="match-tab" data-tab="recordings"><i data-lucide="video" aria-hidden="true"></i>GRAVAÇÕES <span>${sent}</span></button><button class="${tab === "notes" ? "is-active" : ""}" type="button" role="tab" aria-selected="${tab === "notes"}" data-proto-action="match-tab" data-tab="notes"><i data-lucide="notebook-pen" aria-hidden="true"></i>ANOTAÇÕES <span>${prototypeState.notes.length}</span></button><button class="${tab === "synthesis" ? "is-active" : ""}" type="button" role="tab" aria-selected="${tab === "synthesis"}" data-proto-action="match-tab" data-tab="synthesis"><i data-lucide="sparkles" aria-hidden="true"></i>SÍNTESE${finalized && prototypeState.matchSynthesis && prototypeState.matchSynthesis[match.id] && prototypeState.matchSynthesis[match.id].status === "ready" ? '<b class="tab-dot" aria-label="Síntese gerada"></b>' : ""}</button><button type="button" data-route="${match.status === "waiting" ? (sent >= 2 ? "preparando" : "revisao") : "revisao"}"${match.status === "waiting" && !sent ? " disabled" : ""}><i data-lucide="play" aria-hidden="true"></i>SESSÃO <span>${match.status === "waiting" ? 0 : 1}</span></button></nav>
            ${tab === "recordings" ? recordingsPanel(match) : tab === "notes" ? matchNotesPanel(match) : tab === "synthesis" ? matchSynthesisPanel(match) : body}
            <footer class="match-detail__actions"><button class="module-secondary" type="button" data-route="nova-partida?editar=1">EDITAR PARTIDA</button>${finalized ? '<button class="module-secondary" type="button" data-route="scoreboard?correcao=1">CORRIGIR SCOREBOARD</button>' : ""}<button class="module-danger" type="button" data-proto-action="open-delete-match">EXCLUIR PARTIDA</button></footer>
          </article>`;
  }

  function matchesScreen() {
    const selected = findMatch(prototypeState.selectedMatch);
    const total = prototypeState.matches.length;
    return `<section class="dashboard-screen matches-screen" data-screen="partidas">
      ${dashboardHeader("matches")}
      <div class="dashboard-workspace dashboard-workspace--module">
        ${matchSidebar()}
        <main class="dashboard-main dashboard-main--module">
        <div class="matches-page">
        <section class="matches-toolbar" aria-label="Pesquisa de partidas"${selected ? " hidden" : ""}>
          <label class="matches-search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Buscar adversário, evento ou mapa" aria-label="Buscar adversário, evento ou mapa" data-match-search></label>
          <button class="module-primary" type="button" data-route="nova-partida">NOVA PARTIDA</button>
        </section>
        <div class="matches-layout">
          <aside class="match-catalog" aria-label="Lista de partidas" data-match-catalog${selected ? " hidden" : ""}>
            <div class="match-catalog__heading"><div><span>PARTIDAS</span><strong>${total} ${total === 1 ? "registro" : "registros"}</strong></div></div>
            <div class="match-catalog__list">${prototypeState.matches.map(matchCatalogCard).join("")}<p class="match-catalog__empty" data-match-empty hidden>Nenhuma partida encontrada.</p></div>
          </aside>
          ${selected ? matchDetail(selected) : ""}
        </div>
        <section class="matches-kpis" aria-label="Resumo das partidas">
          <article><span>TOTAL DE PARTIDAS</span><strong>18</strong><small>Registradas pela equipe</small></article>
          <article><span>VITÓRIAS</span><strong>12</strong><small>Partidas com revisão finalizada</small></article>
          <article><span>TAXA DE VITÓRIA</span><strong>66,7%</strong><small>12 vitórias · 6 derrotas · 0 empates</small></article>
          <article><span>SALDO DE RODADAS</span><strong>+34</strong><small>238 vencidas · 204 perdidas</small></article>
        </section>
        </div>
        </main>
        ${reviewPanel()}
      </div>
      ${selected ? `<dialog class="module-dialog confirm-dialog" data-delete-match-dialog><form method="dialog"><header><div><span class="module-label">EXCLUSÃO DEFINITIVA</span><h2>Excluir AZURE BEARS × ${selected.opponent}?</h2></div><button type="button" data-proto-action="close-delete-match" aria-label="Fechar">×</button></header><div class="dialog-fields"><p>A exclusão é definitiva e remove também os registros associados:</p><ul class="cascade-list"><li>participantes, scoreboard e estatísticas individuais</li><li>gravações e arquivos de vídeo armazenados</li><li>sessão de revisão, anotações e sínteses</li></ul><p class="dialog-info">Os indicadores da equipe e dos jogadores deixam de considerar esta partida.</p></div><footer><button class="module-secondary" type="button" data-proto-action="close-delete-match">CANCELAR</button><button class="module-danger" type="button" data-proto-action="confirm-delete-match">EXCLUIR PARTIDA</button></footer></form></dialog>` : ""}
      <div class="app-toast" role="status" aria-live="polite" data-toast></div>
    </section>`;
  }

  const rosterPlayers = [
    { name: "André", photo: playerPhotos["André"], fullName: "Pedro Almeida", riotId: "André#AZR", role: "CONTROLADOR", portrait: assets.agents.omen.portrait, icon: assets.agents.omen.icon, agent: "Omen", rating: "+3,2", matches: 18 },
    { name: "kick", photo: playerPhotos["kick"], fullName: "Carlos Silva", riotId: "kick#BR1", role: "DUELISTA", portrait: assets.agents.jett.portrait, icon: assets.agents.jett.icon, agent: "Jett", rating: "+5,1", matches: 18 },
    { name: "greinzera", photo: playerPhotos["greinzera"], fullName: "João Souza", riotId: "greinzera#0042", role: "INICIADOR", portrait: assets.agents.sova.portrait, icon: assets.agents.sova.icon, agent: "Sova", rating: "+0,8", matches: 18 },
    { name: "pim", photo: playerPhotos["pim"], fullName: "Isaias Santos", riotId: "pim#AZR", role: "SENTINELA", portrait: assets.agents.killjoy.portrait, icon: assets.agents.killjoy.icon, agent: "Killjoy", rating: "+2,4", matches: 18 },
    { name: "taek", photo: playerPhotos["taek"], fullName: "Ethan Oliveira", riotId: "taek#777", role: "CONTROLADOR", portrait: assets.agents.viper.portrait, icon: assets.agents.viper.icon, agent: "Viper", rating: "−1,3", matches: 18 },
    { name: "Kaue", photo: null, fullName: "Kauê Lima", riotId: "Kaue#AZR", role: "DUELISTA", portrait: assets.shieldLogo, icon: assets.shieldLogo, agent: "—", rating: "—", matches: 0 }
  ];

  // Riot IDs de jogadores de outras equipes (unicidade na aplicação, RN046)
  const otherTeamRiotIds = ["Leozin#AZB", "Nyx#CAAP", "Toti#UFU"];
  const riotIdPattern = /^[^#]{3,16}#[A-Za-z0-9]{3,5}$/;
  const selectedRosterPlayer = () => rosterPlayers.find((player) => player.name === prototypeState.selectedPlayer) || rosterPlayers[0];

  const playerMatchHistory = [
    { date: "28 MAR", opponent: "GREEN OWLS", logo: assets.greenOwls, result: "WIN", score: "13 — 8", agent: assets.agents.omen.icon, kda: "18 / 14 / 11", fk: 3, diff: "+4" },
    { date: "07 MAR", opponent: "A2E UFF", logo: assets.a2e, result: "WIN", score: "13 — 6", agent: assets.agents.omen.icon, kda: "17 / 13 / 12", fk: 2, diff: "+4" },
    { date: "28 FEV", opponent: "UFU SAINTS", logo: assets.ufu, result: "WIN", score: "13 — 10", agent: assets.agents.viper.icon, kda: "16 / 14 / 8", fk: 3, diff: "+2" },
    { date: "21 FEV", opponent: "WOLF GAMING", logo: assets.wolf, result: "LOSS", score: "9 — 13", agent: assets.agents.omen.icon, kda: "14 / 17 / 6", fk: 1, diff: "−3" },
    { date: "14 FEV", opponent: "CAAP HELLHOUNDS", logo: assets.caap, result: "WIN", score: "13 — 11", agent: assets.agents.viper.icon, kda: "21 / 15 / 9", fk: 4, diff: "+6" }
  ];

  function rosterItem(player, index) {
    const selected = player === selectedRosterPlayer();
    return `<button class="roster-item${selected ? " is-selected" : ""}" type="button" aria-label="${player.fullName}, ${player.role}" data-proto-action="select-player" data-player="${player.name}"${selected ? ' aria-current="true"' : ""}>
      <span class="roster-item__number">0${index + 1}</span>
      <span class="roster-item__avatar">${playerAvatar(player.name)}</span>
      <span class="roster-item__copy"><strong>${player.name}</strong><small>${player.role}</small></span>
      <span class="roster-item__rating"><small>SALDO</small><strong>${player.rating}</strong></span>
      <span aria-hidden="true"></span>
    </button>`;
  }

  function playerHistoryRows() {
    return playerMatchHistory.map((match) => `<tr>
      <td><span class="history-date">${match.date}<small>2026</small></span></td>
      <td><span class="history-opponent"><img src="${match.logo}" alt=""><strong>${match.opponent}</strong></span></td>
      <td><span class="history-result ${match.result === "WIN" ? "is-win" : "is-loss"}">${match.result === "WIN" ? "VITÓRIA" : "DERROTA"}<small>${match.score}</small></span></td>
      <td><img class="history-agent" src="${match.agent}" alt="Agente utilizado"></td>
      <td>${match.kda}</td><td>${match.fk}</td><td class="is-emphasis ${match.diff.startsWith("+") ? "is-positive" : "is-negative"}">${match.diff}</td>
    </tr>`).join("");
  }

  function dashboardHeader(active = "team", profile = active === "users" ? "admin" : "trainer") {
    const userName = getAuthenticatedUserName(profile);
    return `<header class="dashboard-header">
      <a class="dashboard-logo-slot" href="${profile === "admin" ? "#usuarios" : "#dashboard"}" aria-label="${profile === "admin" ? "Ir para a administração" : "Ir para o dashboard"}"><img src="${assets.brandLogo}" alt="VOD Review"></a>
      <div class="dashboard-header__spacer"></div>
      ${profile === "admin" ? "" : globalNavigation(active, profile)}
      <div class="dashboard-header__spacer dashboard-header__profile">
        <span class="dashboard-user-name">${userName}</span>
        <button class="dashboard-logout-button" type="button" data-logout data-profile="${profile}" aria-label="Sair da plataforma" title="Sair">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"></path>
            <path d="M14 16l4-4-4-4"></path>
            <path d="M18 12H9"></path>
          </svg>
        </button>
      </div>
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

  function sidebarRow(match) {
    const fin = match.status === "finalized";
    const oursMuted = fin && match.ours < match.theirs ? " is-muted" : "";
    const rivalMuted = fin && match.ours > match.theirs ? " is-muted" : "";
    return `<button type="button" class="match-row" data-proto-action="select-match" data-match="${match.id}" data-goto="partidas">
        <div class="match-row__meta"><span><strong>${matchDate(match.datetime).replace(" · ", "</strong> · ")}</span><span>${match.map}</span></div>
        <div class="match-row__team${oursMuted}"><span class="match-row__identity"><span class="match-logo"><img src="${assets.azure}" alt=""></span><span>AZURE BEARS</span></span><span class="match-row__score">${fin ? match.ours : "—"}</span></div>
        <div class="match-row__team${rivalMuted}"><span class="match-row__identity"><span class="match-logo"><img src="${opponentLogos[match.opponent] || assets.shieldLogo}" alt=""></span><span>${match.opponent}</span></span><span class="match-row__score">${fin ? match.theirs : "—"}</span></div>
        ${fin ? "" : '<small class="match-row__pending">SEM PLACAR · REVISÃO NÃO FINALIZADA</small>'}
      </button>`;
  }

  function matchSidebar() {
    const sorted = [...prototypeState.matches].filter((m) => !getHashParams().has("vazio") || m.status !== "finalized").sort((x, y) => y.datetime.localeCompare(x.datetime));
    const last = sorted[0];
    if (!last) return `<aside class="match-sidebar" aria-label="Histórico de partidas"><section class="panel-box recent-card"><h2 class="section-strip">RECENTE</h2><p class="review-notes__empty">Nenhuma partida cadastrada.</p></section></aside>`;
    const res = matchResult(last);
    return `<aside class="match-sidebar" aria-label="Histórico de partidas">
      <section class="latest-match">
        <div class="latest-match__title"><span>ÚLTIMA PARTIDA</span><strong class="is-${res.key.toLowerCase()}">${res.label}</strong></div>
        <div class="latest-match__hero">
          <img class="latest-match__map" src="${last.map === "Ascent" ? assets.reviewMap : assets.haven}" alt="Mapa ${last.map}">
          <div class="latest-match__versus">
            <img class="team-logo" src="${assets.azure}" alt="AZURE BEARS"><span>AZR</span><span class="score-chip">${last.status === "finalized" ? `${last.ours}-${last.theirs}` : "—"}</span><span>${last.tag || ""}</span><img class="team-logo" src="${opponentLogos[last.opponent] || assets.shieldLogo}" alt="${last.opponent}">
          </div>
        </div>
        <button class="latest-match__details" type="button" data-proto-action="select-match" data-match="${last.id}" data-goto="partidas">VER DETALHES</button>
      </section>
      <section class="panel-box recent-card">
        <h2 class="section-strip">RECENTE</h2>
        ${sorted.slice(0, 4).map(sidebarRow).join("")}
      </section>
    </aside>`;
  }

  function reviewPanel() {
    return `<aside class="agent-panel" aria-label="Painel de revisão">
      <button class="new-match-button" type="button" data-route="nova-partida">NOVA PARTIDA</button>
      <section class="review-card">
        <h2 class="review-card__title">REVISÃO EM ANDAMENTO</h2>
        <div class="review-match">
          <img src="${assets.reviewMap}" alt="Mapa da partida">
          <div class="review-match__copy"><p class="review-match__teams">AZURE BEARS<br>vs<br>WOLF GAMING</p><p class="review-match__time">Ascent · 21 MAR</p></div>
        </div>
        <div class="review-progress__label"><span>POVs enviados</span><span>4/5 POVs</span></div>
        <div class="review-progress__segments" aria-label="Quatro de cinco pontos de vista concluídos"><span class="is-done"></span><span class="is-done"></span><span class="is-done"></span><span class="is-done"></span><span></span></div>
        <button class="continue-review" type="button" data-route="revisao">CONTINUAR REVISÃO</button>
      </section>
      <h2 class="notes-heading">Anotações Recentes</h2>
      ${[...prototypeState.notes].sort((x, y) => y.id - x.id).slice(0, 3).map((n) => ({ target: n.target === "EQUIPE" ? "EQUIPE" : `JOGADOR · ${n.target}`, time: mmss(n.time), match: "VS WOLF GAMING · ASCENT", body: n.body })).map(noteCard).join("") || '<p class="review-notes__empty">Nenhuma anotação registrada.</p>'}
    </aside>`;
  }

  function matchPlayerCard(player, side) {
    const agentKey = player.agent.toLocaleLowerCase("pt-BR");
    const portrait = assets.agents[agentKey]?.portrait || player.icon;
    return `<article class="match-player-card match-player-card--${side}">
      <span class="match-player-card__portrait">${playerAvatar(player.player)}<i aria-hidden="true"></i></span>
      <div><strong>${player.player}</strong></div>
    </article>`;
  }

  function matchPlayersPanel() {
    return `<aside class="agent-panel match-players-panel" aria-label="Jogadores da partida selecionada">
      <header class="match-players-panel__heading"><span>PARTICIPANTES DA PARTIDA</span><strong>5 JOGADORES</strong></header>
      <section class="match-team-roster match-team-roster--home" aria-labelledby="roster-home-title">
        <header><img src="${assets.azure}" alt=""><span><strong id="roster-home-title">AZURE BEARS</strong><small>AZR · EQUIPE DO TREINADOR</small></span></header>
        <div>${homeScoreboard.map((player) => matchPlayerCard(player, "home")).join("")}</div>
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
      <div class="app-toast" role="status" aria-live="polite" data-toast></div>
    </section>`;
  }

  function playerEmptyCard(title, text) {
    return `<section class="module-card player-empty" data-player-empty><span class="module-label">${title}</span><p>${text}</p></section>`;
  }

  function playersScreen() {
    const player = selectedRosterPlayer();
    const hasData = Boolean(player && player.matches > 0);
    const ratingValue = hasData ? Number(player.rating.replace("−", "-").replace(",", ".")) : 0;
    const totalBalance = Math.round(ratingValue * player?.matches || 0);
    const signed = (value) => `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value)}`;
    const count = rosterPlayers.length;
    return dashboardShell({
      screen: "jogadores",
      activeSection: "players",
      mainClass: "dashboard-main--players",
      content: `<div class="players-layout">
          <aside class="roster-panel" aria-label="Elenco da equipe">
            <header class="roster-panel__heading"><div><span>ELENCO</span><strong data-roster-count>${count} ${count === 1 ? "JOGADOR" : "JOGADORES"}</strong></div><button type="button" aria-label="Adicionar jogador" data-proto-action="open-player-dialog" data-mode="new"></button></header>
            <div class="roster-list">${count ? rosterPlayers.map(rosterItem).join("") : '<p class="roster-empty">Nenhum jogador cadastrado.</p>'}</div>
            <div class="roster-panel__footer"><span><i></i> ELENCO DA EQUIPE</span><span>18 PARTIDAS CONSIDERADAS</span></div>
          </aside>
          <div class="individual-column">
            ${!player ? playerEmptyCard("ELENCO DA EQUIPE", "Nenhum jogador cadastrado. Utilize a opção “Adicionar jogador” para cadastrar o primeiro jogador da equipe.") : `<section class="individual-hero">
              <div class="individual-hero__backdrop" aria-hidden="true"></div>
              ${playerAvatar(player.name, "individual-hero__photo")}
              <div class="individual-hero__identity">
                <div class="individual-hero__status"><span></span> JOGADOR DA EQUIPE</div>
                <p>${player.role} · AZR</p>
                <h1 data-player-name>${player.name.toLocaleUpperCase("pt-BR")}</h1>
                <span class="individual-hero__name">${player.fullName} · ${player.riotId}</span>
                <div class="individual-hero__tags">${hasData ? `<span>MAIS USADO: ${player.agent.toLocaleUpperCase("pt-BR")}</span><span>${player.matches} PARTIDAS</span>` : "<span>SEM PARTIDAS CONSIDERADAS</span>"}</div>
              </div>
              <button class="individual-hero__edit" type="button" data-proto-action="open-player-dialog" data-mode="edit">EDITAR JOGADOR</button>
            </section>`}
            ${player && !hasData ? playerEmptyCard("DESEMPENHO DO JOGADOR", "Sem partidas consideradas. Os indicadores de desempenho são apresentados após a finalização da sessão de revisão de uma partida com a participação do jogador.") : ""}
            ${hasData ? `            <section class="individual-kpis" aria-label="Indicadores individuais">
              <article><span>MÉDIA K / D / A</span><strong>17,3</strong><small>14,1 mortes · 10,2 assist.</small></article>
              <article><span>PRIMEIROS ABATES</span><strong>2,6</strong><small>Média por partida</small></article>
              <article><span>SALDO TOTAL</span><strong>${signed(totalBalance)}</strong><small>K − D na temporada</small></article>
              <article><span>SALDO MÉDIO</span><strong>${player.rating}</strong><small class="${ratingValue >= 0 ? "is-positive" : "is-negative"}">Por partida</small></article>
            </section>
            <section class="individual-performance-card">
              <header class="component-heading"><div><span>ABATES POR PARTIDA</span><small>K · ÚLTIMAS 8 PARTIDAS</small></div><div class="performance-average"><small>MÉDIA</small><strong>17,3</strong></div></header>
              <div class="individual-trend" role="img" aria-label="Abates nas últimas oito partidas">
                <div class="individual-trend__scale"><span>25</span><span>20</span><span>15</span><span>10</span></div>
                <div class="individual-trend__grid"><span></span><span></span><span></span><span></span></div>
                <div class="individual-trend__bars">
                  ${[17, 19, 16, 21, 14, 16, 17, 18].map((value, index) => `<span style="--trend-height:${Math.max(28, (value - 8) * 7)}px"><i>${value}</i><small>${["24/01", "31/01", "07/02", "14/02", "21/02", "28/02", "07/03", "28/03"][index]}</small></span>`).join("")}
                </div>
                <div class="individual-trend__average"><span>MÉDIA 17,3</span></div>
              </div>
            </section>
            <section class="player-history-card">
              <header class="component-heading"><div><span>HISTÓRICO INDIVIDUAL</span><small>DESEMPENHO POR PARTIDA</small></div><button type="button" data-demo-link>VER TODAS</button></header>
              <div class="player-history-scroll" tabindex="0">
                <table class="player-history-table"><thead><tr><th>DATA</th><th>ADVERSÁRIO</th><th>RESULTADO</th><th>AGENTE</th><th>K / D / A</th><th>FK</th><th>SALDO</th></tr></thead><tbody>${playerHistoryRows()}</tbody></table>
              </div>
            </section>` : ""}
          </div>
          <aside class="player-insights" aria-label="Contexto de desempenho">${hasData ? `
            <section class="agent-pool-card">
              <header class="insight-heading"><div><span>POOL DE AGENTES</span><small>TEMPORADA 2026</small></div></header>
              <div class="agent-usage"><img src="${assets.agents.omen.icon}" alt="Omen"><div><span><strong>OMEN</strong><small>12 PARTIDAS</small></span><i><b style="width:67%"></b></i></div><em>67%</em></div>
              <div class="agent-usage"><img src="${assets.agents.viper.icon}" alt="Viper"><div><span><strong>VIPER</strong><small>5 PARTIDAS</small></span><i><b style="width:28%"></b></i></div><em>28%</em></div>
              <div class="agent-usage"><img src="${assets.agents.killjoy.icon}" alt="Killjoy"><div><span><strong>KILLJOY</strong><small>1 PARTIDA</small></span><i><b style="width:6%"></b></i></div><em>6%</em></div>
            </section>
            <section class="season-summary-card">
              <header class="insight-heading"><div><span>TOTAIS DO JOGADOR</span><small>18 PARTIDAS CONSIDERADAS</small></div></header>
              <dl><div><dt>Abates</dt><dd>312</dd></div><div><dt>Mortes</dt><dd>254</dd></div><div><dt>Assistências</dt><dd>184</dd></div><div><dt>Primeiros abates</dt><dd>47</dd></div></dl>
            </section>` : ""}
          </aside>
        </div>
        <dialog class="module-dialog" data-player-dialog><form method="dialog" data-player-form novalidate><header><div><span class="module-label">JOGADOR DA EQUIPE</span><h2 data-player-dialog-title>EDITAR JOGADOR</h2></div><button type="button" data-proto-action="close-player-dialog" aria-label="Fechar">×</button></header><div class="dialog-fields"><label class="logo-field"><span>FOTO</span><span class="logo-upload"><span class="module-secondary">SELECIONAR IMAGEM</span><small data-photo-name>PNG ou JPG · até 2 MB · opcional · sem foto, é exibida a inicial</small></span><input name="photo" type="file" accept="image/png,image/jpeg"></label><label><span>NICKNAME</span><input name="nickname" required maxlength="50" placeholder="Nome utilizado no jogo"></label><label><span>NOME COMPLETO</span><input name="fullName" required maxlength="150" placeholder="Nome completo do jogador"></label><label><span>RIOT ID</span><input name="riotId" required maxlength="22" placeholder="nome#tag"><small class="dialog-fields__hint">Nome de 3 a 16 caracteres e tag de 3 a 5 letras ou números.</small></label><label><span>FUNÇÃO PRINCIPAL</span><select name="role" required><option>CONTROLADOR</option><option>DUELISTA</option><option>INICIADOR</option><option>SENTINELA</option></select></label><p class="dialog-info dialog-info--consent">Ao cadastrar o jogador, o treinador declara ter obtido o consentimento dele para o registro destes dados e o uso de suas gravações nas revisões da equipe (LGPD).</p></div><footer><button class="module-danger" type="button" data-proto-action="open-remove-player" data-player-delete>EXCLUIR JOGADOR</button><button class="module-secondary" type="button" data-proto-action="close-player-dialog">CANCELAR</button><button class="module-primary" type="button" data-proto-action="save-player">SALVAR JOGADOR</button></footer></form></dialog>
        <dialog class="module-dialog confirm-dialog" data-remove-player-dialog><form method="dialog"><header><div><span class="module-label">EXCLUSÃO DE JOGADOR</span><h2>Excluir ${player ? player.name : ""}?</h2></div><button type="button" data-proto-action="close-remove-player" aria-label="Fechar">×</button></header><div class="dialog-fields">${hasData ? `<p>${player.name} possui <strong>${player.matches} participações</strong> registradas em partidas. Para preservar os resultados da equipe, a aplicação manterá o histórico sem identificar o jogador:</p><ul class="cascade-list"><li>nome completo e nickname substituídos por “Jogador removido 01”</li><li>Riot ID removido</li><li>gravações do jogador e arquivos de vídeo excluídos; nas sessões, o POV passa a indicar “Gravação removida”</li><li>participações, estatísticas e anotações preservadas</li></ul><p class="dialog-info">O jogador deixa o elenco e não poderá ser selecionado em novas partidas. Esta ação não pode ser desfeita.</p>` : `<p>${player ? player.name : ""} não possui participações registradas em partidas.</p><p class="dialog-info">A exclusão é definitiva: os dados do jogador serão removidos e não poderão ser recuperados.</p>`}</div><footer><button class="module-secondary" type="button" data-proto-action="close-remove-player">CANCELAR</button><button class="module-danger" type="button" data-proto-action="remove-player">EXCLUIR JOGADOR</button></footer></form></dialog>`
    });
  }

  function dashboardScreen() {
    const empty = getHashParams().has("vazio");
    const considered = players.filter((p) => (rosterPlayers.find((r) => r.name === p.name) || {}).matches > 0);
    return dashboardShell({
      screen: "dashboard",
      activeSection: "overview",
      content: empty ? `<section class="module-card player-empty"><span class="module-label">INDICADORES DA EQUIPE</span><p>Sem partidas consideradas. Os indicadores da equipe e dos jogadores são apresentados após a finalização da sessão de revisão da primeira partida.</p></section>` : `<section class="player-grid" aria-label="Jogadores">${considered.map(playerCard).join("")}</section>
        <section class="team-indicators" aria-label="Indicadores da equipe">
          <div class="matches-kpis team-indicators__kpis">
            <article><span>VITÓRIAS</span><strong>12</strong><small>18 partidas consideradas</small></article>
            <article><span>DERROTAS</span><strong>6</strong><small>0 empates</small></article>
            <article><span>TAXA DE VITÓRIA</span><strong>66,7%</strong><small>Vitórias ÷ partidas consideradas</small></article>
          </div>
          <div class="module-card team-maps"><header><span class="module-label">DESEMPENHO POR MAPA</span><small>Partidas com revisão finalizada</small></header><div class="module-table-scroll"><table class="module-table team-maps__table"><thead><tr><th>MAPA</th><th>PARTIDAS</th><th>VITÓRIAS</th><th>TAXA DE VITÓRIA</th></tr></thead><tbody>${[["Haven", 6, 5], ["Ascent", 4, 2], ["Lotus", 3, 2], ["Split", 3, 2], ["Bind", 2, 1]].map(([map, total, wins]) => `<tr><td><strong>${map}</strong></td><td>${total}</td><td>${wins}</td><td>${(wins / total * 100).toFixed(1).replace(".", ",")}%</td></tr>`).join("")}</tbody></table></div></div>
        </section>`
    });
  }

  const systemUsers = [
    { name: "Lucas Ferreira", username: "lucas.ferreira", email: "lucas@azurebears.gg", team: "AZURE BEARS", status: "ATIVO", access: "ONTEM · 21:18" },
    { name: "Rafael Nunes", username: "rafael.nunes", email: "rafael@azure.gg", team: "WOLF GAMING", status: "ATIVO", access: "23 SET · 18:05" },
    { name: "Bianca Alves", username: "bianca.alves", email: "bianca@caap.gg", team: "CAAP HELLHOUNDS", status: "INATIVO", access: "14 AGO · 11:30" },
    { name: "Paulo Mendes", username: "paulo.mendes", email: "paulo@unirv.gg", team: "", status: "ATIVO", access: "HOJE · 08:40" },
    { name: "Marina Costa", username: "marina.costa", email: "marina@unirv.gg", team: "", status: "INATIVO", access: "02 JUL · 09:12" }
  ];

  const brazilianStates = [
    ["AC", "Acre"],
    ["AL", "Alagoas"],
    ["AP", "Amapá"],
    ["AM", "Amazonas"],
    ["BA", "Bahia"],
    ["CE", "Ceará"],
    ["DF", "Distrito Federal"],
    ["ES", "Espírito Santo"],
    ["GO", "Goiás"],
    ["MA", "Maranhão"],
    ["MT", "Mato Grosso"],
    ["MS", "Mato Grosso do Sul"],
    ["MG", "Minas Gerais"],
    ["PA", "Pará"],
    ["PB", "Paraíba"],
    ["PR", "Paraná"],
    ["PE", "Pernambuco"],
    ["PI", "Piauí"],
    ["RJ", "Rio de Janeiro"],
    ["RN", "Rio Grande do Norte"],
    ["RS", "Rio Grande do Sul"],
    ["RO", "Rondônia"],
    ["RR", "Roraima"],
    ["SC", "Santa Catarina"],
    ["SP", "São Paulo"],
    ["SE", "Sergipe"],
    ["TO", "Tocantins"]
  ];
  const stateOptions = (selected = "") => `<option value=""${selected ? "" : " selected"}>Selecione o Estado</option>` + brazilianStates.map(([uf, name]) => `<option value="${uf}"${uf === selected ? " selected" : ""}>${name}</option>`).join("");
  const stateField = (selected = "", id = "") => `<div class="state-picker" data-state-picker>
      <select${id ? ` id="${id}"` : ""} name="state" required tabindex="-1" aria-hidden="true">${stateOptions(selected)}</select>
      <button type="button" class="state-picker__button" data-state-toggle aria-haspopup="listbox" aria-expanded="false"><span data-state-label></span><i aria-hidden="true">▾</i></button>
      <ul class="state-picker__list" role="listbox" hidden>${brazilianStates.map(([uf, name]) => `<li><button type="button" role="option" data-state-option="${uf}"><img src="assets/UF/${uf}.png" alt=""><span>${name}</span></button></li>`).join("")}</ul>
    </div>`;
  function syncStatePickers(root = document) {
    root.querySelectorAll("[data-state-picker]").forEach((picker) => {
      const select = picker.querySelector("select");
      const label = picker.querySelector("[data-state-label]");
      const found = brazilianStates.find(([uf]) => uf === select.value);
      label.innerHTML = found ? `<img src="assets/UF/${found[0]}.png" alt=""><span>${found[1]}</span>` : '<span class="is-placeholder">Selecione o Estado</span>';
      picker.querySelectorAll("[data-state-option]").forEach((option) => option.setAttribute("aria-selected", String(option.dataset.stateOption === select.value)));
    });
  }
  document.addEventListener("click", (event) => {
    const tToggle = event.target.closest("[data-team-toggle]");
    const tOption = event.target.closest("[data-team-option]");
    document.querySelectorAll(".team-picker__list").forEach((list) => { if (!tToggle || !list.parentElement.contains(tToggle)) { list.hidden = true; list.parentElement.querySelector("[data-team-toggle]").setAttribute("aria-expanded", "false"); } });
    if (tToggle) { const list = tToggle.parentElement.querySelector(".team-picker__list"); list.hidden = !list.hidden; tToggle.setAttribute("aria-expanded", String(!list.hidden)); }
    if (tOption) {
      const picker = tOption.closest("[data-team-picker]");
      const select = picker.querySelector("select");
      select.value = tOption.dataset.teamOption;
      select.setCustomValidity("");
      picker.querySelector(".team-picker__value").outerHTML = `<span class="team-picker__value">${tOption.innerHTML}</span>`;
      picker.querySelectorAll("[data-team-option]").forEach((o) => o.setAttribute("aria-selected", String(o === tOption)));
      picker.querySelector(".team-picker__list").hidden = true;
    }
  });
  document.addEventListener("change", (event) => {
    const free = event.target.closest("[data-opponent-free]");
    if (free) {
      const field = free.closest(".opponent-field");
      const picker = field.querySelector("[data-team-picker]");
      const input = field.querySelector(".opponent-free");
      picker.classList.toggle("is-hidden", free.checked);
      input.classList.toggle("is-hidden", !free.checked);
      picker.querySelector("select").required = !free.checked;
      input.required = free.checked;
      if (free.checked) input.focus();
    }
    const radio = event.target.closest(".map-card input, .segmented__item input");
    if (radio) {
      radio.closest(".map-cards, .segmented").querySelectorAll("label").forEach((l) => l.classList.toggle("is-selected", l.contains(radio)));
      if (radio.name === "map") { const out = document.querySelector("[data-map-selected]"); if (out) out.textContent = radio.value.toLocaleUpperCase("pt-BR"); }
    }
  });
  document.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-state-toggle]");
    const option = event.target.closest("[data-state-option]");
    document.querySelectorAll("[data-state-picker] .state-picker__list").forEach((list) => {
      if (!toggle || !list.closest("[data-state-picker]").contains(toggle)) { list.hidden = true; list.closest("[data-state-picker]").querySelector("[data-state-toggle]").setAttribute("aria-expanded", "false"); }
    });
    if (toggle) {
      const list = toggle.closest("[data-state-picker]").querySelector(".state-picker__list");
      list.hidden = !list.hidden;
      toggle.setAttribute("aria-expanded", String(!list.hidden));
      if (!list.hidden) list.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
    }
    if (option) {
      const picker = option.closest("[data-state-picker]");
      const select = picker.querySelector("select");
      select.value = option.dataset.stateOption;
      select.setCustomValidity("");
      syncStatePickers(picker.parentElement);
    }
  });

  const managedTeams = [
    { name: "AZURE BEARS", tag: "AZR", state: "GO", coach: "Lucas Ferreira", logo: assets.azure, players: 5, matches: 18 },
    { name: "WOLF GAMING", tag: "WLF", state: "SP", coach: "Rafael Nunes", logo: assets.wolf, players: 5, matches: 9 },
    { name: "CAAP HELLHOUNDS", tag: "CAAP", state: "MG", coach: "Bianca Alves", logo: assets.caap, players: 6, matches: 4 }
  ];

  const reviewSessions = [
    { status: "EM ANDAMENTO", tone: "progress", opponent: "WOLF GAMING", date: "21 MAR 2026", map: "ASCENT", progress: "4/5 POVs", action: "CONTINUAR", route: "revisao", logo: assets.wolf },
    { status: "FINALIZADA", tone: "done", opponent: "GREEN OWLS", date: "28 MAR 2026", map: "HAVEN", progress: "4/5 POVs", action: "CONSULTAR", route: "revisao?finalizada=1", logo: assets.greenOwls },
    { status: "SEM SESSÃO", tone: "pending", opponent: "CAAP HELLHOUNDS", date: "14 MAR 2026", map: "LOTUS", progress: "2/3 POVs", action: "ENVIAR GRAVAÇÕES", route: "gravacoes", logo: assets.caap },
    { status: "FINALIZADA", tone: "done", opponent: "A2E UFF", date: "07 MAR 2026", map: "SPLIT", progress: "5/5 POVs", action: "CONSULTAR", route: "revisao?finalizada=1", logo: assets.a2e },
    { status: "FINALIZADA", tone: "done", opponent: "UFU SAINTS", date: "28 FEV 2026", map: "BIND", progress: "5/5 POVs", action: "CONSULTAR", route: "revisao?finalizada=1", logo: assets.ufu }
  ];

  function moduleShell({ screen, activeNav, eyebrow, title, description, actions = "", showHeading = true, sidePanel = null, content }) {
    return `<section class="dashboard-screen module-screen" data-screen="${screen}">
      ${dashboardHeader(activeNav)}
      <div class="dashboard-workspace dashboard-workspace--module">
        ${matchSidebar()}
        <main class="dashboard-main dashboard-main--module">
        <div class="module-page">
        ${showHeading && actions ? `<div class="module-actionbar" aria-label="Ações da página">${actions}</div>` : ""}
        ${content}
        </div>
      </main>
        ${sidePanel === null ? reviewPanel() : sidePanel}
      </div>
      <div class="app-toast" role="status" aria-live="polite" data-toast></div>
    </section>`;
  }

  function focusShell({ screen, activeNav, content }) {
    return `<section class="dashboard-screen module-screen focus-screen" data-screen="${screen}">
      ${dashboardHeader(activeNav)}
      <main class="focus-main">${content}</main>
      <div class="app-toast" role="status" aria-live="polite" data-toast></div>
    </section>`;
  }

  // preparação automática: sincronização dos POVs em segundo plano (OCR), sem ação do treinador
  function preparingScreen() {
    const hold = getHashParams().has("parar");
    window.clearTimeout(window.__vodPrep);
    if (!hold) window.__vodPrep = window.setTimeout(() => {
      if (getRoute() !== "preparando") return;
      prototypeState.sync = syncScenario("validada");
      navigate("revisao");
    }, 6200);
    return focusShell({ screen: "preparando", activeNav: "reviews", content: `
      <section class="prep-screen" aria-busy="true">
        <div class="prep-loading" role="status" aria-live="polite">
          <span class="prep-loading__spinner" aria-hidden="true"></span>
          <p class="prep-loading__text">Sincronizando os pontos de vista…</p>
        </div>
      </section>` });
  }

  const adminSections = [
    { key: "equipes", label: "Equipes", icon: "shield", title: "EQUIPES", description: "Informações cadastrais de cada equipe e o treinador responsável por ela.", counter: "data-team-total" },
    { key: "treinadores", label: "Treinadores", icon: "user-round-cog", title: "TREINADORES", description: "Contas de acesso dos treinadores vinculados às equipes cadastradas.", counter: "data-user-total" }
  ];

  function getAdminSection() {
    const hashQuery = window.location.hash.includes("?") ? window.location.hash.split("?")[1] : "";
    const requested = new URLSearchParams(hashQuery).get("secao");
    return adminSections.some((section) => section.key === requested) ? requested : "equipes";
  }

  function adminSidebar(active) {
    return `<aside class="admin-sidebar" aria-label="Navegação administrativa">
      <span class="admin-sidebar__label">ADMINISTRAÇÃO</span>
      <nav class="admin-sidebar__nav">
        ${adminSections.map((section) => `<a class="admin-sidebar__item${section.key === active ? " is-active" : ""}" href="#usuarios?secao=${section.key}"${section.key === active ? ' aria-current="page"' : ""}><i data-lucide="${section.icon}" aria-hidden="true"></i><span>${section.label}</span>${section.counter ? `<b ${section.counter}>${section.key === "equipes" ? managedTeams.length : systemUsers.length}</b>` : ""}</a>`).join("")}
      </nav>
    </aside>`;
  }

  function adminPanel(section, active, actions, content) {
    return `<section class="admin-panel" data-admin-panel="${section.key}" aria-labelledby="admin-title-${section.key}"${section.key === active ? "" : " hidden"}>
      <header class="admin-panel__header">
        <div>
          <span class="admin-panel__breadcrumb">ADMINISTRAÇÃO <i aria-hidden="true">/</i> ${section.label.toLocaleUpperCase("pt-BR")}</span>
          <h1 id="admin-title-${section.key}">${section.title}</h1>
          <p>${section.description}</p>
        </div>
        <div class="admin-panel__actions">${actions}</div>
      </header>
      ${content}
    </section>`;
  }

  function adminShell({ active, panels, dialogs }) {
    return `<section class="dashboard-screen module-screen admin-screen" data-screen="usuarios">
      ${dashboardHeader("users", "admin")}
      <div class="admin-layout">
        ${adminSidebar(active)}
        <main class="admin-page">${panels}</main>
      </div>
      ${dialogs}
      <div class="app-toast" role="status" aria-live="polite" data-toast></div>
    </section>`;
  }

  function userRow(user, index) {
    return `<tr data-user-row data-user-index="${index}">
      <td><span class="user-identity"><span>${user.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><span><strong>${user.name}</strong><small>${user.email}</small></span></span></td>
      <td><span class="user-team"><strong>${user.team || "SEM EQUIPE"}</strong><small>${user.team ? "TREINADOR RESPONSÁVEL" : "ATRIBUIÇÃO EM EQUIPES"}</small></span></td>
      <td><span class="status-badge status-badge--${user.status === "ATIVO" ? "success" : "muted"}" data-user-status>${user.status}</span></td>
      <td>${user.access}</td>
      <td class="module-table__actions"><button type="button" data-edit-user="${index}" aria-label="Editar treinador" title="Editar treinador"></button><button type="button" data-toggle-user aria-label="${user.status === "ATIVO" ? "Desativar" : "Ativar"} treinador" title="${user.status === "ATIVO" ? "Desativar" : "Ativar"} treinador"></button></td>
    </tr>`;
  }

  function userRows() {
    return systemUsers.map(userRow).join("");
  }

  function teamStatus(team) {
    const coach = systemUsers.find((user) => user.name === team.coach);
    return coach && coach.status === "ATIVO" ? "ATIVA" : "SEM ACESSO";
  }

  function teamRow(team, index) {
    const isActive = teamStatus(team) === "ATIVA";
    return `<tr data-team-row data-team-index="${index}"><td><span class="managed-team"><img src="${team.logo}" alt=""><span><strong>${team.name}</strong><small>${team.tag}</small></span></span></td><td>${team.state}</td><td><span class="user-team"><strong>${team.coach}</strong><small>${isActive ? "TREINADOR ATIVO" : "TREINADOR DESATIVADO"}</small></span></td><td><span class="status-badge status-badge--${isActive ? "success" : "pending"}">${teamStatus(team)}</span></td><td class="module-table__actions"><button type="button" data-edit-team="${index}" aria-label="Editar equipe" title="Editar equipe"></button><button type="button" data-delete-team="${index}" aria-label="Excluir equipe" title="Excluir equipe"></button></td></tr>`;
  }

  function teamRows() {
    return managedTeams.map(teamRow).join("");
  }

  function adminStats() {
    const active = systemUsers.filter((user) => user.status === "ATIVO").length;
    const percent = systemUsers.length ? Math.round((active / systemUsers.length) * 100) : 0;
    return `<section class="module-stats" aria-label="Resumo administrativo"><article><span>EQUIPES CADASTRADAS</span><strong data-team-total>${managedTeams.length}</strong><small>Ativas e cadastros pendentes</small></article><article><span>TREINADORES</span><strong data-user-total>${systemUsers.length}</strong><small>Contas vinculadas a equipes</small></article><article><span>ACESSOS ATIVOS</span><strong data-user-active>${active}</strong><small data-user-active-detail>${percent}% dos treinadores</small></article></section>`;
  }

  function adminAttentionItems() {
    const items = [
      ...managedTeams.filter((team) => teamStatus(team) !== "ATIVA").map((team) => ({ tone: "pending", title: team.name, detail: "Treinador responsável desativado", section: "equipes" })),
      ...systemUsers.filter((user) => user.status !== "ATIVO").map((user) => ({ tone: "muted", title: user.name, detail: `Conta desativada · ${user.team}`, section: "treinadores" })),
      ...systemUsers.filter((user) => user.status === "ATIVO" && user.access === "AINDA NÃO ACESSOU").map((user) => ({ tone: "progress", title: user.name, detail: "Conta criada, aguardando o primeiro acesso", section: "treinadores" }))
    ];
    if (!items.length) return '<p class="admin-empty">Nenhuma pendência no momento. Todas as equipes possuem treinador ativo.</p>';
    return `<ul class="admin-list">${items.map((item) => `<li><span class="admin-list__dot admin-list__dot--${item.tone}" aria-hidden="true"></span><span class="admin-list__text"><strong>${item.title}</strong><small>${item.detail}</small></span><a class="admin-list__link" href="#usuarios?secao=${item.section}">VER</a></li>`).join("")}</ul>`;
  }

  function adminLinkItems() {
    return `<ul class="admin-list">${managedTeams.map((team) => `<li><img src="${team.logo}" alt=""><span class="admin-list__text"><strong>${team.name}</strong><small>${team.coach}</small></span><span class="status-badge status-badge--${teamStatus(team) === "ATIVA" ? "success" : "pending"}">${teamStatus(team)}</span></li>`).join("")}</ul>`;
  }

  function adminTableCard({ label, hint, search, head, body, empty }) {
    return `<section class="module-card admin-management-card">
      <div class="module-toolbar"><div><span class="module-label">${label}</span><small>${hint}</small></div><label class="module-search"><span aria-hidden="true">⌕</span><input type="search" data-admin-search placeholder="${search}" aria-label="${search}"></label></div>
      <div class="module-table-scroll"><table class="module-table"><thead><tr>${head.map((title) => `<th>${title}</th>`).join("")}</tr></thead>${body}</table></div>
      <p class="admin-empty admin-empty--search" data-admin-search-empty hidden>${empty}</p>
    </section>`;
  }

  function coachOptions(currentCoach = "") {
    const available = systemUsers.filter((user) => (user.status === "ATIVO" && !user.team) || user.name === currentCoach);
    if (!available.length) return '<option value="">Não há treinadores ativos sem equipe</option>';
    return `<option value=""${currentCoach ? "" : " selected"}>Selecione o treinador</option>` + available.map((user) => `<option${user.name === currentCoach ? " selected" : ""}>${user.name}</option>`).join("");
  }

  function usersScreen() {
    const active = getAdminSection();
    const [teams, coaches] = adminSections;
    const newTeamButton = '<button class="module-secondary" type="button" data-open-team-dialog>NOVA EQUIPE</button>';
    const newUserButton = '<button class="module-primary" type="button" data-open-user-dialog>NOVO TREINADOR</button>';
    const panels = [
      adminPanel(teams, active, newTeamButton.replace("module-secondary", "module-primary"), adminTableCard({
        label: "EQUIPES CADASTRADAS",
        hint: "Informações cadastrais e treinador responsável",
        search: "Buscar equipe, tag ou treinador",
        head: ["EQUIPE", "ESTADO", "TREINADOR", "STATUS", "AÇÕES"],
        body: `<tbody data-teams-body>${teamRows()}</tbody>`,
        empty: "Nenhuma equipe encontrada."
      })),
      adminPanel(coaches, active, newUserButton, adminTableCard({
        label: "CONTAS DE TREINADORES",
        hint: "O administrador não possui acesso aos dados competitivos destas equipes",
        search: "Buscar treinador ou equipe",
        head: ["TREINADOR", "EQUIPE VINCULADA", "STATUS", "ÚLTIMO ACESSO", "AÇÕES"],
        body: `<tbody data-users-body>${userRows()}</tbody>`,
        empty: "Nenhum treinador encontrado."
      }))
    ].join("");
    const dialogs = `<dialog class="module-dialog" data-team-dialog><form method="dialog" data-team-form novalidate><header><div><span class="module-label">CADASTRO ADMINISTRATIVO</span><h2 data-team-dialog-title>NOVA EQUIPE</h2></div><button type="button" data-close-team-dialog aria-label="Fechar">×</button></header><div class="dialog-fields"><label><span>NOME DA EQUIPE</span><input name="name" required placeholder="Nome da equipe"></label><label><span>TAG / SIGLA</span><input name="tag" required maxlength="4" placeholder="TAG"></label><label><span>ESTADO</span>${stateField()}</label><label class="logo-field"><span>LOGO</span><span class="logo-upload"><span class="module-secondary">SELECIONAR IMAGEM</span><small data-logo-name>PNG ou JPG · até 2 MB · opcional</small></span><input name="logo" type="file" accept="image/png,image/jpeg"></label><label><span>TREINADOR RESPONSÁVEL</span><select name="coach" required>${coachOptions()}</select></label></div><footer><button class="module-secondary" type="button" data-close-team-dialog>CANCELAR</button><button class="module-primary" type="submit">SALVAR EQUIPE</button></footer></form></dialog>
      <dialog class="module-dialog" data-user-dialog><form method="dialog" data-user-form><header><div><span class="module-label">CONTA DE TREINADOR</span><h2 data-user-dialog-title>NOVO TREINADOR</h2></div><button type="button" data-close-user-dialog aria-label="Fechar">×</button></header><div class="dialog-fields"><label><span>NOME COMPLETO</span><input name="name" required placeholder="Nome do treinador"></label><label><span>NOME DE USUÁRIO</span><input name="username" required placeholder="nome.sobrenome" autocomplete="off"></label><label><span>E-MAIL</span><input name="email" type="email" required placeholder="treinador@equipe.gg"></label><div class="dialog-fields__pair" data-password-fields><label><span>SENHA INICIAL</span><input name="password" type="password" autocomplete="new-password" placeholder="Senha inicial"></label><label><span>CONFIRMAR SENHA</span><input name="passwordConfirm" type="password" autocomplete="new-password" placeholder="Repita a senha"></label><p class="dialog-fields__hint dialog-fields__hint--policy">Mínimo de 8 caracteres, com letras e números.</p><p class="dialog-fields__hint" data-password-hint hidden>Deixe em branco para manter a senha atual.</p></div><p class="dialog-info">A equipe do treinador é atribuída no cadastro de equipes.</p></div><footer><button class="module-secondary" type="button" data-close-user-dialog>CANCELAR</button><button class="module-primary" type="submit" data-user-submit>SALVAR TREINADOR</button></footer></form></dialog>
        <dialog class="module-dialog confirm-dialog" data-confirm-dialog aria-labelledby="confirm-dialog-title"><div class="confirm-dialog__body"><span class="module-label" data-confirm-eyebrow></span><h2 id="confirm-dialog-title" data-confirm-title></h2><p data-confirm-message></p><dl class="confirm-dialog__details" data-confirm-details></dl></div><footer><button class="module-secondary" type="button" data-confirm-cancel>CANCELAR</button><button class="module-primary" type="button" data-confirm-ok>CONFIRMAR</button></footer></dialog>`;
    return adminShell({ active, panels, dialogs });
  }

  function reviewsScreen() {
    return moduleShell({
      screen: "revisoes",
      activeNav: "reviews",
      showHeading: false,
      content: `<section class="module-stats" aria-label="Resumo das revisões"><article><span>EM ANDAMENTO</span><strong>1</strong><small>Sessões não finalizadas</small></article><article><span>FINALIZADAS</span><strong>12</strong><small>Temporada 2026</small></article><article><span>SEM SESSÃO</span><strong>1</strong><small>Partida sem gravações enviadas</small></article></section>
        <section class="review-session-list" aria-label="Sessões de revisão">${reviewSessions.map((session) => `<article class="review-session-card"><div class="review-session-card__status"><span class="status-badge status-badge--${session.tone}">${session.status}</span><small>${session.date}</small></div><div class="review-session-card__match"><img src="${assets.azure}" alt="AZURE BEARS"><span><small>AZURE BEARS</small><strong>VS</strong></span><img src="${session.logo}" alt="${session.opponent}"><span><strong>${session.opponent}</strong><small>${session.map}</small></span></div><div class="review-session-card__progress"><span>${session.progress}</span><i><b style="width:${Number(session.progress[0]) * 20}%"></b></i></div><button class="module-secondary" type="button" data-route="${session.route}">${session.action}</button></article>`).join("")}</section>`
    });
  }

  function flowSteps(current, labels, hints = []) {
    const pct = labels.length > 1 ? ((Math.min(current, labels.length) - 1) / (labels.length - 1)) * 100 : 0;
    return `<nav class="wizard-steps" aria-label="Etapas do cadastro" style="--wizard-progress:${pct}%">
      <div class="wizard-steps__track" aria-hidden="true"><i></i></div>
      <ol>${labels.map((label, index) => {
        const n = index + 1;
        const state = n === current ? "is-current" : n < current ? "is-done" : "";
        return `<li class="${state}"${n === current ? ' aria-current="step"' : ""}><span class="wizard-steps__dot">${n < current ? "✓" : n}</span><span class="wizard-steps__text"><small>ETAPA ${n} DE ${labels.length}</small><strong>${label}</strong>${hints[index] ? `<em>${hints[index]}</em>` : ""}</span></li>`;
      }).join("")}</ol>
    </nav>`;
  }

  // equipes cadastradas que podem ser adversárias (exclui a própria equipe)
  const opponentTeams = () => managedTeams.filter((team) => team.name !== "AZURE BEARS");
  function opponentPicker(draft) {
    const teams = opponentTeams();
    const free = draft.freeOpponent || !teams.length;
    const current = teams.find((t) => t.name === draft.opponent);
    const esc = (v) => String(v || "").replace(/"/g, "&quot;");
    return `<div class="opponent-field">
      <div class="team-picker${free ? " is-hidden" : ""}" data-team-picker>
        <select name="opponentTeam" tabindex="-1" aria-hidden="true"${free ? "" : " required"}><option value="">Selecione o adversário</option>${teams.map((t) => `<option value="${t.name}"${current && current.name === t.name ? " selected" : ""}>${t.name}</option>`).join("")}</select>
        <button type="button" class="team-picker__button" data-team-toggle aria-haspopup="listbox" aria-expanded="false">${current ? `<span class="team-picker__value"><img src="${current.logo}" alt=""><span><strong>${current.name}</strong><small>${current.tag} · ${current.state}</small></span></span>` : '<span class="team-picker__value is-placeholder">Selecione o adversário</span>'}<i aria-hidden="true">▾</i></button>
        <ul class="team-picker__list" role="listbox" hidden>${teams.map((t) => `<li><button type="button" role="option" data-team-option="${t.name}" aria-selected="${Boolean(current && current.name === t.name)}"><img src="${t.logo}" alt=""><span><strong>${t.name}</strong><small>${t.tag} · ${t.state}</small></span></button></li>`).join("")}</ul>
      </div>
      <input class="opponent-free${free ? "" : " is-hidden"}" name="opponent" maxlength="100" value="${free ? esc(draft.opponent) : ""}" placeholder="Nome da equipe adversária"${free ? " required" : ""}>
      <label class="check-pill"><input type="checkbox" data-opponent-free${free ? " checked" : ""}${teams.length ? "" : " disabled"}><span class="check-pill__box" aria-hidden="true"></span><span>Não registrada?<small>${teams.length ? "Marque para informar uma equipe que não está cadastrada na plataforma." : "Nenhuma equipe cadastrada: informe o nome do adversário."}</small></span></label>
    </div>`;
  }
  function mapCards(selected) {
    return `<div class="map-cards" role="radiogroup" aria-label="Mapa da partida">${mapOptions.map((m) => `<label class="map-card${m === selected ? " is-selected" : ""}"><input type="radio" name="map" value="${m}"${m === selected ? " checked" : ""}><span class="map-card__media"><img src="${mapImages[m]}" alt="" onerror="this.remove()"></span><span class="map-card__shade" aria-hidden="true"></span><span class="map-card__check" aria-hidden="true">✓</span><strong>${m.toLocaleUpperCase("pt-BR")}</strong></label>`).join("")}</div>`;
  }
  function typeChips(selected) {
    return `<div class="segmented" role="radiogroup" aria-label="Tipo da partida">${[["CAMPEONATO", "Oficial"], ["AMISTOSO", "Entre equipes"], ["TREINO", "Interno"]].map(([t, h]) => `<label class="segmented__item${t === selected ? " is-selected" : ""}"><input type="radio" name="type" value="${t}"${t === selected ? " checked" : ""}><strong>${t.charAt(0) + t.slice(1).toLocaleLowerCase("pt-BR")}</strong><small>${h}</small></label>`).join("")}</div>`;
  }

  function initMatchDraft() {
    const editing = getHashParams().has("editar") && findMatch(prototypeState.selectedMatch);
    const match = editing ? findMatch(prototypeState.selectedMatch) : null;
    prototypeState.matchStep = 1;
    prototypeState.matchDraft = match
      ? { mode: "edit", id: match.id, opponent: match.opponent, event: match.event, datetime: match.datetime, type: match.type, map: match.map, status: match.status, freeOpponent: !managedTeams.some((t) => t.name === match.opponent) }
      : { mode: "new", id: null, opponent: "", event: "", datetime: "", type: "CAMPEONATO", map: "Haven", status: "waiting", freeOpponent: false };
    prototypeState.participants = new Set(match ? match.participants : []);
  }

  function newMatchScreen() {
    const step = prototypeState.matchStep;
    const draft = prototypeState.matchDraft;
    const editing = draft.mode === "edit";
    const locked = editing && draft.status !== "waiting";
    const selected = rosterPlayers.filter((player) => prototypeState.participants.has(player.name));
    const esc = (v) => String(v || "").replace(/"/g, "&quot;");
    const content = step === 1 ? `
      <form class="match-form" data-match-form novalidate>
        <section class="module-card match-form__section"><header class="match-form__head"><span class="match-form__index">01</span><div><span class="module-label">ADVERSÁRIO E CONTEXTO</span><strong>Contra quem a equipe jogou?</strong></div></header>
          <div class="match-form__grid">
            <div class="field-block is-wide"><span class="field-block__label">ADVERSÁRIO <b>*</b></span>${opponentPicker(draft)}</div>
            <label class="field-block"><span class="field-block__label">EVENTO / COMPETIÇÃO</span><input name="event" maxlength="100" value="${esc(draft.event)}" placeholder="Ex.: VPL 2026 · Semana 3"><small class="field-block__hint">Opcional</small></label>
            <label class="field-block"><span class="field-block__label">DATA E HORA <b>*</b></span><input name="datetime" type="datetime-local" required value="${esc(draft.datetime)}"><small class="field-block__hint">Não pode ser posterior ao momento atual</small></label>
            <div class="field-block is-wide"><span class="field-block__label">TIPO <b>*</b></span>${typeChips(draft.type)}</div>
          </div>
        </section>
        <section class="module-card match-form__section"><header class="match-form__head"><span class="match-form__index">02</span><div><span class="module-label">MAPA</span><strong>Em qual mapa a partida foi disputada?</strong></div><span class="match-form__selected" data-map-selected>${draft.map.toLocaleUpperCase("pt-BR")}</span></header>${mapCards(draft.map)}</section>
      </form>${locked ? '<p class="dialog-info">A sessão de revisão desta partida já foi criada. Os dados da partida podem ser alterados; os participantes ficam somente para consulta.</p>' : ""}` : step === 2 ? `
      <section class="module-card participant-picker"><header><div><span class="module-label">PARTICIPANTES DA EQUIPE</span><strong>${selected.length} de 5 jogadores selecionados</strong><small>Somente jogadores do elenco da AZURE BEARS podem participar.</small></div><span class="status-badge status-badge--${selected.length ? "success" : "pending"}">${locked ? "SOMENTE CONSULTA" : selected.length ? "SELEÇÃO VÁLIDA" : "SELECIONE AO MENOS 1"}</span></header><div class="participant-picker__list">${rosterPlayers.map((player) => { const checked = prototypeState.participants.has(player.name); return `<button type="button" class="participant-option${checked ? " is-selected" : ""}" data-proto-action="toggle-participant" data-player="${player.name}" aria-pressed="${checked}"${locked ? " disabled" : ""}>${playerAvatar(player.name)}<span><strong>${player.name}</strong><small>${player.role}</small></span><i>${checked ? "✓" : "+"}</i></button>`; }).join("")}</div>${locked ? '<p class="dialog-info">Os participantes não podem ser alterados porque a sessão de revisão desta partida já foi criada.</p>' : editing ? '<p class="dialog-info">Remover um participante exclui a gravação enviada para ele.</p>' : ""}</section>` : step === 3 ? `
      <section class="module-card readiness-card"><span class="module-label">CONFIRMAÇÃO</span><h2>${editing ? "Salvar as alterações da partida?" : "Cadastrar a partida?"}</h2><dl class="confirm-dialog__details match-summary"><dt>Adversário</dt><dd>${esc(draft.opponent)}</dd><dt>Evento</dt><dd>${esc(draft.event) || "—"}</dd><dt>Data e hora</dt><dd>${matchDate(draft.datetime, true)}</dd><dt>Tipo</dt><dd>${draft.type}</dd><dt>Mapa</dt><dd>${draft.map}</dd><dt>Participantes</dt><dd>${selected.map((p) => p.name).join(", ")}</dd></dl><p>${editing ? (locked ? "Os indicadores da equipe e dos jogadores serão recalculados com os dados alterados." : "As gravações e as estatísticas dos participantes mantidos são preservadas.") : "A partida será apresentada como <strong>aguardando gravações</strong>. O placar final é registrado na finalização da revisão."}</p></section>` : `
      <section class="module-card match-created"><span>✓</span><h2>${editing ? "PARTIDA ALTERADA" : "PARTIDA CADASTRADA"}</h2><p>${esc(draft.opponent)} · ${draft.map} · ${selected.length} participante(s). ${editing ? "" : "O próximo passo é enviar as gravações de cada participante."}</p><div><button class="module-secondary" type="button" data-route="partidas">VER PARTIDAS</button><button class="module-primary" type="button" data-proto-action="open-recordings" data-match="${draft.id}">${editing ? "GRAVAÇÕES" : "ENVIAR GRAVAÇÕES"}</button></div></section>`;
    return moduleShell({ screen: "nova-partida", activeNav: "matches", eyebrow: editing ? "PARTIDAS · ALTERAÇÃO" : "PARTIDAS · NOVO REGISTRO", title: editing ? "EDITAR PARTIDA" : "NOVA PARTIDA", description: "", actions: step < 4 ? '<button class="module-secondary" type="button" data-route="partidas">CANCELAR</button>' : "", content: `${flowSteps(step, ["Dados da partida", "Participantes", "Confirmação", "Concluído"], ["Adversário, data, tipo e mapa", "De 1 a 5 jogadores", "Revise as informações", editing ? "Partida alterada" : "Partida cadastrada"])}${content}${step < 4 ? `<footer class="flow-actions"><button class="module-secondary" type="button" data-proto-action="match-back" ${step === 1 ? "disabled" : ""}>VOLTAR</button><button class="module-primary" type="button" data-proto-action="match-next" ${step === 2 && !selected.length ? "disabled" : ""}>${step === 3 ? (editing ? "SALVAR ALTERAÇÕES" : "CADASTRAR PARTIDA") : "CONTINUAR"}</button></footer>` : ""}` });
  }

  function scoreboardDialog() {
    const match = findMatch("m2");
    const agents = ["Jett", "Omen", "Killjoy", "Sova", "Viper"];
    const rows = homeScoreboard.slice(0, 5).map((player, index) => {
      const missing = prototypeState.scoreboardState === "incomplete" && index === 4;
      return `<div class="score-entry__row${missing ? " is-missing" : ""}" data-score-row="${player.player}"><span>${playerAvatar(player.player)}<b class="score-entry__name">${player.player}</b><select aria-label="Agente de ${player.player}" data-score-agent>${missing ? '<option selected>Selecione</option>' : ""}${agents.map((agent) => `<option${!missing && agent === player.agent ? " selected" : ""}>${agent}</option>`).join("")}</select></span><input value="${missing ? "" : player.k}" placeholder="—" inputmode="numeric" aria-label="Abates de ${player.player}" data-score-stat><input value="${missing ? "" : player.d}" placeholder="—" inputmode="numeric" aria-label="Mortes de ${player.player}" data-score-stat><input value="${missing ? "" : player.a}" placeholder="—" inputmode="numeric" aria-label="Assistências de ${player.player}" data-score-stat><input value="${missing ? "" : player.fk}" placeholder="—" inputmode="numeric" aria-label="Primeiros abates de ${player.player}" data-score-stat><b data-score-diff>${missing ? "—" : player.diff}</b><span class="status-badge status-badge--${missing ? "pending" : "success"}" data-score-status>${missing ? "PENDENTE" : "COMPLETO"}</span></div>`;
    }).join("");
    return `<dialog class="module-dialog scoreboard-dialog" data-scoreboard-dialog aria-labelledby="scoreboard-dialog-title"><form method="dialog" novalidate>
      <header><div><span class="module-label">FINALIZAR REVISÃO · ETAPA FINAL</span><h2 id="scoreboard-dialog-title">Registre o scoreboard da partida</h2><p>Informe o placar e as estatísticas de cada participante. Ao concluir, a revisão é finalizada e as anotações ficam somente para consulta.</p></div><button type="button" data-proto-action="close-scoreboard-dialog" aria-label="Fechar">×</button></header>
      <div class="scoreboard-dialog__final"><div class="scoreboard-dialog__team"><img src="${assets.azure}" alt=""><strong>AZURE BEARS</strong></div><div class="scoreboard-dialog__score"><input value="9" inputmode="numeric" aria-label="Rodadas vencidas pela AZURE BEARS" data-score-final><span>:</span><input value="13" inputmode="numeric" aria-label="Rodadas vencidas pelo adversário" data-score-final><small>${match.map.toLocaleUpperCase("pt-BR")} · PLACAR FINAL</small></div><div class="scoreboard-dialog__team"><img src="${opponentLogos[match.opponent] || assets.shieldLogo}" alt=""><strong>${match.opponent}</strong></div></div>
      <div class="score-entry__table"><div class="score-entry__head"><span>PARTICIPANTE / AGENTE</span><span>K</span><span>D</span><span>A</span><span>FK</span><span>SALDO</span><span>SITUAÇÃO</span></div>${rows}</div>
      <p class="scoreboard-dialog__hint" data-score-hint>Valores inteiros iguais ou maiores que zero. O saldo (K − D) é calculado automaticamente.</p>
      <footer><button class="module-secondary" type="button" data-proto-action="close-scoreboard-dialog">CONTINUAR REVISANDO</button><button class="module-primary" type="button" data-proto-action="finalize-with-scoreboard">SALVAR E FINALIZAR</button></footer>
    </form></dialog>`;
  }

  function scoreboardScreen() {
    const correction = getHashParams().has("correcao");
    const match = findMatch(correction ? "m1" : "m2");
    const complete = correction || prototypeState.scoreboardState !== "incomplete";
    const corrected = prototypeState.scoreboardState === "corrected";
    const agents = ["Jett", "Omen", "Killjoy", "Sova", "Viper"];
    const invalid = prototypeState.scoreboardInvalid || [];
    const rows = homeScoreboard.slice(0, 5).map((player, index) => {
      const missing = !complete && index === 4;
      const bad = invalid.includes(player.player);
      return `<div class="score-entry__row ${missing || bad ? "is-missing" : ""}" data-score-row="${player.player}"><span><img src="${player.icon}" alt="">${player.player}<select aria-label="Agente de ${player.player}" data-score-agent>${missing ? '<option selected>Selecione</option>' : ""}${agents.map((agent) => `<option${!missing && agent === player.agent ? " selected" : ""}>${agent}</option>`).join("")}</select></span><input value="${missing ? "" : player.k}" placeholder="—" inputmode="numeric" aria-label="Abates de ${player.player}" data-score-stat><input value="${missing ? "" : player.d}" placeholder="—" inputmode="numeric" aria-label="Mortes de ${player.player}" data-score-stat><input value="${missing ? "" : player.a}" placeholder="—" inputmode="numeric" aria-label="Assistências de ${player.player}" data-score-stat><input value="${missing ? "" : player.fk}" placeholder="—" inputmode="numeric" aria-label="Primeiros abates de ${player.player}" data-score-stat><b>${missing ? "—" : player.diff}</b><span class="status-badge status-badge--${missing || bad ? "pending" : "success"}">${bad ? "INVÁLIDO" : missing ? "PENDENTE" : "COMPLETO"}</span></div>`;
    }).join("");
    const ours = correction ? match.ours : 9;
    const theirs = correction ? match.theirs : 13;
    return moduleShell({ screen: "scoreboard", activeNav: correction ? "matches" : "reviews", eyebrow: `PARTIDA · AZURE BEARS VS ${match.opponent}`, title: correction ? "CORRIGIR SCOREBOARD" : "REGISTRAR SCOREBOARD", description: "", actions: correction ? '<button class="module-secondary" type="button" data-route="partidas">VOLTAR À PARTIDA</button>' : '<button class="module-secondary" type="button" data-route="revisao">VOLTAR À REVISÃO</button>', content: `
      ${correction ? "" : `<section class="state-switcher" aria-label="Cenários de demonstração"><span>CENÁRIO VISUAL</span><button data-proto-action="score-state" data-state="incomplete" class="${!complete ? "is-active" : ""}">INCOMPLETO</button><button data-proto-action="score-state" data-state="complete" class="${complete && !corrected ? "is-active" : ""}">COMPLETO</button></section>`}
      <section class="score-entry module-card"><header><div><span class="module-label">PLACAR FINAL · RODADAS · ${match.map.toLocaleUpperCase("pt-BR")}</span><strong class="score-entry__final">AZURE BEARS <input value="${ours}" inputmode="numeric" aria-label="Rodadas vencidas pela AZURE BEARS" data-score-final> — <input value="${theirs}" inputmode="numeric" aria-label="Rodadas vencidas pelo adversário" data-score-final> ${match.opponent}</strong></div><span class="status-badge status-badge--${complete && !invalid.length ? "success" : "pending"}">${correction ? "SESSÃO FINALIZADA" : complete && !invalid.length ? "COMPLETO" : "INCOMPLETO"}</span></header><div class="score-entry__table"><div class="score-entry__head"><span>PARTICIPANTE / AGENTE</span><span>K</span><span>D</span><span>A</span><span>FK</span><span>SALDO</span><span>SITUAÇÃO</span></div>${rows}</div><footer><p class="dialog-info">Para cada participante, informe o agente e as quantidades de abates (K), mortes (D), assistências (A) e primeiros abates (FK), como números inteiros iguais ou maiores que zero. O saldo (K − D) é calculado automaticamente.</p><button class="module-primary" type="button" data-proto-action="save-scoreboard" data-mode="${correction ? "correction" : "register"}">${correction ? "SALVAR CORREÇÃO" : "SALVAR SCOREBOARD"}</button></footer></section>
      ${corrected && correction ? '<section class="recalculation-banner"><strong>SCOREBOARD CORRIGIDO</strong><span>Os indicadores da equipe e dos jogadores passam a considerar os valores corrigidos. As sínteses já geradas são preservadas.</span></section>' : ""}` });
  }

  function traceabilityScreen() {
    const groups = [
      ["Acesso e gestão", "RF001–RF004", "RN001, RN016–RN018", "Login, gestão administrativa, perfil da equipe e elenco"],
      ["Partidas e desempenho", "RF005–RF007", "RN002–RN003, RN010–RN014, RN027, RN029, RN033–RN034", "Wizard de partida, scoreboard, exclusão e painéis"],
      ["POVs e revisão", "RF008–RF012", "RN004–RN009, RN019–RN026, RN028, RN030", "Gravações, sincronização, timeline, anotações e conclusão"],
      ["Síntese", "RF013", "RN015, RN031–RN032", "Versões preservadas e base da síntese"]
    ];
    return moduleShell({ screen: "rastreabilidade", activeNav: "reviews", eyebrow: "DOCUMENTAÇÃO DO PROTÓTIPO", title: "MATRIZ DE RASTREABILIDADE", description: "Mapa visual dos requisitos funcionais e regras de negócio cobertos pelos fluxos de demonstração.", actions: '<button class="module-secondary" type="button" data-route="dashboard">VOLTAR AO PAINEL</button>', content: `<section class="traceability-grid">${groups.map((group, index) => `<article class="traceability-card"><span>0${index + 1}</span><h2>${group[0]}</h2><p><strong>${group[1]}</strong><small>${group[2]}</small></p><em>${group[3]}</em><i>COBERTURA VISUAL</i></article>`).join("")}</section><p class="module-notice"><strong>Escopo:</strong> cada item é representado por estado, aviso, checklist ou bloqueio visual. Não há validação sistêmica, persistência ou processamento real.</p>` });
  }

  function recordingsPanel(match) {
    const finalized = match.status === "finalized";
    const locked = match.status !== "waiting";
    const players = match.participants.map((name) => rosterPlayers.find((player) => player.name === name)).filter(Boolean);
    const sent = players.filter((player) => match.recordings[player.name]).length;
    const errors = prototypeState.recordingErrors || {};
    const card = (player) => {
      const rec = match.recordings[player.name];
      const error = errors[player.name];
      const uploading = rec && rec.progress !== undefined;
      const status = error ? ["pending", "RECUSADO"] : uploading ? ["progress", `ENVIANDO ${rec.progress}%`] : rec ? ["success", "ENVIADA"] : ["pending", "PENDENTE"];
      return `<article class="recording-card${rec && !error ? "" : " is-pending"}" data-recording-card data-player="${player.name}"><header>${playerAvatar(player.name)}<span><strong>${player.name}</strong><small>${player.role} · participante da partida</small></span><span class="status-badge status-badge--${status[0]}">${status[1]}</span></header>
        <div class="recording-card__file"><span aria-hidden="true">${rec && !error ? "▶" : "!"}</span><div><strong>${error ? error.file : rec ? rec.file : "Nenhuma gravação enviada"}</strong><small>${error ? error.message : uploading ? "Envio em andamento" : rec ? `${rec.size.toFixed(1).replace(".", ",")} GB · ${rec.duration} · MP4 (H.264)` : "MP4 (H.264) · até 2 GB"}</small>${uploading ? `<i class="recording-progress"><b style="width:${rec.progress}%"></b></i>` : ""}</div></div>
        <footer>${rec && !error ? "" : `<label class="module-secondary recording-upload${locked || uploading ? " is-disabled" : ""}"><input type="file" accept="video/mp4" data-recording-pick data-player="${player.name}"${locked || uploading ? " disabled" : ""}>SELECIONAR ARQUIVO</label>`}<button type="button" data-remove-recording data-proto-action="open-remove-recording" data-player="${player.name}" ${!rec || locked || uploading ? "disabled" : ""}>REMOVER</button></footer></article>`;
    };
    const next = sent >= 2 ? "preparando" : "revisao";
    return `<div class="recordings-panel"><div class="recordings-panel__head"><div><span class="module-label">GRAVAÇÕES DOS PARTICIPANTES</span><strong>${sent} de ${players.length} enviadas</strong></div>${locked ? "" : `<button class="module-primary" type="button" data-route="${next}" ${sent ? "" : "disabled"}>INICIAR REVISÃO</button>`}</div>
        <div class="recordings-panel__bar" aria-hidden="true"><i style="width:${players.length ? sent / players.length * 100 : 0}%"></i></div>
        <section class="recording-grid" aria-label="Gravações dos participantes">${players.map(card).join("")}</section>
        ${finalized ? '<p class="dialog-info">A sessão de revisão desta partida está finalizada: as gravações estão disponíveis somente para consulta.</p>' : locked ? '<p class="dialog-info">A sessão de revisão desta partida já foi criada: os participantes e as gravações não podem mais ser alterados. As gravações ficam disponíveis para a sincronização e a revisão.</p>' : '<p class="dialog-info">Envie uma gravação principal por participante, em MP4 (H.264) de até 2 GB. Para trocar um arquivo, remova a gravação e envie outra. Ao iniciar a revisão, a plataforma sincroniza os POVs automaticamente, cria a sessão e bloqueia os participantes e as gravações.</p>'}
        <dialog class="module-dialog confirm-dialog" data-recording-dialog><form method="dialog"><header><div><span class="module-label" data-recording-dialog-label></span><h2 data-recording-dialog-title></h2></div><button type="button" data-proto-action="close-recording-dialog" aria-label="Fechar">×</button></header><div class="dialog-fields" data-recording-dialog-body></div><footer><button class="module-secondary" type="button" data-proto-action="close-recording-dialog">CANCELAR</button><button class="module-danger" type="button" data-proto-action="confirm-recording-dialog" data-recording-dialog-ok></button></footer></form></dialog></div>`;
  }

  function recordingsScreen() {
    const match = findMatch(prototypeState.recordingMatch) || prototypeState.matches[0];
    prototypeState.selectedMatch = match.id;
    prototypeState.matchTab = "recordings";
    prototypeState.keepMatch = true;
    window.setTimeout(() => navigate("partidas"), 0);
    return "";
  }

  // RF009 · sincronização dos POVs em linha do tempo (estilo editor de vídeo)
  const SYNC_TRUTH = { André: 0, kick: 12.4, pim: -8.0, greinzera: 31.6 };          // deslocamentos reais (demonstração)
  const SYNC_MARK = { André: 42.0, kick: 29.6, pim: 50.0, greinzera: 10.4 };        // início do round 1 em cada vídeo (s)
  const SYNC_DUR = { André: 2538, kick: 2332, pim: 2410, greinzera: 2290 };
  const SYNC_POV = { André: 0, kick: 1, greinzera: 2, pim: 3 };
  function syncScenario(kind) {
    const names = ["André", "kick", "pim", "greinzera"];
    const base = { reference: "André", names, playhead: 75, window: 180, selected: "kick", edited: false };
    if (kind === "pendente") return { ...base, status: "pending", offsets: Object.fromEntries(names.map((n) => [n, 0])), detected: {} };
    if (kind === "falha") return { ...base, status: "failed", offsets: { André: 0, kick: 12.4, pim: -8.0, greinzera: 0 }, detected: { André: true, kick: true, pim: true } };
    return { ...base, status: "validated", offsets: { ...SYNC_TRUTH }, detected: { André: true, kick: true, pim: true, greinzera: true } };
  }
  prototypeState.sync = syncScenario("validada");
  // RF011 · anotações da sessão (instante em segundos na referência temporal)
  const REVIEW_PARTICIPANTS = ["kick", "André", "pim", "greinzera", "taek"];
  prototypeState.notes = [
    { id: 1, target: "EQUIPE", time: 198, body: "Manter dupla em crossfire e guardar a Viper Pit para o segundo contato." },
    { id: 2, target: "André", time: 451, body: "Evitar compra fragmentada. Priorizar entrada da Jett com flash coordenada." },
    { id: 3, target: "kick", time: 762, body: "Rotação tardia após o contato. Revisar o utilitário do Sova no retake." }
  ];
  const mmss = (v) => `${String(Math.floor(v / 60)).padStart(2, "0")}:${String(Math.round(v) % 60).padStart(2, "0")}`;
  const noteTargetLabel = (t) => t === "EQUIPE" ? "EQUIPE · AZURE BEARS" : `JOGADOR · ${t}`;
  function noteItems(readonly) {
    const notes = [...prototypeState.notes].sort((a, b) => a.time - b.time);
    if (!notes.length) return '<p class="review-notes__empty">Nenhuma anotação registrada.</p>';
    return notes.map((n) => `<article data-review-note data-note-id="${n.id}"><div><span>${noteTargetLabel(n.target)}</span><button type="button" class="note-time" data-note-jump="${n.time}" title="Ir para o instante">${mmss(n.time)}</button></div><p>${n.body.replace(/</g, "&lt;")}</p>${readonly ? "" : `<footer><button type="button" data-edit-note data-note-id="${n.id}">EDITAR</button><button type="button" data-delete-note data-note-id="${n.id}">EXCLUIR</button></footer>`}</article>`).join("");
  }
  function noteMarkers() {
    return prototypeState.notes.map((n) => `<button class="review-timeline__event" style="left:${(n.time / 2538 * 100).toFixed(2)}%" type="button" data-timeline-marker="${n.time}" aria-label="Ir para a anotação em ${mmss(n.time)}"><span>${mmss(n.time)}</span></button>`).join("");
  }
  const fmtSec = (v, signed = false) => {
    const sign = v < 0 ? "−" : signed ? "+" : "";
    const a = Math.abs(v);
    const m = Math.floor(a / 60);
    const sec = (a - m * 60).toFixed(1).replace(".", ",");
    return `${sign}${String(m).padStart(2, "0")}:${sec.padStart(4, "0")}`;
  };
  const syncStatusLabel = { pending: ["pending", "PENDENTE"], processing: ["progress", "PROCESSANDO"], proposed: ["progress", "PROPOSTA"], validated: ["success", "VALIDADA"], failed: ["pending", "FALHA NA DETECÇÃO"] };

  function syncPreview(sync) {
    return sync.names.map((name) => {
      const player = rosterPlayers.find((p) => p.name === name);
      const local = sync.playhead - sync.offsets[name];
      const has = local >= 0 && local <= SYNC_DUR[name];
      return `<figure class="sync-preview__item${has ? "" : " is-empty"}"><img src="${assets.povs[SYNC_POV[name]]}" alt=""><figcaption><strong>${name}${name === sync.reference ? " · REF." : ""}</strong><span>${has ? fmtSec(local) : "SEM CONTEÚDO"}</span></figcaption></figure>`;
    }).join("");
  }

  function synchronizationScreen() {
    const scenario = getHashParams().get("cenario");
    if (scenario && prototypeState.syncScenarioApplied !== scenario) { prototypeState.sync = syncScenario(scenario); prototypeState.syncScenarioApplied = scenario; }
    const sync = prototypeState.sync;
    const win = sync.window;
    const pct = (t) => (t / win) * 100;
    const [badgeKind, badgeText] = syncStatusLabel[sync.status];
    const ticks = Array.from({ length: 7 }, (_, i) => Math.round((win / 6) * i));
    const tracks = sync.names.map((name) => {
      const player = rosterPlayers.find((p) => p.name === name);
      const off = sync.offsets[name];
      const isRef = name === sync.reference;
      const mark = sync.detected[name] ? off + SYNC_MARK[name] : null;
      const left = pct(off);
      const width = pct(SYNC_DUR[name]);
      return `<div class="sync-track${sync.selected === name ? " is-selected" : ""}" data-sync-track="${name}">
        <div class="sync-track__label">${playerAvatar(name)}<span><strong>${name}</strong><small>${isRef ? "REFERÊNCIA" : `${fmtSec(off, true)}`}</small></span></div>
        <div class="sync-track__lane" data-sync-lane>
          <div class="sync-clip${isRef ? " is-reference" : ""}" style="left:${left}%;width:${width}%" data-sync-clip="${name}" ${isRef ? "" : 'tabindex="0" role="slider" aria-label="Deslocamento de ' + name + '"'}>
            <span class="sync-clip__name">${name.toUpperCase()} · ${isRef ? "FIXA" : "ARRASTE PARA AJUSTAR"}</span>
          </div>
          ${mark !== null ? `<i class="sync-mark" style="left:${pct(mark)}%" title="Início do round 1 detectado"></i>` : `<em class="sync-nomark">${sync.status === "pending" || sync.status === "processing" ? "NÃO ANALISADA" : "MARCO NÃO IDENTIFICADO"}</em>`}
        </div></div>`;
    }).join("");
    const canValidate = ["proposed", "failed"].includes(sync.status) && (sync.status !== "failed" || sync.edited);
    return moduleShell({
      screen: "sincronizacao",
      activeNav: "reviews",
      eyebrow: "PARTIDA · AZURE BEARS VS WOLF GAMING · ASCENT",
      title: "SINCRONIZAÇÃO DE POVs",
      description: "",
      actions: `<button class="module-secondary" type="button" data-route="gravacoes">VOLTAR ÀS GRAVAÇÕES</button>${sync.status === "validated" ? '<button class="module-primary" type="button" data-route="revisao">IR PARA A REVISÃO</button>' : `<button class="module-primary" type="button" data-proto-action="sync-validate" ${canValidate ? "" : "disabled"}>VALIDAR SINCRONIZAÇÃO</button>`}`,
      content: `<section class="sync-overview"><div><span class="module-label">GRAVAÇÃO DE REFERÊNCIA</span><label><select data-sync-reference aria-label="Gravação de referência"${sync.status === "validated" && prototypeState.notes.length ? " disabled" : ""}>${sync.names.map((n) => `<option${n === sync.reference ? " selected" : ""}>${n}</option>`).join("")}</select></label><small class="sync-reference-hint">${sync.status === "validated" && prototypeState.notes.length ? "A referência não pode ser trocada porque a sessão já possui anotações." : "A referência fica fixa na posição zero. Trocá-la reinicia a sincronização."}</small></div><div><span class="module-label">SITUAÇÃO DA SINCRONIZAÇÃO</span><strong><span class="status-badge status-badge--${badgeKind}" data-sync-badge>${badgeText}</span></strong><small>${sync.status === "failed" ? "O OCR não identificou o marco de uma ou mais gravações. Ajuste-as manualmente na linha do tempo." : sync.status === "validated" ? "Correspondência conferida e validada pelo treinador." : sync.status === "proposed" ? "Confira a pré-visualização e valide, ou ajuste as gravações arrastando-as." : "Detecte automaticamente ou posicione as gravações manualmente."}</small></div><button class="module-secondary" type="button" data-proto-action="sync-auto" ${sync.status === "processing" ? "disabled" : ""}>DETECTAR AUTOMATICAMENTE</button></section>
        <section class="module-card sync-editor" aria-label="Linha do tempo de sincronização">
          <header class="sync-editor__head"><div><span class="module-label">LINHA DO TEMPO DA REFERÊNCIA</span><small>Arraste cada gravação até que o marco do round 1 (linha verde) fique alinhado. Ajuste fino: teclas ← → (0,1 s) ou Shift + ← → (1 s).</small></div>
            <div class="sync-zoom" aria-label="Zoom da linha do tempo">${[[60, "1 MIN"], [180, "3 MIN"], [600, "10 MIN"]].map(([w, l]) => `<button type="button" data-proto-action="sync-zoom" data-window="${w}" class="${w === win ? "is-active" : ""}">${l}</button>`).join("")}</div></header>
          <div class="sync-ruler" data-sync-ruler><div class="sync-track__label"></div><div class="sync-ruler__scale">${ticks.map((t) => `<span style="left:${pct(t)}%">${fmtSec(t).replace(",0", "")}</span>`).join("")}</div></div>
          <div class="sync-tracks" data-sync-tracks>${tracks}<i class="sync-playhead" style="--ph:${pct(sync.playhead)}" data-sync-playhead><b>${fmtSec(sync.playhead)}</b></i></div>
          <footer class="sync-fine"><span>SELECIONADA: <strong>${sync.selected}</strong> · ${fmtSec(sync.offsets[sync.selected], true)}</span><div>${[-1, -0.1, 0.1, 1].map((d) => `<button type="button" data-proto-action="sync-nudge" data-delta="${d}" ${sync.selected === sync.reference ? "disabled" : ""}>${d > 0 ? "+" : "−"}${String(Math.abs(d)).replace(".", ",")} s</button>`).join("")}</div></footer>
        </section>
        <section class="module-card sync-preview" aria-label="Pré-visualização dos POVs"><header><span class="module-label">PRÉ-VISUALIZAÇÃO NO INSTANTE ${fmtSec(sync.playhead)}</span><small>Clique na régua para escolher o instante e compare os POVs lado a lado.</small></header><div class="sync-preview__grid">${syncPreview(sync)}</div></section>
        <dialog class="module-dialog confirm-dialog" data-sync-dialog><form method="dialog"><header><div><span class="module-label">VALIDAÇÃO DA SINCRONIZAÇÃO</span><h2>Validar a correspondência temporal?</h2></div><button type="button" data-proto-action="sync-dialog-close" aria-label="Fechar">×</button></header><div class="dialog-fields"><dl class="confirm-dialog__details match-summary">${sync.names.map((n) => `<dt>${n}</dt><dd>${n === sync.reference ? "Referência (00:00,0)" : fmtSec(sync.offsets[n], true)}</dd>`).join("")}</dl><p class="dialog-info">Após a validação, a reprodução sincronizada e o registro de anotações são liberados.</p></div><footer><button class="module-secondary" type="button" data-proto-action="sync-dialog-close">CANCELAR</button><button class="module-primary" type="button" data-proto-action="sync-confirm">VALIDAR</button></footer></form></dialog>`
    });
  }

  const reviewPovSlotsFor = () => [
    ...["André", "kick", "greinzera", "pim"].map((name) => {
      const player = rosterPlayers.find((p) => p.name === name);
      const offset = prototypeState.sync.offsets[name] - prototypeState.sync.offsets[prototypeState.sync.reference];
      return { ...player, povImage: assets.povs[SYNC_POV[name]], povStart: Math.max(0, Math.round(offset)) };
    }),
    null
  ];

  function reviewPovViewer(activeIndex = 0) {
    const reviewPovSlots = reviewPovSlotsFor();
    const activePlayer = reviewPovSlots[activeIndex]?.povImage ? reviewPovSlots[activeIndex] : reviewPovSlots.find((player) => player?.povImage);
    if (!activePlayer) return "";
    const activePlayerIndex = reviewPovSlots.indexOf(activePlayer);
    const single = getHashParams().has("unico");
    const thumbnailIndexes = single ? [] : reviewPovSlots.map((_, index) => index).filter((index) => index !== activePlayerIndex);
    return `<article class="pov-main" data-active-pov-index="${activePlayerIndex}" aria-label="POV principal de ${activePlayer.name}">
        <img src="${activePlayer.povImage}" alt="POV simulado de ${activePlayer.name}">
        <span class="pov-main__shade" aria-hidden="true"></span>
        <span class="pov-main__status"><i></i> ${single ? "GRAVAÇÃO ÚNICA · REFERÊNCIA TEMPORAL" : "POV PRINCIPAL · SINCRONIZADO"}</span>
        <span class="pov-main__identity"><strong>${activePlayer.name}</strong><small>${activePlayer.role} · ${activePlayer.agent}</small></span>
        <span class="pov-time pov-main__time" data-pov-offset="0">${formatInitialPovTime(762)}</span>
      </article>
      ${single ? "" : `<div class="pov-thumbnails" aria-label="Demais posições de POV">
        ${thumbnailIndexes.map((index) => {
          const player = reviewPovSlots[index];
          if (!player?.povImage) return `<button class="pov-thumbnail is-empty" type="button" disabled aria-label="POV ${index + 1} indisponível">
            <span class="pov-thumbnail__empty" aria-hidden="true">?</span><span><strong>TAEK · SEM GRAVAÇÃO</strong><small>PARTICIPANTE SEM POV ENVIADO</small></span>
          </button>`;
          return `<button class="pov-thumbnail" type="button" data-select-pov="${index}" data-pov-start="${player.povStart || 0}" aria-label="Exibir POV de ${player.name} no frame principal">
            <img src="${player.povImage}" alt=""><span class="pov-thumbnail__shade" aria-hidden="true"></span><span class="pov-no-content" aria-hidden="true"><strong>SEM CONTEÚDO NESTE INSTANTE</strong><small>A gravação começa em ${formatInitialPovTime(player.povStart || 0)}</small></span>
            <span class="pov-thumbnail__identity"><strong>${player.name}</strong><small>${player.agent}</small></span>
            <span class="pov-time pov-thumbnail__time" data-pov-offset="0">${formatInitialPovTime(762)}</span>
          </button>`;
        }).join("")}
      </div>`}`;
  }

  function formatInitialPovTime(seconds) {
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }

  function getHashParams() {
    const hashQuery = window.location.hash.includes("?") ? window.location.hash.split("?")[1] : "";
    return new URLSearchParams(hashQuery);
  }

  function reviewScreen() {
    const finalized = getHashParams().has("finalizada") || prototypeState.reviewReady;
    const sync = prototypeState.sync;
    const single = getHashParams().has("unico");
    const locked = false;
    const audioName = "ANDRÉ";
    return focusShell({
      screen: "revisao",
      activeNav: "reviews",
      content: `<header class="review-topbar"><button class="review-topbar__back" type="button" data-proto-action="select-match" data-match="m2" data-goto="partidas" aria-label="Voltar à partida">←</button><div class="review-topbar__match"><img src="${assets.azure}" alt=""><div><span class="module-label">${finalized ? "REVISÃO FINALIZADA" : "REVISÃO EM ANDAMENTO"}</span><strong>AZURE BEARS <em>×</em> WOLF GAMING</strong><small>ASCENT · 21 MAR 2026 · ${single ? "1 POV" : "4 POVs SINCRONIZADOS"}</small></div><img src="${assets.wolf}" alt=""></div><div class="review-topbar__actions">${finalized ? '<button class="module-primary" type="button" data-open-synthesis data-route="sintese">GERAR SÍNTESE</button>' : '<button class="module-primary" type="button" data-finalize-review>FINALIZAR REVISÃO</button><button class="module-primary is-hidden" type="button" data-open-synthesis data-route="sintese">GERAR SÍNTESE</button>'}</div></header>
      <div class="review-workspace"><section class="pov-stage${locked ? " is-locked" : ""}"><div class="pov-viewer" data-pov-viewer aria-label="Visualizador de cinco posições Multi-POV">${locked ? `<div class="pov-locked"><span class="status-badge status-badge--pending">SINCRONIZAÇÃO ${sync.status === "proposed" ? "NÃO VALIDADA" : "PENDENTE"}</span><h2>Reprodução sincronizada indisponível</h2><p>Com duas ou mais gravações, a correspondência temporal precisa ser conferida e validada antes da reprodução e do registro de anotações.</p><button class="module-primary" type="button" data-route="sincronizacao">SINCRONIZAR POVs</button></div>` : reviewPovViewer()}</div>
        <div class="review-player" data-review-player style="--timeline-progress:30.02%">
          <div class="review-timeline">
            <div class="review-timeline__track">
              ${noteMarkers()}
              <span class="review-timeline__playhead" aria-hidden="true"><output data-time-tooltip>12:42</output></span>
              <input type="range" min="0" max="2538" value="762" step="1" data-review-timeline aria-label="Linha do tempo comum dos POVs">
            </div>
          </div>
          <div class="playback-bar">
            <div class="playback-transport" aria-label="Controles de reprodução">
              <button class="playback-control is-primary" type="button" data-playback aria-label="Reproduzir" title="Reproduzir ou pausar"><span aria-hidden="true">▶</span></button>
              <button class="playback-control" type="button" data-review-step="-10" aria-label="Voltar 10 segundos" title="Voltar 10 segundos"><span aria-hidden="true">↺</span><small>10s</small></button>

            </div>
            <div class="playback-time" aria-label="Tempo da reprodução"><strong data-current-time>12:42</strong><span>/</span><span data-total-time>42:18</span></div>
            <div class="playback-speeds" aria-label="Velocidade da reprodução">
              <button class="is-active" type="button" data-playback-speed="1" aria-pressed="true">1x</button><button type="button" data-playback-speed="2">2x</button><button type="button" data-playback-speed="4">4x</button>
            </div>
          </div>
        </div></section>
          <aside class="review-notes${finalized ? " is-readonly" : ""}"><header><div><span class="module-label">ANOTAÇÕES DA SESSÃO</span><strong data-note-count>${prototypeState.notes.length} ${prototypeState.notes.length === 1 ? "REGISTRO" : "REGISTROS"}</strong></div><span class="status-badge status-badge--progress" data-review-current-time>12:42</span></header>${finalized ? '<p class="review-notes__locked" data-notes-locked>Sessão finalizada: as anotações estão disponíveis somente para consulta.</p>' : locked ? '<p class="review-notes__locked">Registro de anotações indisponível até a validação da sincronização.</p>' : ""}<form data-note-form novalidate${finalized || locked ? " hidden" : ""}><label><span>VINCULAR A</span><select name="target"><option value="EQUIPE">EQUIPE · AZURE BEARS</option>${REVIEW_PARTICIPANTS.map((name) => `<option value="${name}">JOGADOR · ${name}</option>`).join("")}</select></label><label><span>OBSERVAÇÃO <small data-note-counter>0/500</small></span><textarea name="body" required maxlength="500" placeholder="Registre o ponto observado neste instante..."></textarea></label><button class="module-primary" type="submit">ADICIONAR EM <span data-note-time-label>12:42</span></button></form><div class="review-note-list" data-review-note-list>${noteItems(finalized || locked)}</div></aside></div>
        <dialog class="module-dialog" data-note-dialog><form method="dialog" data-note-edit-form novalidate><header><div><span class="module-label">ANOTAÇÃO · INSTANTE <span data-note-edit-time></span></span><h2>EDITAR ANOTAÇÃO</h2></div><button type="button" data-proto-action="note-dialog-close" aria-label="Fechar">×</button></header><div class="dialog-fields"><label><span>VINCULAR A</span><select name="target"><option value="EQUIPE">EQUIPE · AZURE BEARS</option>${REVIEW_PARTICIPANTS.map((name) => `<option value="${name}">JOGADOR · ${name}</option>`).join("")}</select></label><label><span>OBSERVAÇÃO</span><textarea name="body" required maxlength="500"></textarea></label><p class="dialog-info">O instante da anotação na linha do tempo é mantido.</p></div><footer><button class="module-secondary" type="button" data-proto-action="note-dialog-close">CANCELAR</button><button class="module-primary" type="button" data-proto-action="note-save">SALVAR ANOTAÇÃO</button></footer></form></dialog>
        <dialog class="module-dialog confirm-dialog" data-note-delete-dialog><form method="dialog"><header><div><span class="module-label">EXCLUSÃO DE ANOTAÇÃO</span><h2>Excluir a anotação de <span data-note-delete-time></span>?</h2></div><button type="button" data-proto-action="note-delete-close" aria-label="Fechar">×</button></header><div class="dialog-fields"><p data-note-delete-body></p><p class="dialog-info">A exclusão é definitiva.</p></div><footer><button class="module-secondary" type="button" data-proto-action="note-delete-close">CANCELAR</button><button class="module-danger" type="button" data-proto-action="note-delete-confirm">EXCLUIR ANOTAÇÃO</button></footer></form></dialog>

        ${finalized ? "" : scoreboardDialog()}`
    });
  }

  // RF013 · síntese da revisão: versões preservadas, sem edição
  const SYNTH_TEXT = {
    1: { overview: "A equipe manteve boa organização defensiva, mas apresentou atraso nas rotações para o bomb A. O uso coordenado de utilitários foi decisivo nos retakes dos rounds finais.",
         points: ["Antecipar a rotação após o primeiro contato no A.", "Evitar compras fragmentadas em rounds de economia.", "Preservar a Viper Pit para o segundo contato no pós-plant."],
         next: "Treinar comunicação de retake e execução de crossfire em situações 3v3." },
    2: { overview: "A vitória por 13 a 8 veio da defesa consistente no A e de retakes bem coordenados. As principais perdas ocorreram em rounds de economia e em rotações tardias após o primeiro contato.",
         points: ["Definir gatilho de rotação após o primeiro contato no A.", "Padronizar as compras em rounds de economia.", "Manter a Viper Pit para o segundo contato no pós-plant."],
         next: "Revisar rotações a partir do round 7 e treinar retakes 3v3 com utilitários combinados." }
  };
  function synthesisScreen() {
    const params = getHashParams();
    const notFinalized = params.has("andamento");
    const versions = prototypeState.synthesisList || [];
    const viewing = versions[versions.length - 1];
    const generating = prototypeState.synthesisGenerating;
    const failed = prototypeState.synthesisFailed;
    const text = viewing ? SYNTH_TEXT[((prototypeState.synthesisGen || 1) - 1) % 2 + 1] : null;
    const isCurrent = true;
    const body = notFinalized
      ? `<div class="synthesis-placeholder"><span>Σ</span><strong>SÍNTESE INDISPONÍVEL</strong><p>A síntese pode ser gerada somente após a finalização da sessão de revisão.</p></div>`
      : generating ? `<div class="synthesis-placeholder is-loading"><span>Σ</span><strong>GERANDO SÍNTESE…</strong><p>Anotações e scoreboard enviados ao modelo de linguagem com os nomes dos jogadores substituídos por pseudônimos.</p><i class="recording-progress"><b style="width:60%"></b></i></div>`
      : failed ? `<div class="synthesis-placeholder is-error"><span>!</span><strong>NÃO FOI POSSÍVEL GERAR A SÍNTESE</strong><p>O serviço do modelo de linguagem não respondeu. A síntese atual, se houver, foi mantida; tente novamente.</p></div>`
      : !viewing ? `<div class="synthesis-placeholder"><span>Σ</span><strong>NENHUMA SÍNTESE GERADA</strong><p>A síntese é gerada a partir das anotações e do scoreboard. Os nomes dos jogadores são enviados ao modelo de linguagem como pseudônimos.</p></div>`
      : `<div class="synthesis-copy"><p class="synthesis-basis">Gerada em ${viewing.at} · ${viewing.notes} anotações · placar ${viewing.score}</p><h3>VISÃO GERAL</h3><p>${text.overview}</p><h3>PONTOS DE ATENÇÃO</h3><ul>${text.points.map((x) => `<li>${x}</li>`).join("")}</ul><h3>PRÓXIMA SESSÃO</h3><p>${text.next}</p></div>`;
    const status = notFinalized ? ["muted", "INDISPONÍVEL"] : generating ? ["progress", "GERANDO"] : failed ? ["pending", "FALHA"] : viewing ? ["success", "GERADA"] : ["muted", "NÃO GERADA"];
    return moduleShell({
      screen: "sintese",
      activeNav: "reviews",
      eyebrow: notFinalized ? "SESSÃO EM ANDAMENTO · AZURE BEARS VS WOLF GAMING" : "REVISÃO FINALIZADA · AZURE BEARS VS GREEN OWLS",
      title: "SÍNTESE DA REVISÃO",
      description: "",
      actions: `<button class="module-secondary" type="button" data-route="revisao${notFinalized ? "" : "?finalizada=1"}">VOLTAR À REVISÃO</button><button class="module-primary" type="button" data-proto-action="generate-synthesis" ${notFinalized || generating ? "disabled" : ""}>${versions.length ? "GERAR NOVAMENTE" : "GERAR SÍNTESE"}</button>`,
      content: `<section class="synthesis-summary"><article><span>PARTIDA</span><strong>${notFinalized ? "AZURE BEARS × WOLF GAMING" : `AZURE BEARS ${prototypeState.scoreboardState === "corrected" ? "13 — 9" : "13 — 8"} GREEN OWLS`}</strong><small>${notFinalized ? "ASCENT · 21 MAR 2026" : "HAVEN · 28 MAR 2026"}</small></article><article><span>BASE DA SÍNTESE</span><strong>3 ANOTAÇÕES</strong><small>e scoreboard de 5 participantes</small></article><article><span>SESSÃO</span><strong>${notFinalized ? "EM ANDAMENTO" : "FINALIZADA"}</strong><small>${notFinalized ? "Scoreboard pendente" : "Scoreboard completo"}</small></article></section>
        <div class="synthesis-layout"><section class="module-card synthesis-result"><header><div><span class="module-label">SÍNTESE DA SESSÃO</span><h2>SÍNTESE TÁTICA</h2></div><span class="status-badge status-badge--${status[0]}">${status[1]}</span></header>${body}</section><aside class="module-card synthesis-history"><header><span class="module-label">SOBRE A SÍNTESE</span><small>Uma síntese por sessão</small></header><ul class="synthesis-rules"><li>Gerada a partir das anotações e do scoreboard da sessão finalizada.</li><li>Os nomes dos jogadores são enviados ao modelo de linguagem como pseudônimos.</li><li>O texto gerado não é editável.</li><li>Gerar novamente substitui a síntese atual.</li></ul></aside></div>`
    });
  }

  const actionIcons = [
    ["[data-route='dashboard']", "house"], ["[data-route='partidas']", "calendar-days"], ["[data-route='jogadores']", "users-round"],
    ["[data-route='revisoes']", "history"], ["[data-route='gravacoes']", "video"], ["[data-route='sincronizacao']", "waypoints"], ["[data-route='preparando']", "play"],
    ["[data-route='revisao']", "play"], ["[data-route='sintese']", "sparkles"], ["[data-route='nova-partida']", "plus"],
    ["[data-route='scoreboard']", "chart-no-axes-combined"], ["[data-route^='scoreboard?correcao']", "chart-no-axes-combined"], ["[data-route^='nova-partida?editar']", "square-pen"], ["[data-proto-action='open-recordings']", "video"], ["[data-route='rastreabilidade']", "list-checks"], ["[data-route='perfil-equipe']", "settings-2"],
    ["[data-open-team-dialog]", "plus"], ["[data-open-user-dialog], [data-proto-action='open-player-dialog']", "user-plus"],
    ["[data-edit-user], [data-edit-team], [data-edit-note], [data-proto-action='team-profile-save']", "square-pen"],
    ["[data-toggle-user]", "power"], ["[data-delete-user]", "trash-2"], ["[data-delete-team]", "trash-2"], ["[data-remove-recording]", "trash-2"],
    ["[data-auto-sync], [data-proto-action='sync-state']", "scan-line"], ["[data-validate-sync], [data-finalize-review], [data-proto-action='confirm-finalize']", "circle-check"],
    ["[data-generate-synthesis], [data-proto-action='generate-synthesis']", "sparkles"], ["[data-delete-note], [data-proto-action='remove-player'], [data-proto-action='open-delete-match'], [data-proto-action='confirm-delete-match']", "trash-2"],
    ["[data-proto-action='match-next']", "arrow-right"], ["[data-proto-action='match-back'], [data-proto-action='team-profile-reset']", "arrow-left"],
    ["[data-proto-action='toggle-participant']", "user-check"], ["[data-proto-action='score-state']", "circle-dot"],
    ["[data-proto-action='recording-mode']", "film"], ["footer [data-proto-action^='close-']", "x"], [".recording-upload", "upload"], ["[data-note-form] button", "plus"], ["[data-password-toggle]", "eye"]
  ];

  function resolveActionIcon(control, fallback) {
    if (control.matches("[data-password-toggle]")) {
      return control.getAttribute("aria-pressed") === "true" ? "eye-off" : "eye";
    }
    const label = control.textContent.trim().toLocaleLowerCase("pt-BR");
    if (label.includes("cancelar") || label.includes("fechar")) return "x";
    if (label.includes("voltar")) return "arrow-left";
    if (label.includes("nova partida")) return "plus";
    if (label.includes("continuar")) return "arrow-right";
    return fallback;
  }

  function renderActionIcons() {
    actionIcons.forEach(([selector, icon]) => {
      app.querySelectorAll(selector).forEach((control) => {
        if (control.querySelector(".ui-action-icon, [data-lucide]")) return;
        control.insertAdjacentHTML("afterbegin", `<i data-lucide="${resolveActionIcon(control, icon)}" class="ui-action-icon" aria-hidden="true"></i>`);
      });
    });
    if (window.lucide?.createIcons) {
      window.lucide.createIcons({ attrs: { class: "ui-action-icon", "aria-hidden": "true", "stroke-width": 1.8 } });
    }
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
        button.setAttribute("aria-pressed", String(show));
        button.classList.toggle("is-active", show);
        button.querySelector(".ui-action-icon")?.remove();
        button.insertAdjacentHTML("afterbegin", `<i data-lucide="${show ? "eye-off" : "eye"}" class="ui-action-icon" aria-hidden="true"></i>`);
        window.lucide?.createIcons({ attrs: { class: "ui-action-icon", "aria-hidden": "true", "stroke-width": 1.8 } });
      });
    });

    const loginForm = document.querySelector('[data-form="login"]');
    if (loginForm) loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const userMissing = !loginForm.elements.user.value.trim();
      const passwordMissing = !loginForm.elements.password.value;
      if (userMissing || passwordMissing) return;
      const profile = getProfileFromUrl();
      const credential = loginForm.elements.user.value.trim();
      const defaultName = profile === "admin" ? "Administrador" : "Lucas Ferreira";
      const displayName = credential && !credential.includes("@") ? credential : defaultName;
      window.sessionStorage.setItem("vodreview-user-name", displayName);
      window.sessionStorage.setItem("tactivod-profile", profile);
      navigate(profile === "admin" ? "usuarios" : "dashboard");
    });

    document.querySelectorAll("[data-logout]").forEach((button) => button.addEventListener("click", () => {
      const profile = button.dataset.profile === "admin" ? "admin" : "treinador";
      window.sessionStorage.removeItem("tactivod-profile");
      window.sessionStorage.removeItem("vodreview-user-name");
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
    const confirmDialog = document.querySelector("[data-confirm-dialog]");
    let pendingConfirm = null;
    const confirmAction = ({ eyebrow, title, message, details = [], confirmLabel, tone = "primary", infoOnly = false, onConfirm }) => {
      if (!confirmDialog) { onConfirm(); return; }
      pendingConfirm = onConfirm;
      confirmDialog.querySelector("[data-confirm-eyebrow]").textContent = eyebrow;
      confirmDialog.querySelector("[data-confirm-title]").textContent = title;
      confirmDialog.querySelector("[data-confirm-message]").textContent = message;
      const list = confirmDialog.querySelector("[data-confirm-details]");
      list.replaceChildren(...details.map(([label, value]) => {
        const row = document.createElement("div");
        const term = document.createElement("dt");
        const description = document.createElement("dd");
        term.textContent = label;
        description.textContent = value;
        row.append(term, description);
        return row;
      }));
      const ok = confirmDialog.querySelector("[data-confirm-ok]");
      ok.textContent = confirmLabel;
      ok.classList.toggle("confirm-dialog__danger", tone === "danger");
      confirmDialog.querySelector("[data-confirm-cancel]").hidden = infoOnly;
      confirmDialog.showModal();
    };
    if (confirmDialog) {
      confirmDialog.querySelector("[data-confirm-cancel]").addEventListener("click", () => confirmDialog.close());
      confirmDialog.querySelector("[data-confirm-ok]").addEventListener("click", () => {
        const proceed = pendingConfirm;
        pendingConfirm = null;
        confirmDialog.close();
        if (proceed) proceed();
      });
      confirmDialog.addEventListener("close", () => { pendingConfirm = null; });
    }
    const refreshAdminOverview = () => {
      const attention = document.querySelector("[data-admin-attention]");
      const links = document.querySelector("[data-admin-links]");
      if (attention) attention.innerHTML = adminAttentionItems();
      if (links) links.innerHTML = adminLinkItems();
      const coachSelect = teamForm && teamForm.elements.coach;
      if (coachSelect) coachSelect.innerHTML = coachOptions(teamForm.dataset.teamIndex === undefined ? "" : managedTeams[Number(teamForm.dataset.teamIndex)]?.coach);
      renderActionIcons();
    };
    const refreshUserStats = () => {
      const total = systemUsers.length;
      const active = systemUsers.filter((user) => user.status === "ATIVO").length;
      const totalOutputs = document.querySelectorAll("[data-user-total]");
      const activeOutput = document.querySelector("[data-user-active]");
      const detailOutput = document.querySelector("[data-user-active-detail]");
      totalOutputs.forEach((output) => { output.textContent = String(total); });
      if (activeOutput) activeOutput.textContent = String(active);
      if (detailOutput) detailOutput.textContent = `${Math.round((active / total) * 100)}% dos treinadores`;
      refreshAdminOverview();
    };
    const setPasswordFieldsEnabled = (enabled, editing = false) => {
      const fields = document.querySelector("[data-password-fields]");
      if (!fields || !userForm) return;
      const { password, passwordConfirm } = userForm.elements;
      fields.hidden = !enabled;
      password.disabled = !enabled;
      passwordConfirm.disabled = !enabled;
      password.required = enabled && !editing;
      passwordConfirm.required = enabled && !editing;
      password.value = "";
      passwordConfirm.value = "";
      passwordConfirm.setCustomValidity("");
      password.closest("label").querySelector("span").textContent = editing ? "NOVA SENHA" : "SENHA INICIAL";
      passwordConfirm.closest("label").querySelector("span").textContent = editing ? "CONFIRMAR NOVA SENHA" : "CONFIRMAR SENHA";
      document.querySelector("[data-password-hint]").hidden = !editing;
    };
    const checkPasswordMatch = () => {
      if (!userForm || userForm.elements.password.disabled) return;
      const { password, passwordConfirm } = userForm.elements;
      const value = password.value;
      const weak = value && (value.length < 8 || !/[A-Za-z]/.test(value) || !/[0-9]/.test(value));
      password.setCustomValidity(weak ? "A senha deve ter no mínimo 8 caracteres, com letras e números" : "");
      passwordConfirm.setCustomValidity(password.value === passwordConfirm.value ? "" : "As senhas não coincidem");
    };
    const syncUserSubmit = () => {};
    if (userForm) {
      userForm.elements.password.addEventListener("input", checkPasswordMatch);
      userForm.elements.passwordConfirm.addEventListener("input", checkPasswordMatch);
    }
    const openUserEditor = (index) => {
      const user = systemUsers[index];
      if (!user || !userForm || !userDialog) return;
      userForm.dataset.userIndex = String(index);
      userForm.elements.name.value = user.name;
      userForm.elements.email.value = user.email;
      userForm.elements.username.value = user.username || "";
      syncUserSubmit();
      setPasswordFieldsEnabled(true, true);
      document.querySelector("[data-user-dialog-title]").textContent = "EDITAR TREINADOR";
      userDialog.showModal();
    };
    const bindUserRowActions = (row) => {
      const index = Number(row.dataset.userIndex);
      row.querySelector("[data-edit-user]").addEventListener("click", () => openUserEditor(index));
      const toggleButton = row.querySelector("[data-toggle-user]");
      toggleButton.addEventListener("click", () => {
        const status = row.querySelector("[data-user-status]");
        const activating = status.textContent === "INATIVO";
        const user = systemUsers[index];
        confirmAction({
          eyebrow: activating ? "REATIVAR ACESSO" : "DESATIVAR ACESSO",
          title: `${activating ? "Ativar" : "Desativar"} ${user.name}?`,
          message: activating
            ? "O treinador volta a ter acesso à plataforma e à equipe vinculada."
            : "As sessões abertas do treinador são encerradas imediatamente. A equipe continua vinculada a ele e fica sem acesso até a reativação ou a troca do responsável.",
          details: [["Equipe", user.team || "Sem equipe"], ["Status atual", status.textContent], ["Novo status", activating ? "ATIVO" : "INATIVO"]],
          confirmLabel: activating ? "ATIVAR CONTA" : "DESATIVAR CONTA",
          tone: activating ? "primary" : "danger",
          onConfirm: () => {
            systemUsers[index].status = activating ? "ATIVO" : "INATIVO";
            status.textContent = systemUsers[index].status;
            status.className = `status-badge status-badge--${activating ? "success" : "muted"}`;
            const toggleLabel = `${activating ? "Desativar" : "Ativar"} treinador`;
            toggleButton.setAttribute("aria-label", toggleLabel);
            toggleButton.title = toggleLabel;
            refreshUserStats();
            if (usersBody) { usersBody.innerHTML = userRows(); usersBody.querySelectorAll("[data-user-row]").forEach(bindUserRowActions); }
            if (teamsBody) { teamsBody.innerHTML = teamRows(); teamsBody.querySelectorAll("[data-team-row]").forEach(bindTeamRowActions); }
            renderActionIcons();
            showToast(`Treinador ${activating ? "ativado" : "desativado"} com sucesso.`);
          }
        });
      });
      const deleteUserButton = row.querySelector("[data-delete-user]");
      if (deleteUserButton) deleteUserButton.addEventListener("click", () => {
        const user = systemUsers[index];
        confirmAction({
          eyebrow: "EXCLUIR TREINADOR",
          title: `Excluir ${user.name}?`,
          message: "A conta e os dados pessoais do treinador serão excluídos definitivamente, e as sessões abertas serão encerradas. Os registros das equipes não são afetados. A ação não pode ser desfeita.",
          details: [["Nome de usuário", user.username], ["Situação", user.status], ["Equipe vinculada", "Nenhuma"]],
          confirmLabel: "EXCLUIR TREINADOR",
          tone: "danger",
          onConfirm: () => {
            systemUsers.splice(index, 1);
            usersBody.innerHTML = userRows();
            usersBody.querySelectorAll("[data-user-row]").forEach(bindUserRowActions);
            renderActionIcons();
            if (typeof refreshAdminOverview === "function") refreshAdminOverview();
            showToast("Treinador excluído com sucesso.");
          }
        });
      });
    };
    document.querySelectorAll("[data-open-user-dialog]").forEach((button) => button.addEventListener("click", () => {
      if (userForm) {
        userForm.reset();
        delete userForm.dataset.userIndex;
      }
      const title = document.querySelector("[data-user-dialog-title]");
      if (title) title.textContent = "NOVO TREINADOR";
      setPasswordFieldsEnabled(true);
      syncUserSubmit();
      if (userDialog) userDialog.showModal();
    }));
    document.querySelectorAll("[data-close-user-dialog]").forEach((button) => button.addEventListener("click", () => userDialog && userDialog.close()));
    document.querySelectorAll("[data-user-row]").forEach(bindUserRowActions);
    document.querySelectorAll("[data-admin-search]").forEach((search) => search.addEventListener("input", () => {
      const card = search.closest(".admin-management-card");
      const term = search.value.trim().toLocaleLowerCase("pt-BR");
      const rows = card.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        row.hidden = !row.textContent.toLocaleLowerCase("pt-BR").includes(term);
      });
      card.querySelector("[data-admin-search-empty]").hidden = [...rows].some((row) => !row.hidden);
    }));
    const saveUser = () => {
      const index = userForm.dataset.userIndex === undefined ? -1 : Number(userForm.dataset.userIndex);
      const previousTeamName = index >= 0 ? systemUsers[index].team : "";
      const user = {
        name: userForm.elements.name.value.trim(),
        username: userForm.elements.username.value.trim(),
        email: userForm.elements.email.value.trim(),
        team: index >= 0 ? systemUsers[index].team : "",
        status: index >= 0 ? systemUsers[index].status : "ATIVO",
        access: index >= 0 ? systemUsers[index].access : "AINDA NÃO ACESSOU",
        initialPassword: userForm.elements.password.value || (index >= 0 ? systemUsers[index].initialPassword : "")
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
      const linkedTeam = managedTeams.find((team) => team.name === previousTeamName);
      if (linkedTeam) linkedTeam.coach = user.name;
      if (teamsBody) {
        teamsBody.innerHTML = teamRows();
        teamsBody.querySelectorAll("[data-team-row]").forEach(bindTeamRowActions);
      }
      refreshAdminOverview();
      showToast(index >= 0 ? "Treinador alterado com sucesso." : "Treinador cadastrado com sucesso.");
    };
    if (userForm) userForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const isEdit = userForm.dataset.userIndex !== undefined;
      confirmAction({
        eyebrow: isEdit ? "EDITAR TREINADOR" : "CRIAR CONTA DE TREINADOR",
        title: isEdit ? "Salvar alterações?" : "Criar conta de treinador?",
        message: isEdit
          ? "As alterações valem imediatamente para a conta do treinador."
          : "A conta será criada ativa. A equipe é atribuída no cadastro de equipes.",
        details: [
          ["Nome", userForm.elements.name.value.trim()],
          ["Nome de usuário", userForm.elements.username.value.trim()],
          ["E-mail", userForm.elements.email.value.trim()],
          ["Senha", userForm.elements.password.value ? "Definida" : isEdit ? "Mantida" : "Não definida"]
        ],
        confirmLabel: isEdit ? "SALVAR ALTERAÇÕES" : "CRIAR CONTA",
        onConfirm: saveUser
      });
    });

    const openTeamEditor = (index) => {
      const team = managedTeams[index];
      if (!team || !teamForm || !teamDialog) return;
      teamForm.dataset.teamIndex = String(index);
      teamForm.elements.name.value = team.name;
      teamForm.elements.tag.value = team.tag;
      teamForm.elements.state.value = team.state;
      teamForm.elements.coach.innerHTML = coachOptions(team.coach);
      teamForm.elements.coach.value = team.coach;
      syncStatePickers(teamForm);
      document.querySelector("[data-team-dialog-title]").textContent = "EDITAR EQUIPE";
      teamDialog.showModal();
    };
    function bindTeamRowActions(row) {
      const button = row.querySelector("[data-edit-team]");
      if (button) button.addEventListener("click", () => openTeamEditor(Number(row.dataset.teamIndex)));
      const deleteButton = row.querySelector("[data-delete-team]");
      if (deleteButton) deleteButton.addEventListener("click", () => {
        const team = managedTeams[Number(row.dataset.teamIndex)];
        if (team.players || team.matches) {
          confirmAction({
            eyebrow: "EXCLUSÃO NÃO PERMITIDA",
            title: `${team.name} não pode ser excluída`,
            message: "A equipe possui jogadores ou partidas vinculados. Somente equipes sem jogadores e sem partidas podem ser excluídas.",
            details: [["Jogadores", String(team.players)], ["Partidas", String(team.matches)]],
            confirmLabel: "ENTENDI",
            infoOnly: true,
            onConfirm: () => {}
          });
          return;
        }
        confirmAction({
          eyebrow: "EXCLUIR EQUIPE",
          title: `Excluir ${team.name}?`,
          message: "A equipe não possui jogadores nem partidas. A exclusão é definitiva.",
          details: [["Treinador responsável", team.coach]],
          confirmLabel: "EXCLUIR EQUIPE",
          tone: "danger",
          onConfirm: () => {
            const coach = systemUsers.find((user) => user.name === team.coach);
            if (coach) coach.team = "";
            managedTeams.splice(Number(row.dataset.teamIndex), 1);
            teamsBody.innerHTML = teamRows();
            teamsBody.querySelectorAll("[data-team-row]").forEach(bindTeamRowActions);
            usersBody.innerHTML = userRows();
            usersBody.querySelectorAll("[data-user-row]").forEach(bindUserRowActions);
            document.querySelectorAll("[data-team-total]").forEach((output) => { output.textContent = String(managedTeams.length); });
            renderActionIcons();
            showToast("Equipe excluída com sucesso.");
          }
        });
      });
    }
    document.querySelectorAll("[data-team-row]").forEach(bindTeamRowActions);
    document.querySelectorAll("[data-open-team-dialog]").forEach((button) => button.addEventListener("click", () => {
      if (!teamForm || !teamDialog) return;
      teamForm.reset();
      delete teamForm.dataset.teamIndex;
      teamForm.elements.coach.innerHTML = coachOptions();
      syncStatePickers(teamForm);
      document.querySelector("[data-team-dialog-title]").textContent = "NOVA EQUIPE";
      teamDialog.showModal();
    }));
    document.querySelectorAll("[data-close-team-dialog]").forEach((button) => button.addEventListener("click", () => teamDialog && teamDialog.close()));
    const saveTeam = () => {
      const index = teamForm.dataset.teamIndex === undefined ? -1 : Number(teamForm.dataset.teamIndex);
      const previousName = index >= 0 ? managedTeams[index].name : "";
      const team = {
        name: teamForm.elements.name.value.trim().toUpperCase(),
        tag: teamForm.elements.tag.value.trim().toUpperCase(),
        state: teamForm.elements.state.value,
        coach: teamForm.elements.coach.value,
        logo: index >= 0 ? managedTeams[index].logo : assets.shieldLogo,
        players: index >= 0 ? managedTeams[index].players : 0,
        matches: index >= 0 ? managedTeams[index].matches : 0
      };
      const previousCoach = index >= 0 ? managedTeams[index].coach : "";
      if (index >= 0) managedTeams[index] = team;
      else managedTeams.push(team);
      systemUsers.forEach((user) => {
        if (user.name === previousCoach && previousCoach !== team.coach) user.team = "";
        if (user.name === team.coach) user.team = team.name;
      });
      teamsBody.innerHTML = teamRows();
      teamsBody.querySelectorAll("[data-team-row]").forEach(bindTeamRowActions);
      usersBody.innerHTML = userRows();
      usersBody.querySelectorAll("[data-user-row]").forEach(bindUserRowActions);
      document.querySelectorAll("[data-team-total]").forEach((output) => { output.textContent = String(managedTeams.length); });
      teamDialog.close();
      refreshAdminOverview();
      renderActionIcons();
      showToast(index >= 0 ? "Equipe alterada com sucesso." : "Equipe cadastrada com sucesso.");
    };
    if (teamForm) {
      ["name", "tag"].forEach((field) => teamForm.elements[field].addEventListener("input", () => teamForm.elements[field].setCustomValidity("")));
      teamForm.elements.coach.addEventListener("change", () => teamForm.elements.coach.setCustomValidity(""));
      teamForm.elements.logo.addEventListener("change", () => {
        const file = teamForm.elements.logo.files[0];
        const label = teamForm.querySelector("[data-logo-name]");
        const tooBig = Boolean(file) && file.size > 2 * 1024 * 1024;
        teamForm.elements.logo.setCustomValidity(tooBig ? "O logo deve ser uma imagem PNG ou JPG de até 2 MB" : "");
        if (label) label.textContent = file ? (tooBig ? "Arquivo acima de 2 MB" : file.name) : "PNG ou JPG · até 2 MB · opcional";
      });
    }
    if (teamForm) teamForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const isEdit = teamForm.dataset.teamIndex !== undefined;
      const currentIndex = isEdit ? Number(teamForm.dataset.teamIndex) : -1;
      const others = managedTeams.filter((team, index) => index !== currentIndex);
      ["name", "tag", "state", "coach"].forEach((field) => {
        const el = teamForm.elements[field];
        el.setCustomValidity(el.value.trim() ? "" : el.tagName === "SELECT" ? "Selecione um item da lista." : "Preencha este campo.");
      });
      const nameValue = teamForm.elements.name.value.trim().toUpperCase();
      const tagValue = teamForm.elements.tag.value.trim().toUpperCase();
      if (nameValue) teamForm.elements.name.setCustomValidity(others.some((team) => team.name === nameValue) ? "Já existe uma equipe com este nome" : "");
      if (tagValue) teamForm.elements.tag.setCustomValidity(others.some((team) => team.tag === tagValue) ? "Já existe uma equipe com esta tag" : "");
      if (!teamForm.reportValidity()) return;
      confirmAction({
        eyebrow: isEdit ? "EDITAR EQUIPE" : "CADASTRAR EQUIPE",
        title: isEdit ? "Salvar alterações da equipe?" : "Cadastrar equipe?",
        message: "A equipe fica vinculada ao treinador responsável selecionado.",
        details: [
          ["Nome", teamForm.elements.name.value.trim().toUpperCase()],
          ["Tag", teamForm.elements.tag.value.trim().toUpperCase()],
          ["Estado", (brazilianStates.find(([uf]) => uf === teamForm.elements.state.value) || ["", ""])[1]],
          ["Treinador responsável", teamForm.elements.coach.value]
        ],
        confirmLabel: isEdit ? "SALVAR ALTERAÇÕES" : "CADASTRAR EQUIPE",
        onConfirm: saveTeam
      });
    });

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
      document.querySelectorAll("[data-pov-start]").forEach((pov) => {
        pov.classList.toggle("is-no-content", seconds < Number(pov.dataset.povStart));
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
        const mainName = povViewer.querySelector(".pov-main__identity strong");
        const audioLabel = document.querySelector("[data-audio-name]");
        if (mainName && audioLabel) audioLabel.textContent = mainName.textContent.toLocaleUpperCase("pt-BR");
        bindPovSelectors();
        updateReviewTimeline(reviewTimeline ? reviewTimeline.value : 762);
      }));
    };
    bindPovSelectors();
    const audioToggle = document.querySelector("[data-audio-toggle]");
    if (audioToggle) audioToggle.addEventListener("click", () => {
      const on = audioToggle.getAttribute("aria-pressed") !== "true";
      audioToggle.setAttribute("aria-pressed", String(on));
      audioToggle.classList.toggle("is-muted", !on);
      audioToggle.firstChild.textContent = on ? "🔊 ÁUDIO: " : "🔇 SEM ÁUDIO: ";
    });
    const initialInstant = getHashParams().get("instante");
    if (initialInstant !== null && reviewTimeline) updateReviewTimeline(Number(initialInstant));
    const noteList = document.querySelector("[data-review-note-list]");
    const refreshNotes = () => {
      if (!noteList) return;
      noteList.innerHTML = noteItems(false);
      const count = prototypeState.notes.length;
      const output = document.querySelector("[data-note-count]");
      if (output) output.textContent = `${count} ${count === 1 ? "REGISTRO" : "REGISTROS"}`;
      const track = document.querySelector(".review-timeline__track");
      if (track) {
        track.querySelectorAll("[data-timeline-marker]").forEach((m) => m.remove());
        track.insertAdjacentHTML("afterbegin", noteMarkers());
        track.querySelectorAll("[data-timeline-marker]").forEach((button) => button.addEventListener("click", () => updateReviewTimeline(button.dataset.timelineMarker)));
      }
      renderActionIcons();
    };
    if (noteList) noteList.addEventListener("click", (event) => {
      const jump = event.target.closest("[data-note-jump]");
      if (jump) { updateReviewTimeline(Number(jump.dataset.noteJump)); return; }
      const edit = event.target.closest("[data-edit-note]");
      if (edit) {
        const note = prototypeState.notes.find((n) => n.id === Number(edit.dataset.noteId));
        const dialog = document.querySelector("[data-note-dialog]");
        const form = dialog.querySelector("[data-note-edit-form]");
        form.dataset.noteId = note.id;
        form.elements.target.value = note.target;
        form.elements.body.value = note.body;
        form.elements.body.setCustomValidity("");
        dialog.querySelector("[data-note-edit-time]").textContent = mmss(note.time);
        dialog.showModal();
        return;
      }
      const del = event.target.closest("[data-delete-note]");
      if (del) {
        const note = prototypeState.notes.find((n) => n.id === Number(del.dataset.noteId));
        const dialog = document.querySelector("[data-note-delete-dialog]");
        dialog.dataset.noteId = note.id;
        dialog.querySelector("[data-note-delete-time]").textContent = mmss(note.time);
        dialog.querySelector("[data-note-delete-body]").textContent = `${noteTargetLabel(note.target)}: ${note.body}`;
        dialog.showModal();
      }
    });
    const noteDialog = document.querySelector("[data-note-dialog]");
    if (noteDialog) noteDialog.addEventListener("click", (event) => {
      const action = event.target.closest("[data-proto-action]")?.dataset.protoAction;
      if (action === "note-dialog-close") { noteDialog.close(); event.stopPropagation(); }
      if (action === "note-save") {
        event.stopPropagation();
        const form = noteDialog.querySelector("[data-note-edit-form]");
        const body = form.elements.body.value.trim();
        form.elements.body.setCustomValidity(body ? "" : "Preencha este campo");
        if (!form.reportValidity()) return;
        const note = prototypeState.notes.find((n) => n.id === Number(form.dataset.noteId));
        Object.assign(note, { target: form.elements.target.value, body });
        noteDialog.close();
        refreshNotes();
        showToast("Anotação alterada com sucesso.");
      }
    });
    const noteDeleteDialog = document.querySelector("[data-note-delete-dialog]");
    if (noteDeleteDialog) noteDeleteDialog.addEventListener("click", (event) => {
      const action = event.target.closest("[data-proto-action]")?.dataset.protoAction;
      if (action === "note-delete-close") { noteDeleteDialog.close(); event.stopPropagation(); }
      if (action === "note-delete-confirm") {
        event.stopPropagation();
        prototypeState.notes = prototypeState.notes.filter((n) => n.id !== Number(noteDeleteDialog.dataset.noteId));
        noteDeleteDialog.close();
        refreshNotes();
        showToast("Anotação excluída com sucesso.");
      }
    });
    const noteForm = document.querySelector("[data-note-form]");
    if (noteForm) {
      const counter = document.querySelector("[data-note-counter]");
      noteForm.elements.body.addEventListener("input", () => { if (counter) counter.textContent = `${noteForm.elements.body.value.length}/500`; noteForm.elements.body.setCustomValidity(""); });
      noteForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const body = noteForm.elements.body.value.trim();
        noteForm.elements.body.setCustomValidity(body ? "" : "Preencha este campo");
        if (!noteForm.reportValidity()) return;
        const time = Number(reviewTimeline ? reviewTimeline.value : 762);
        prototypeState.notes.push({ id: Date.now(), target: noteForm.elements.target.value, time, body });
        noteForm.reset();
        if (counter) counter.textContent = "0/500";
        refreshNotes();
        showToast(`Anotação registrada em ${mmss(time)}.`);
      });
    }
    const finalizeReview = document.querySelector("[data-finalize-review]");
    if (finalizeReview) finalizeReview.addEventListener("click", () => {
      const dialog = document.querySelector("[data-scoreboard-dialog]");
      if (dialog) dialog.showModal();
    });
    document.querySelectorAll("[data-scoreboard-dialog] [data-score-row]").forEach((row) => row.addEventListener("input", () => {
      const v = [...row.querySelectorAll("[data-score-stat]")].map((i) => i.value.trim());
      const ok = row.querySelector("[data-score-agent]").value !== "Selecione" && v.every((x) => /^\d+$/.test(x));
      if (/^\d+$/.test(v[0]) && /^\d+$/.test(v[1])) { const d = Number(v[0]) - Number(v[1]); row.querySelector("[data-score-diff]").textContent = `${d > 0 ? "+" : d < 0 ? "−" : ""}${Math.abs(d)}`; }
      row.classList.toggle("is-missing", !ok);
      const badge = row.querySelector("[data-score-status]");
      badge.className = `status-badge status-badge--${ok ? "success" : "pending"}`;
      badge.textContent = ok ? "COMPLETO" : "PENDENTE";
    }));

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
      preparando: preparingScreen,
      revisao: reviewScreen,
      sintese: synthesisScreen,
      "nova-partida": newMatchScreen,
      scoreboard: scoreboardScreen,
      rastreabilidade: traceabilityScreen
    };

    if (route === "nova-partida" && (prototypeState.lastRoute !== "nova-partida" || !prototypeState.matchDraft)) initMatchDraft();
    if (route === "partidas" && prototypeState.lastRoute !== "partidas" && !prototypeState.keepMatch) prototypeState.selectedMatch = null;
    prototypeState.keepMatch = false;
    prototypeState.lastRoute = route;
    document.body.classList.toggle("is-capture", new URLSearchParams(window.location.search).has("captura"));
    app.innerHTML = screens[route]();
    const titles = { equipe: "VOD Review — Administração", dashboard: "AZURE BEARS — Dashboard", partidas: "AZURE BEARS — Partidas", jogadores: "AZURE BEARS — Jogadores", usuarios: "VOD Review — Administração", revisoes: "AZURE BEARS — Revisões", gravacoes: "AZURE BEARS — Gravações", sincronizacao: "AZURE BEARS — Sincronização", preparando: "AZURE BEARS — Preparando a revisão", revisao: "AZURE BEARS — Revisão Multi-POV", sintese: "AZURE BEARS — Síntese", "nova-partida": "AZURE BEARS — Nova Partida", scoreboard: "AZURE BEARS — Scoreboard", rastreabilidade: "VOD Review — Rastreabilidade" };
    document.title = titles[route] || "VodReview";
    bindCommonInteractions();
    renderActionIcons();
    if (prototypeState.keepToast) { prototypeToast(prototypeState.keepToast); prototypeState.keepToast = null; }
  }

  function prototypeToast(message) {
    const toast = document.querySelector("[data-toast]");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function openRecordingDialog({ label, title, body, ok, run }) {
    const dialog = document.querySelector("[data-recording-dialog]");
    if (!dialog) return;
    dialog.querySelector("[data-recording-dialog-label]").textContent = label;
    dialog.querySelector("[data-recording-dialog-title]").textContent = title;
    dialog.querySelector("[data-recording-dialog-body]").innerHTML = body;
    dialog.querySelector("[data-recording-dialog-ok]").textContent = ok;
    prototypeState.recordingDialogRun = run;
    dialog.showModal();
    renderActionIcons();
  }

  function sendRecording(match, name, file) {
    const sizeGb = file.size / 1073741824;
    match.recordings[name] = { file: file.name, size: Math.max(sizeGb, 0.1), duration: "41:07", progress: 0 };
    render();
    let progress = 0;
    const timer = window.setInterval(() => {
      progress = Math.min(100, progress + 20);
      const rec = match.recordings[name];
      if (!rec) { window.clearInterval(timer); return; }
      if (progress >= 100) {
        window.clearInterval(timer);
        delete rec.progress;
        render();
        prototypeToast("Gravação enviada com sucesso.");
        return;
      }
      rec.progress = progress;
      const cardEl = document.querySelector(`[data-recording-card][data-player="${name}"]`);
      if (cardEl) {
        cardEl.querySelector(".status-badge").textContent = `ENVIANDO ${progress}%`;
        const bar = cardEl.querySelector(".recording-progress b");
        if (bar) bar.style.width = `${progress}%`;
      }
    }, 400);
  }

  app.addEventListener("change", (event) => {
    const input = event.target.closest("[data-recording-pick]");
    if (!input) return;
    const file = input.files && input.files[0];
    if (!file) return;
    const match = findMatch(prototypeState.recordingMatch);
    const name = input.dataset.player;
    prototypeState.recordingErrors = prototypeState.recordingErrors || {};
    const isMp4 = /\.mp4$/i.test(file.name) && (!file.type || file.type === "video/mp4");
    if (!isMp4 || file.size > 2 * 1073741824) {
      prototypeState.recordingErrors[name] = { file: file.name, message: isMp4 ? "Arquivo acima de 2 GB. Envie um arquivo de até 2 GB." : "Formato não aceito. Envie um arquivo MP4 (H.264) de até 2 GB." };
      render();
      prototypeToast("A gravação não foi enviada.");
      return;
    }
    delete prototypeState.recordingErrors[name];
    const current = match.recordings[name];
    if (current) {
      openRecordingDialog({
        label: "SUBSTITUIÇÃO DE GRAVAÇÃO", title: `Substituir a gravação de ${name}?`, ok: "SUBSTITUIR ARQUIVO",
        body: `<p>O arquivo <strong>${current.file}</strong> será excluído e substituído por <strong>${file.name}</strong>.</p><p class="dialog-info">A sincronização dos POVs deverá ser refeita. Se for a gravação de referência, uma nova referência será definida.</p>`,
        run: () => sendRecording(match, name, file)
      });
      input.value = "";
      return;
    }
    sendRecording(match, name, file);
  });

  // ---- RF009: sincronização (arrastar, ajuste fino, referência, detecção, validação) ----
  function syncChanged(name) {
    const sync = prototypeState.sync;
    sync.edited = true;
    if (sync.status !== "failed") sync.status = "proposed";
    sync.selected = name;
  }
  app.addEventListener("pointerdown", (event) => {
    const clip = event.target.closest("[data-sync-clip]");
    const sync = prototypeState.sync;
    if (!clip) {
      const lane = event.target.closest("[data-sync-lane], .sync-ruler__scale");
      if (lane && sync) {
        const rect = lane.getBoundingClientRect();
        sync.playhead = Math.max(0, Math.min(sync.window, ((event.clientX - rect.left) / rect.width) * sync.window));
        render();
      }
      return;
    }
    const name = clip.dataset.syncClip;
    if (name === sync.reference) { sync.selected = name; render(); return; }
    const lane = clip.parentElement;
    const width = lane.getBoundingClientRect().width;
    const startX = event.clientX;
    const startOffset = sync.offsets[name];
    let moved = false;
    clip.setPointerCapture(event.pointerId);
    const move = (ev) => {
      const delta = ((ev.clientX - startX) / width) * sync.window;
      if (Math.abs(ev.clientX - startX) > 2) moved = true;
      const value = Math.round((startOffset + delta) * 10) / 10;
      sync.offsets[name] = value;
      clip.style.left = `${(value / sync.window) * 100}%`;
      const label = clip.closest("[data-sync-track]").querySelector(".sync-track__label small");
      if (label) label.textContent = fmtSec(value, true);
    };
    const up = () => {
      clip.removeEventListener("pointermove", move);
      clip.removeEventListener("pointerup", up);
      if (moved) syncChanged(name); else sync.selected = name;
      render();
    };
    clip.addEventListener("pointermove", move);
    clip.addEventListener("pointerup", up);
  });
  app.addEventListener("keydown", (event) => {
    const clip = event.target.closest("[data-sync-clip]");
    if (!clip || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const name = clip.dataset.syncClip;
    const step = (event.shiftKey ? 1 : 0.1) * (event.key === "ArrowLeft" ? -1 : 1);
    prototypeState.sync.offsets[name] = Math.round((prototypeState.sync.offsets[name] + step) * 10) / 10;
    syncChanged(name);
    render();
    document.querySelector(`[data-sync-clip="${name}"]`)?.focus();
  });
  app.addEventListener("change", (event) => {
    const select = event.target.closest("[data-sync-reference]");
    if (!select) return;
    const sync = prototypeState.sync;
    sync.reference = select.value;
    Object.keys(sync.offsets).forEach((n) => { sync.offsets[n] = 0; });
    sync.detected = {};
    sync.status = "pending";
    if (sync.selected === sync.reference) sync.selected = sync.names.find((n) => n !== sync.reference);
    render();
    prototypeToast("Referência alterada: refaça a sincronização a partir da nova referência.");
  });

  app.addEventListener("input", (event) => {
    const search = event.target.closest("[data-match-search]");
    if (!search) return;
    const term = search.value.trim().toLocaleLowerCase("pt-BR");
    let visible = 0;
    document.querySelectorAll(".match-catalog-card").forEach((cardEl) => {
      const show = !term || cardEl.dataset.search.includes(term);
      cardEl.hidden = !show;
      if (show) visible += 1;
    });
    const empty = document.querySelector("[data-match-empty]");
    if (empty) empty.hidden = visible > 0;
  });

  app.addEventListener("click", (event) => {
    const control = event.target.closest("[data-proto-action]");
    if (!control) return;
    const action = control.dataset.protoAction;
    if (action === "toggle-participant") {
      const name = control.dataset.player;
      if (prototypeState.participants.has(name)) prototypeState.participants.delete(name);
      else if (prototypeState.participants.size < 5) prototypeState.participants.add(name);
      else { prototypeToast("Limite de cinco participantes atingido."); return; }
      render();
    }
    if (action === "match-next") {
      const step = prototypeState.matchStep;
      const draft = prototypeState.matchDraft;
      if (step === 1) {
        const form = document.querySelector("[data-match-form]");
        const el = form.elements;
        const free = form.querySelector("[data-opponent-free]").checked || !opponentTeams().length;
        const opponent = (free ? el.opponent.value : el.opponentTeam.value).trim().toLocaleUpperCase("pt-BR");
        const datetime = el.datetime.value;
        el.opponent.setCustomValidity(free && !opponent ? "Preencha este campo." : "");
        el.opponentTeam.setCustomValidity(!free && !opponent ? "Selecione o adversário na lista." : "");
        let dateMsg = datetime ? "" : "Preencha este campo";
        if (!dateMsg && new Date(datetime) > new Date()) dateMsg = "A data e a hora não podem ser posteriores ao momento atual";
        el.datetime.setCustomValidity(dateMsg);
        if (!form.reportValidity()) return;
        Object.assign(draft, { opponent, freeOpponent: free, event: el.event.value.trim(), datetime, type: form.querySelector("[name=type]:checked").value, map: form.querySelector("[name=map]:checked").value });
      }
      if (step === 3) {
        const participants = [...prototypeState.participants];
        if (draft.mode === "edit") {
          const match = findMatch(draft.id);
          match.participants.filter((n) => !participants.includes(n)).forEach((n) => delete match.recordings[n]);
          Object.assign(match, { opponent: draft.opponent, event: draft.event, datetime: draft.datetime, type: draft.type, map: draft.map, participants });
        } else {
          draft.id = `m${Date.now()}`;
          prototypeState.matches.unshift({ id: draft.id, opponent: draft.opponent, tag: (managedTeams.find((t) => t.name === draft.opponent) || {}).tag || "", datetime: draft.datetime, event: draft.event, type: draft.type, map: draft.map, status: "waiting", ours: null, theirs: null, participants, recordings: {} });
          prototypeState.matchCreated = true;
        }
        prototypeState.matchStep = 4;
        render();
        prototypeToast(prototypeState.matchCreated ? "Partida cadastrada com sucesso." : "Partida alterada com sucesso.");
        prototypeState.matchCreated = false;
        return;
      }
      prototypeState.matchStep = Math.min(4, step + 1);
      render();
    }
    if (action === "match-back") { prototypeState.matchStep = Math.max(1, prototypeState.matchStep - 1); render(); }
    if (action === "select-match") {
      prototypeState.selectedMatch = control.dataset.match;
      prototypeState.matchTab = "main";
      if (control.dataset.goto) { prototypeState.keepMatch = true; navigate(control.dataset.goto); return; }
      render();
    }
    if (action === "close-match") { prototypeState.selectedMatch = null; render(); }
    if (action === "open-recordings") {
      prototypeState.recordingMatch = control.dataset.match;
      prototypeState.selectedMatch = control.dataset.match;
      prototypeState.recordingErrors = {};
      prototypeState.matchTab = "recordings";
      if (getRoute() === "partidas") { render(); return; }
      prototypeState.keepMatch = true;
      navigate("partidas");
    }
    if (action === "match-notes-filter") {
      prototypeState.matchNotesFilter = control.dataset.filter;
      render();
    }
    if (action === "match-generate-synthesis") {
      const id = control.dataset.match;
      prototypeState.matchSynthesis = prototypeState.matchSynthesis || {};
      prototypeState.matchSynthesis[id] = { status: "generating" };
      render();
      window.setTimeout(() => {
        const target = findMatch(id);
        if (getHashParams().has("falha")) {
          prototypeState.matchSynthesis[id] = { status: "failed" };
          render();
          prototypeToast("Não foi possível gerar a síntese.");
          return;
        }
        prototypeState.matchSynthesis[id] = {
          status: "ready",
          at: "28/03/2026 18:05",
          notes: prototypeState.notes.length,
          score: target ? `${target.ours} — ${target.theirs}` : "—"
        };
        render();
        prototypeToast("Síntese gerada com sucesso.");
      }, 1600);
    }
    if (action === "match-tab") {
      prototypeState.matchTab = control.dataset.tab;
      prototypeState.recordingErrors = {};
      prototypeState.matchNotesFilter = "all";
      render();
      document.querySelector("[data-match-detail]")?.scrollIntoView({ block: "start" });
    }
    if (action === "open-remove-recording") {
      const match = findMatch(prototypeState.recordingMatch);
      const name = control.dataset.player;
      const others = Object.keys(match.recordings).filter((n) => n !== name).length;
      openRecordingDialog({
        label: "REMOÇÃO DE GRAVAÇÃO", title: `Remover a gravação de ${name}?`, ok: "REMOVER GRAVAÇÃO",
        body: `<p>O arquivo <strong>${match.recordings[name].file}</strong> será excluído do armazenamento.</p><p class="dialog-info">${name} ficará sem gravação e poderá receber outro arquivo enquanto a sessão de revisão não for criada.</p>`,
        run: () => { delete match.recordings[name]; render(); prototypeToast("Gravação removida com sucesso."); }
      });
    }
    if (action === "close-recording-dialog") document.querySelector("[data-recording-dialog]")?.close();
    if (action === "confirm-recording-dialog") {
      document.querySelector("[data-recording-dialog]")?.close();
      const run = prototypeState.recordingDialogRun;
      prototypeState.recordingDialogRun = null;
      if (run) run();
    }
    if (action === "score-state") { prototypeState.scoreboardState = control.dataset.state; prototypeState.scoreboardInvalid = []; render(); }
    if (action === "save-scoreboard") {
      const okInt = (v) => /^\d+$/.test(String(v).trim());
      const bad = [];
      document.querySelectorAll("[data-score-row]").forEach((row) => {
        const agent = row.querySelector("[data-score-agent]").value;
        const stats = [...row.querySelectorAll("[data-score-stat]")].map((i) => i.value);
        if (agent === "Selecione" || !stats.every(okInt)) bad.push(row.dataset.scoreRow);
      });
      const finals = [...document.querySelectorAll("[data-score-final]")].map((i) => i.value);
      prototypeState.scoreboardInvalid = bad;
      if (bad.length || !finals.every(okInt)) {
        render();
        prototypeToast("Informe o placar final e as estatísticas válidas de todos os participantes.");
        return;
      }
      const correction = control.dataset.mode === "correction";
      prototypeState.scoreboardState = correction ? "corrected" : "complete";
      if (correction) { render(); prototypeToast("Scoreboard corrigido com sucesso."); }
      else { prototypeState.keepToast = "Scoreboard registrado com sucesso."; navigate("revisao"); }
    }
    if (action === "recording-mode") { prototypeState.recordingMode = control.dataset.mode; render(); }
    if (action === "sync-state") { prototypeState.syncState = control.dataset.state; render(); }
    if (action === "team-profile-save") prototypeToast("Cenário visual: perfil da equipe atualizado.");
    if (action === "team-profile-reset") prototypeToast("Alterações visuais descartadas.");
    if (action === "open-delete-match") document.querySelector("[data-delete-match-dialog]")?.showModal();
    if (action === "close-delete-match") document.querySelector("[data-delete-match-dialog]")?.close();
    if (action === "confirm-delete-match") {
      document.querySelector("[data-delete-match-dialog]")?.close();
      prototypeState.matches = prototypeState.matches.filter((m) => m.id !== prototypeState.selectedMatch);
      prototypeState.selectedMatch = null;
      render();
      prototypeToast("Partida excluída com sucesso.");
    }
    if (action === "sync-zoom") { prototypeState.sync.window = Number(control.dataset.window); render(); }
    if (action === "sync-nudge") {
      const sync = prototypeState.sync;
      sync.offsets[sync.selected] = Math.round((sync.offsets[sync.selected] + Number(control.dataset.delta)) * 10) / 10;
      syncChanged(sync.selected);
      render();
    }
    if (action === "sync-auto") {
      const sync = prototypeState.sync;
      sync.status = "processing";
      render();
      window.setTimeout(() => {
        const failed = prototypeState.syncScenarioApplied === "falha";
        const base = SYNC_TRUTH[sync.reference];
        sync.names.forEach((n) => {
          const ok = !(failed && n === "greinzera");
          if (ok) { sync.offsets[n] = Math.round((SYNC_TRUTH[n] - base) * 10) / 10; sync.detected[n] = true; }
          else delete sync.detected[n];
        });
        sync.status = failed ? "failed" : "proposed";
        sync.edited = false;
        render();
        prototypeToast(failed ? "Detecção concluída com falha em uma gravação." : "Detecção automática concluída. Confira e valide.");
      }, 1200);
    }
    if (action === "sync-validate") document.querySelector("[data-sync-dialog]")?.showModal();
    if (action === "sync-dialog-close") document.querySelector("[data-sync-dialog]")?.close();
    if (action === "sync-confirm") {
      document.querySelector("[data-sync-dialog]")?.close();
      prototypeState.sync.status = "validated";
      render();
      prototypeToast("Sincronização validada com sucesso.");
    }
    if (action === "generate-synthesis" || action === "generate-synthesis-inline") {
      prototypeState.synthesisGenerating = true;
      prototypeState.synthesisFailed = false;
      render();
      window.setTimeout(() => {
        prototypeState.synthesisGenerating = false;
        if (getHashParams().has("falha")) { prototypeState.synthesisFailed = true; render(); prototypeToast("Não foi possível gerar a síntese."); return; }
        const replaced = Boolean((prototypeState.synthesisList || []).length);
        prototypeState.synthesisGen = (prototypeState.synthesisGen || 0) + 1;
        prototypeState.synthesisList = [{ n: 1, at: replaced ? "29/03/2026 10:12" : "28/03/2026 18:05", notes: 3, score: prototypeState.scoreboardState === "corrected" ? "13 — 9" : "13 — 8" }];
        render();
        prototypeToast(replaced ? "Síntese gerada novamente: a anterior foi substituída." : "Síntese gerada com sucesso.");
      }, 1400);
    }
    if (action === "view-synthesis") { prototypeState.synthesisView = Number(control.dataset.version); render(); }
    if (action === "audio-toggle") {
      prototypeState.audioMuted = !prototypeState.audioMuted;
      render();
    }
    if (action === "select-player") {
      prototypeState.selectedPlayer = control.dataset.player;
      if (control.dataset.goto) { navigate(control.dataset.goto); return; }
      render();
    }
    if (action === "open-player-dialog") {
      const dialog = document.querySelector("[data-player-dialog]");
      const form = dialog?.querySelector("[data-player-form]");
      const isNew = control.dataset.mode === "new";
      const player = selectedRosterPlayer();
      if (form) {
        form.reset();
        form.dataset.mode = isNew ? "new" : "edit";
        ["nickname", "fullName", "riotId"].forEach((name) => form.elements[name].setCustomValidity(""));
        form.elements.nickname.value = isNew ? "" : player.name;
        form.elements.fullName.value = isNew ? "" : player.fullName;
        form.elements.riotId.value = isNew ? "" : player.riotId;
        form.elements.role.value = isNew ? "CONTROLADOR" : player.role;
        dialog.querySelector("[data-player-dialog-title]").textContent = isNew ? "NOVO JOGADOR" : "EDITAR JOGADOR";
        dialog.querySelector("[data-player-delete]").hidden = isNew;
      }
      dialog?.showModal();
    }
    if (action === "close-player-dialog") document.querySelector("[data-player-dialog]")?.close();
    if (action === "open-remove-player") {
      document.querySelector("[data-player-dialog]")?.close();
      document.querySelector("[data-remove-player-dialog]")?.showModal();
    }
    if (action === "close-remove-player") document.querySelector("[data-remove-player-dialog]")?.close();
    if (action === "save-player") {
      const form = document.querySelector("[data-player-form]");
      const isNew = form.dataset.mode === "new";
      const current = isNew ? null : selectedRosterPlayer();
      const riotId = form.elements.riotId.value.trim();
      const used = rosterPlayers.filter((player) => player !== current).map((player) => player.riotId.toLocaleLowerCase("pt-BR")).concat(otherTeamRiotIds.map((id) => id.toLocaleLowerCase("pt-BR")));
      ["nickname", "fullName"].forEach((name) => form.elements[name].setCustomValidity(form.elements[name].value.trim() ? "" : "Preencha este campo"));
      form.elements.riotId.setCustomValidity(!riotId ? "Preencha este campo"
        : !riotIdPattern.test(riotId) ? "Informe o Riot ID no formato nome#tag"
        : used.includes(riotId.toLocaleLowerCase("pt-BR")) ? "Já existe um jogador com este Riot ID" : "");
      if (!form.reportValidity()) return;
      const data = { name: form.elements.nickname.value.trim(), fullName: form.elements.fullName.value.trim(), riotId, role: form.elements.role.value };
      if (isNew) rosterPlayers.push({ ...data, portrait: assets.shieldLogo, icon: assets.shieldLogo, agent: "—", rating: "—", matches: 0 });
      else Object.assign(current, data);
      prototypeState.selectedPlayer = data.name;
      document.querySelector("[data-player-dialog]")?.close();
      render();
      prototypeToast(isNew ? "Jogador cadastrado com sucesso." : "Jogador alterado com sucesso.");
    }
    if (action === "remove-player") {
      const player = selectedRosterPlayer();
      rosterPlayers.splice(rosterPlayers.indexOf(player), 1);
      prototypeState.participants.delete(player.name);
      prototypeState.selectedPlayer = rosterPlayers[0]?.name;
      document.querySelector("[data-remove-player-dialog]")?.close();
      render();
      prototypeToast("Jogador excluído com sucesso.");
    }
    if (action === "close-finalize") document.querySelector("[data-finalize-dialog]")?.close();
    if (action === "close-scoreboard-dialog") document.querySelector("[data-scoreboard-dialog]")?.close();
    if (action === "finalize-with-scoreboard") {
      const dialog = document.querySelector("[data-scoreboard-dialog]");
      const okInt = (v) => /^\d+$/.test(String(v).trim());
      let bad = 0;
      dialog.querySelectorAll("[data-score-row]").forEach((row) => {
        const ok = row.querySelector("[data-score-agent]").value !== "Selecione" && [...row.querySelectorAll("[data-score-stat]")].every((i) => okInt(i.value));
        row.classList.toggle("is-missing", !ok);
        if (!ok) { bad += 1; const b = row.querySelector("[data-score-status]"); b.className = "status-badge status-badge--pending"; b.textContent = "INVÁLIDO"; }
      });
      const finalsOk = [...dialog.querySelectorAll("[data-score-final]")].every((i) => okInt(i.value));
      const hint = dialog.querySelector("[data-score-hint]");
      if (bad || !finalsOk) { hint.classList.add("is-error"); hint.textContent = `Complete o placar final e as estatísticas de ${bad} participante(s) para finalizar.`; return; }
      dialog.close();
      prototypeState.scoreboardState = "complete";
      prototypeState.reviewReady = true;
      render();
      prototypeToast("Scoreboard registrado e revisão finalizada.");
    }
    if (action === "confirm-finalize") {
      if (prototypeState.scoreboardState === "incomplete") return;
      document.querySelector("[data-finalize-dialog]")?.close();
      prototypeState.reviewReady = true;
      render();
      prototypeToast("Sessão de revisão finalizada com sucesso.");
    }
  });

  new MutationObserver(() => { if (document.querySelector("[data-state-label]:empty")) syncStatePickers(); }).observe(document.body, { childList: true, subtree: true });
  window.addEventListener("hashchange", render);
  render();
  syncStatePickers();
})();
