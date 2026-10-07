const dialog = document.querySelector('#app-window');
const windowContent = document.querySelector('#window-content');
const windowPath = document.querySelector('#window-path');
const themeButton = document.querySelector('.theme-toggle');
const motionButton = document.querySelector('.motion-toggle');
const boot = document.querySelector('#boot');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setTheme(theme) {
  const light = theme === 'light';
  document.body.classList.toggle('light', light);
  document.documentElement.classList.toggle('light', light);
  themeButton.setAttribute('aria-pressed', String(light));
  themeButton.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  themeButton.textContent = light ? '[ DARK ]' : '[ LIGHT ]';
  document.querySelector('meta[name="theme-color"]').setAttribute('content', light ? '#e5dec9' : '#0b1210');
  localStorage.setItem('rishab-system-theme', theme);
}

const savedTheme = localStorage.getItem('rishab-system-theme');
if (savedTheme) setTheme(savedTheme);
themeButton.addEventListener('click', () => setTheme(document.body.classList.contains('light') ? 'dark' : 'light'));

function setMotionPaused(paused) {
  document.body.classList.toggle('motion-paused', paused);
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.setAttribute('aria-label', paused ? 'Resume animation' : 'Pause animation');
  motionButton.textContent = paused ? '[ MOTION: OFF ]' : '[ MOTION: ON ]';
  if (paused) window.cancelAnimationFrame(signalFrame);
  else if (signalFrame) signalFrame = window.requestAnimationFrame(paintSignal);
}

motionButton.addEventListener('click', () => setMotionPaused(!document.body.classList.contains('motion-paused')));

function enterDesktop() {
  const desktop = document.querySelector('#desktop');
  desktop.inert = false;
  desktop.focus({ preventScroll: true });
  desktop.classList.add('is-revealed');
  boot.classList.add('is-gone');
  window.setTimeout(() => { boot.hidden = true; }, 420);
}

document.querySelector('#enter-site').addEventListener('click', enterDesktop);
document.querySelector('.skip-link').addEventListener('click', enterDesktop);
if (!reduceMotion) window.setTimeout(enterDesktop, 2100);
else enterDesktop();

const appNames = {
  profile: 'rishab.sys',
  research: 'research.log',
  dance: 'rhythm.exe',
  journal: 'notes.md',
};

function openApp(name) {
  const template = document.querySelector(`#${name}-template`);
  if (!template) return;
  windowContent.replaceChildren(template.content.cloneNode(true));
  windowPath.textContent = `/archive/${appNames[name]}`;
  dialog.dataset.app = name;
  dialog.classList.toggle('research-window', name === 'research');
  if (!dialog.open) dialog.showModal();
  if (name === 'journal') bindJournal();
  if (name === 'research') bindResearch();
  requestAnimationFrame(() => revealText(windowContent));
}

function revealText(scope) {
  const targets = scope.querySelectorAll('h2, h3, .lead, .eyebrow, .project-tab, .research-field, .profile-facts > div, .dance-copy > *, .journal-item, .journal-reader > *');
  targets.forEach((element, index) => {
    element.style.animationDelay = `${Math.min(index, 9) * 55}ms`;
    element.classList.add('text-reveal');
  });
}

const researchProjects = [
  {
    institution: 'UCSF',
    title: 'Glaucoma prediction model',
    summary: 'Research experience in glaucoma prediction using machine learning.',
  },
  {
    institution: 'Baylor College of Medicine',
    title: 'Early glaucoma screening',
    summary: 'Research experience focused on early glaucoma screening.',
  },
  {
    institution: 'Harvard',
    title: 'Stem cell research',
    summary: 'Research experience in stem cell science.',
  },
];
let activeResearchProject = 0;
let chooseResearchProject = () => {};
let researchExplorer = null;

