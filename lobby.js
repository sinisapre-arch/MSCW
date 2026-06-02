/**
 * 3D Bureau Lobby — dual-wing navigation (Concept C)
 */

export function initLobby({ canvas, appEl, scrollContainer, onWingEnter }) {
  const body = document.body;
  const lobbySection = document.getElementById('lobby');
  const wingStatus = document.getElementById('wing-status');
  const scrollHint = document.querySelector('.scroll-hint');
  const portals = document.querySelectorAll('.lobby-portal, .lobby-quick-actions [data-wing]');
  const portalLayer = document.getElementById('lobby-portal-layer');
  const wingNavBtns = document.querySelectorAll('[data-wing-nav]');
  const returnLobbyBtn = document.getElementById('return-lobby');
  const sections = () => document.querySelectorAll('[data-wing]');

  let activeWing = null;
  let splineApp = null;

  const setWingStatus = (text) => {
    if (wingStatus) wingStatus.textContent = text;
  };

  const updateVisibility = () => {
    sections().forEach((sec) => {
      const wing = sec.getAttribute('data-wing');
      const isLobby = sec.id === 'lobby';
      if (isLobby) {
        sec.classList.toggle('wing-hidden', activeWing !== null);
        return;
      }
      if (!activeWing) {
        sec.classList.toggle('wing-hidden', !isLobby);
        return;
      }
      const show = wing === 'shared' || wing === activeWing;
      sec.classList.toggle('wing-hidden', !show);
    });
  };

  const applyCanvasMood = () => {
    if (!canvas) return;
    canvas.classList.remove('canvas-mood-synthetic', 'canvas-mood-physical', 'canvas-mood-lobby');
    if (!activeWing) canvas.classList.add('canvas-mood-lobby');
    else canvas.classList.add(`canvas-mood-${activeWing}`);
  };

  const runVisorTransition = (callback) => {
    body.classList.add('visor-shut');
    if (appEl) appEl.style.opacity = '0';
    if (canvas) canvas.style.opacity = '0';

    setTimeout(() => {
      callback();
      body.classList.remove('visor-shut');
      if (appEl) appEl.style.opacity = '1';
      if (canvas) canvas.style.opacity = '';
      applyCanvasMood();
    }, 520);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el && scrollContainer) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const enterWing = (wing) => {
    if (activeWing === wing) {
      scrollToSection(wing === 'synthetic' ? 'synthetic-hub' : 'physical-hub');
      return;
    }

    runVisorTransition(() => {
      activeWing = wing;
      body.classList.remove('lobby-active');
      body.classList.add(`wing-${wing}`);
      body.classList.remove(wing === 'synthetic' ? 'wing-physical' : 'wing-synthetic');

      updateVisibility();
      applyCanvasMood();

      const label = wing === 'synthetic' ? 'Synthetic studio' : 'Physical studio';
      setWingStatus(label);
      if (portalLayer) portalLayer.setAttribute('aria-hidden', 'true');
      if (scrollHint) scrollHint.textContent = 'Scroll to explore projects';

      wingNavBtns.forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-wing-nav') === wing);
      });

      scrollToSection(wing === 'synthetic' ? 'synthetic-hub' : 'physical-hub');
      onWingEnter?.(wing);
    });
  };

  const returnToLobby = () => {
    runVisorTransition(() => {
      activeWing = null;
      body.classList.add('lobby-active');
      body.classList.remove('wing-synthetic', 'wing-physical');

      updateVisibility();
      applyCanvasMood();
      setWingStatus('Lobby');
      if (portalLayer) portalLayer.setAttribute('aria-hidden', 'false');
      if (scrollHint) scrollHint.textContent = 'Choose a wing to explore';

      wingNavBtns.forEach((btn) => btn.classList.remove('active'));

      if (scrollContainer) scrollContainer.scrollTop = 0;
      lobbySection?.classList.remove('wing-hidden');
    });
  };

  portals.forEach((portal) => {
    portal.addEventListener('click', () => {
      const wing = portal.getAttribute('data-wing');
      if (wing) enterWing(wing);
    });
  });

  wingNavBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const wing = btn.getAttribute('data-wing-nav');
      if (wing === 'lobby') returnToLobby();
      else enterWing(wing);
    });
  });

  returnLobbyBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    returnToLobby();
  });

  /** Wire Spline object clicks when your scene has Portal_Synthetic / Portal_Physical */
  const bindSplinePortals = (app) => {
    splineApp = app;
    if (!app?.addEventListener) return;

    app.addEventListener('mouseDown', (e) => {
      if (activeWing || !e?.target?.name) return;
      const name = e.target.name.toLowerCase();
      if (name.includes('synthetic') || name.includes('signal_left')) enterWing('synthetic');
      if (name.includes('physical') || name.includes('signal_right') || name.includes('terra')) enterWing('physical');
    });
  };

  body.classList.add('lobby-active');
  updateVisibility();
  applyCanvasMood();
  setWingStatus('Lobby');

  return { enterWing, returnToLobby, bindSplinePortals, getActiveWing: () => activeWing };
}
