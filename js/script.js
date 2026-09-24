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

  const routes = new Set(["login", "cadastro", "equipe", "dashboard"]);

  function getRoute() {
    const route = window.location.hash.replace(/^#\/?/, "").split("?")[0];
    return routes.has(route) ? route : "login";
  }

  function navigate(route) {
    window.location.hash = route;
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
    { x: 30, date: "04/19", logo: assets.ceub, logoSize: 31, logoOffset: 8, logoTop: 257, a: ["W", 74, 95], b: ["L", 63, 64] },
    { x: 165, date: "04/10", logo: assets.azure, logoSize: 31, logoOffset: 9, logoTop: 257, a: ["W", 72, 90], b: ["L", 65, 70] },
    { x: 300, date: "02/07", logo: assets.caap, logoSize: 31, logoOffset: 11, logoTop: 257, a: ["L", 63, 64], b: ["L", 66, 73] },
    { x: 435, date: "01/25", logo: assets.a2e, logoSize: 34, logoOffset: 10, logoTop: 255, a: ["L", 68, 78], b: ["L", 68, 78] },
    { x: 570, date: "01/24", logo: assets.wolf, logoSize: 31, logoOffset: 9, logoTop: 257, a: ["W", 77, 104], b: ["L", 57, 48] },
    { x: 705, date: "01/24", logo: assets.poli, logoSize: 33, logoOffset: 9, logoTop: 259, a: ["W", 73, 92], b: ["L", 68, 78] },
    { x: 840, date: "01/18", logo: assets.pucc, logoSize: 29, logoOffset: -3, logoTop: 257, a: ["L", 68, 78], b: null }
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

  function chartGroup(item) {
    return `<div class="chart-group" style="--group-x:${item.x}px;--logo-size:${item.logoSize}px;--logo-offset:${item.logoOffset}px;--logo-top:${item.logoTop}px">
      <span class="chart-group__date">${item.date}</span>
      ${chartBar(item.a, "first")}${chartBar(item.b, "second")}
      <img class="chart-group__logo" src="${item.logo}" alt="">
    </div>`;
  }

  function dashboardScreen() {
    return `
      <section class="dashboard-screen" data-screen="dashboard">
        <header class="dashboard-header">
          <div class="dashboard-logo-slot" aria-label="Área reservada para o logo"></div>
          <div class="dashboard-header__spacer"></div>
          <nav class="global-nav" aria-label="Navegação principal">
            ${["Meu Time", "Partidas", "Revisões"].map((label, index) => `<button class="global-nav__item${index === 0 ? " is-active" : ""}" type="button" data-nav-tab>${label}</button>`).join("")}
          </nav>
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
              <section class="team-summary" aria-label="Resumo da equipe">
                <div class="team-summary__identity">
                  <img class="team-summary__logo" src="${assets.rushone}" alt="Logo RUSH ONE">
                  <h1 class="team-summary__name">RUSH ONE</h1>
                  <div class="team-summary__meta"><span>RSH</span><span>·</span><img src="${assets.brazil}" alt="Brasil"><span>· 2W 1L · 33.85% WR</span></div>
                </div>
                <p class="team-summary__metric">43%</p>
                <dl class="team-summary__facts"><dt>Ranking:</dt><dd>#1</dd><dt>Info 2:</dt><dd>--</dd><dt>Info 3:</dt><dd>--</dd></dl>
              </section>
              <div class="content-tabs">
                <nav class="content-tabs__nav" aria-label="Seções da equipe">
                  ${["Visão Geral", "Histórico", "Players", "Métricas"].map((label, index) => `<button class="content-tab${index === 0 ? " is-active" : ""}" type="button" data-content-tab>${label}</button>`).join("")}
                </nav>
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
      dashboard: dashboardScreen
    };

    app.innerHTML = screens[route]();
    document.title = route === "dashboard" ? "RUSH ONE — Dashboard" : "RUSH ONE — Terminal";
    bindCommonInteractions();
  }

  window.addEventListener("hashchange", render);
  render();
})();