function bindResearch() {
  const tabs = [...windowContent.querySelectorAll('[data-project-index]')];
  const story = windowContent.querySelector('#research-story');
  const position = windowContent.querySelector('#research-position');
  const progress = windowContent.querySelector('#research-progress-fill');

  chooseResearchProject = (index, moveFocus = false) => {
    activeResearchProject = (index + researchProjects.length) % researchProjects.length;
    const project = researchProjects[activeResearchProject];
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === activeResearchProject;
      tab.classList.toggle('is-selected', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    const selectedTab = tabs[activeResearchProject];
    selectedTab.setAttribute('aria-controls', 'research-panel');
    windowContent.querySelector('#research-panel').setAttribute('aria-labelledby', selectedTab.id);
    windowContent.querySelector('#research-panel').setAttribute('aria-live', activeResearchProject === 0 ? 'off' : 'polite');
    position.textContent = `${String(activeResearchProject + 1).padStart(2, '0')} / ${String(researchProjects.length).padStart(2, '0')}`;
    progress.style.transform = `scaleX(${(activeResearchProject + 1) / researchProjects.length})`;

    researchExplorer = null;
    windowContent.querySelector('.research-page').classList.toggle('is-ucsf', activeResearchProject === 0);
    if (activeResearchProject === 0) {
      researchExplorer = window.mountUCSFResearch(story);
      if (moveFocus) selectedTab.focus();
      return;
    }

    const header = document.createElement('header');
    header.className = 'research-story-heading';
    const institution = document.createElement('p');
    institution.className = 'entry-place text-reveal';
    institution.style.animationDelay = '0ms';
    institution.textContent = project.institution;
    const title = document.createElement('h3');
    title.className = 'research-title text-reveal';
    title.style.animationDelay = '55ms';
    title.textContent = project.title;
    const summary = document.createElement('p');
    summary.className = 'research-summary text-reveal';
    summary.style.animationDelay = '110ms';
    summary.textContent = project.summary;
    header.append(institution, title, summary);

    const details = document.createElement('div');
    details.className = 'research-fields';
    [
      ['ROLE', 'Add your contribution here'],
      ['METHODS', 'Add the tools or approach here'],
      ['TAKEAWAY', 'Add a finding or lesson here'],
    ].forEach(([label, placeholder], fieldIndex) => {
      const field = document.createElement('section');
      field.className = 'research-field text-reveal';
      field.style.animationDelay = `${(fieldIndex + 3) * 55}ms`;
      const fieldLabel = document.createElement('p');
      fieldLabel.textContent = label;
      const fieldContent = document.createElement('span');
      fieldContent.textContent = placeholder;
      field.append(fieldLabel, fieldContent);
      details.append(field);
    });
    story.replaceChildren(header, details);
    if (moveFocus) selectedTab.focus();
  };

  tabs.forEach((tab) => tab.addEventListener('click', () => chooseResearchProject(Number(tab.dataset.projectIndex))));
  windowContent.querySelectorAll('[data-project-step]').forEach((button) => {
    button.addEventListener('click', () => chooseResearchProject(activeResearchProject + Number(button.dataset.projectStep)));
  });
  chooseResearchProject(0);
}

document.querySelectorAll('[data-open]').forEach((button) => {
  button.addEventListener('click', () => openApp(button.dataset.open));
});

document.querySelector('.window-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

function bindJournal() {
  const articleDetails = {
    plasticity: {
      label: 'DRAFT IDEA / NEURAL PLASTICITY',
      title: 'What does it mean for a brain to change?',
      paragraphs: [
        'I keep coming back to the word “plasticity.” It suggests that experience leaves a mark, but the interesting part is how that mark is made. What changes when we learn to see something differently? Where does practice end and biology begin?',
        'This is a starting point for a longer note about the questions behind my interest in computational neuroscience.',
      ],
    },
    dance: {
      label: 'DRAFT IDEA / DANCE',
      title: 'Learning a movement by heart',
      paragraphs: [
        'A movement can feel awkward, then familiar, then suddenly available without thinking. Dance gives me a way to notice the relationship between repetition and attention in my own body.',
        'I want to write about what happens in rehearsal: the shared timing, the small corrections, and the moment a group begins to move as one.',
      ],
    },
  };
  const buttons = [...windowContent.querySelectorAll('[data-article]')];
  buttons.forEach((button) => button.addEventListener('click', () => {
    buttons.forEach((item) => item.classList.toggle('selected', item === button));
    const article = articleDetails[button.dataset.article];
    document.querySelector('#reader-label').textContent = article.label;
    document.querySelector('#reader-title').textContent = article.title;
    const body = document.querySelector('#reader-body');
    body.replaceChildren(...article.paragraphs.map((text) => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      return paragraph;
    }));
  }));
}

document.addEventListener('keydown', (event) => {
  if (dialog.open) {
    const target = event.target;
    if (target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return;
    if (dialog.dataset.app === 'research' && !event.altKey && !event.ctrlKey && !event.metaKey && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      if (researchExplorer && ['ArrowUp', 'ArrowDown'].includes(event.key)) researchExplorer.step(event.key === 'ArrowDown' ? 1 : -1);
      else if (event.key === 'Home') chooseResearchProject(0, true);
      else if (event.key === 'End') chooseResearchProject(researchProjects.length - 1, true);
      else chooseResearchProject(activeResearchProject + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1), true);
    }
    return;
  }
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  const target = event.target;
  if (target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return;
  const shortcuts = { '1': 'research', '2': 'dance', '3': 'profile', '4': 'journal' };
  if (shortcuts[event.key]) openApp(shortcuts[event.key]);
});

let signalFrame = 0;
let paintSignal = () => {};
{
  const canvas = document.querySelector('#signal-canvas');
  const context = canvas.getContext('2d');
  const figure = document.querySelector('.signal-art');
  const pointerEnabled = !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, active: false, heat: 0, initialized: false };
  const halo = document.createElement('div');
  halo.className = 'pointer-halo';
  halo.setAttribute('aria-hidden', 'true');
  if (pointerEnabled) document.body.append(halo);
  const points = [];
  for (let x = -2; x <= 2; x += 1) {
    for (let y = -2; y <= 2; y += 1) {
      for (let z = -2; z <= 2; z += 1) points.push({ x: x / 2, y: y / 2, z: z / 2 });
    }
  }
  const edges = [];
  points.forEach((point, index) => points.slice(index + 1).forEach((other, offset) => {
    const distance = Math.abs(point.x - other.x) + Math.abs(point.y - other.y) + Math.abs(point.z - other.z);
    if (Math.abs(distance - .5) < .001) edges.push([index, index + 1 + offset]);
  }));
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--amber').trim();
  let phase = 0;

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = figure.getBoundingClientRect();
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (reduceMotion) paintSignal();
  }

  paintSignal = function paint() {
    const width = figure.clientWidth;
    const height = figure.clientHeight;
    context.clearRect(0, 0, width, height);
    phase += .003;
    if (pointerEnabled) {
      pointer.x += (pointer.targetX - pointer.x) * .15;
      pointer.y += (pointer.targetY - pointer.y) * .15;
      pointer.heat += ((pointer.active && !dialog.open ? 1 : 0) - pointer.heat) * .075;
      halo.style.transform = `translate3d(${pointer.x - 220}px, ${pointer.y - 220}px, 0)`;
      halo.style.opacity = String(pointer.heat);
    }
    const bounds = figure.getBoundingClientRect();
    const localPointerX = pointer.x - bounds.left;
    const localPointerY = pointer.y - bounds.top;
    const tilt = .56 + Math.sin(phase * .7) * .1;
    const scale = Math.min(width, height) * .84;
    const projected = points.map((point) => {
      const x = point.x * Math.cos(phase) - point.z * Math.sin(phase);
      const z = point.x * Math.sin(phase) + point.z * Math.cos(phase);
      const y = point.y * Math.cos(tilt) - z * Math.sin(tilt);
      const depth = point.y * Math.sin(tilt) + z * Math.cos(tilt);
      const perspective = 1 / (2.8 - depth * .48);
      const baseX = width / 2 + x * scale * perspective;
      const baseY = height / 2 + y * scale * perspective;
      const distance = Math.hypot(baseX - localPointerX, baseY - localPointerY);
      const influence = pointerEnabled ? Math.max(0, 1 - distance / 145) ** 2 * pointer.heat : 0;
      const push = influence * 29;
      const direction = distance > .001 ? 1 / distance : 0;
      return { x: baseX + (baseX - localPointerX) * direction * push, y: baseY + (baseY - localPointerY) * direction * push, depth };
    });
    context.lineWidth = .7;
    edges.forEach(([from, to]) => {
      const a = projected[from];
      const b = projected[to];
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.strokeStyle = accent;
      context.globalAlpha = .08 + ((a.depth + b.depth + 2) / 4) * .14;
      context.stroke();
    });
    context.globalAlpha = 1;
    projected.forEach(({ x, y, depth }, index) => {
      const bright = index % 41 === Math.floor(phase * 40 % 41);
      const size = bright ? 3 : 1.4 + (depth + 1) * .45;
      context.fillStyle = bright ? '#ead9ac' : accent;
      context.globalAlpha = bright ? .95 : .24 + (depth + 1) * .16;
      context.fillRect(Math.round(x - size / 2), Math.round(y - size / 2), size, size);
    });
    context.globalAlpha = 1;
    if (!reduceMotion && !document.body.classList.contains('motion-paused')) {
      signalFrame = window.requestAnimationFrame(paintSignal);
    }
  };

  new ResizeObserver(resizeCanvas).observe(figure);
  if (pointerEnabled) {
    document.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      if (!pointer.initialized) {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.initialized = true;
      }
      pointer.active = true;
    });
    document.documentElement.addEventListener('pointerleave', () => { pointer.active = false; });
    window.addEventListener('blur', () => { pointer.active = false; });
  }
  resizeCanvas();
  paintSignal();
}

if (reduceMotion) {
  document.body.classList.add('motion-paused');
  motionButton.disabled = true;
  motionButton.setAttribute('aria-pressed', 'true');
  motionButton.setAttribute('aria-label', 'Motion disabled by your system preference');
  motionButton.textContent = '[ MOTION: REDUCED ]';
}

function openLinkedApp() {
  const name = window.location.hash.slice(1);
  if (Object.hasOwn(appNames, name)) openApp(name);
}
window.addEventListener('hashchange', openLinkedApp);
openLinkedApp();
