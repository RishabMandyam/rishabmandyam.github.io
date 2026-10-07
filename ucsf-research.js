/* All figures are locally drawn schematics, not patient data or learned attention maps.
   Performance values follow manuscript v17's main text; ablations use epoch 45. */
(() => {
  const svg = (label, content, viewBox = '0 0 640 250') => `<svg viewBox="${viewBox}" role="img" aria-label="${label}" class="science-svg"><title>${label}</title>${content}</svg>`;
  const text = (x, y, value, cls = '') => `<text x="${x}" y="${y}" class="${cls}">${value}</text>`;
  const box = (x, y, w, h, label, cls = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" class="${cls}"/>${text(x + w / 2, y + h / 2 + 4, label, 'center')}`;
  const path = (d, cls = '') => `<path d="${d}" class="${cls}"/>`;
  const responsive = (desktop, mobile) => desktop.replace('class="science-svg"', 'class="science-svg svg-desktop"') + mobile.replace('class="science-svg"', 'class="science-svg svg-mobile"');
  const attention = `<math display="block" aria-label="Attention of Q, K and V equals softmax of Q K transpose divided by square root of d k, times V"><mrow><mi mathvariant="normal">Attention</mi><mo>(</mo><mi>Q</mi><mo>,</mo><mi>K</mi><mo>,</mo><mi>V</mi><mo>)</mo><mo>=</mo><mi mathvariant="normal">softmax</mi><mo>(</mo><mfrac><mrow><mi>Q</mi><msup><mi>K</mi><mi>T</mi></msup></mrow><msqrt><msub><mi>d</mi><mi>k</mi></msub></msqrt></mfrac><mo>)</mo><mi>V</mi></mrow></math>`;

  function timeline() {
    const label = 'Schematic cumulative history ends at prediction time t. The outcome is SLT or qualifying surgery within the next six months.';
    return responsive(svg(label, `
      <rect x="48" y="87" width="330" height="91" class="history-zone"/>
      <rect x="378" y="87" width="212" height="91" class="future-zone"/>
      ${path('M48 157 H590')}
      ${[78, 147, 202, 276, 339].map((x, i) => `<g class="history-token" style="--i:${i}"><rect x="${x}" y="${105 + (i % 2) * 15}" width="12" height="12"/>${path(`M${x + 6} ${117 + (i % 2) * 15} V157`)}</g>`).join('')}
      ${text(48, 64, 'OBSERVED HISTORY', 'accent')}${text(408, 64, 'NEXT 6 MONTHS', 'accent')}
      ${text(48, 204, 'irregular visits · either eye')}${text(408, 204, 'SLT / glaucoma surgery')}
      ${path('M378 78 V184', 'prediction-line')}
      ${text(378, 231, 'prediction time t', 'center accent')}
      <circle cx="507" cy="157" r="5" class="event-node"/>
      ${text(507, 133, 'y = 1', 'center')}
    `), svg(label, `
      ${text(18, 34, 'OBSERVED HISTORY', 'accent')}${text(211, 34, 'NEXT 6 MO.', 'accent')}
      <rect x="18" y="67" width="180" height="92" class="history-zone"/><rect x="198" y="67" width="124" height="92" class="future-zone"/>
      ${path('M18 138 H322')}${path('M198 54 V174', 'prediction-line')}
      ${[35, 65, 96, 132, 170].map((x, i) => `<g class="history-token" style="--i:${i}"><rect x="${x}" y="${88 + i % 2 * 15}" width="8" height="8"/>${path(`M${x + 4} ${96 + i % 2 * 15} V138`)}</g>`).join('')}
      <circle cx="270" cy="138" r="4" class="event-node"/>${text(270, 113, 'y = 1', 'center')}
      ${text(18, 195, 'irregular visits')}${text(211, 195, 'SLT / surgery')}${text(198, 227, 'prediction time t', 'center accent')}
    `, '0 0 340 250'));
  }

  function encoder() {
    const patches = Array.from({ length: 196 }, (_, i) => {
      const x = i % 14; const y = Math.floor(i / 14);
      const value = .09 + .35 * (Math.sin(x * .7 + y * .4) + 1) / 2;
      return `<rect x="${39 + x * 9}" y="${64 + y * 9}" width="7" height="7" class="image-patch" style="opacity:${value};--i:${x + y}"/>`;
    }).join('');
    const label = 'Synthetic patch grid: a 224 by 224 image is split into 14 by 14 patches for a frozen ViT-B/16. SimCLR aligns two augmented views before downstream training.';
    return responsive(svg(label, `
      ${text(39, 35, '224 × 224', 'accent')}${patches}${text(39, 218, '14 × 14 patches')}
      ${path('M177 126 H217', 'signal-flow')}
      ${box(217, 88, 126, 76, 'ViT-B/16')}${text(280, 186, 'FROZEN ENCODER', 'center accent')}
      ${text(280, 208, '12 layers · 12 heads', 'center')}
      ${path('M343 126 H395', 'signal-flow')}
      ${Array.from({ length: 12 }, (_, i) => `<rect x="${395 + i * 5}" y="96" width="3" height="60" class="embedding-cell" style="--i:${i}"/>`).join('')}
      ${text(422, 186, '768-d', 'center accent')}
      ${text(488, 61, 'SELF-SUPERVISION', 'accent')}
      ${box(487, 81, 55, 40, 'zᵢ')}${box(568, 81, 55, 40, 'zⱼ')}
      ${path('M542 101 H568', 'contrast-link')}${text(554, 152, 'align views', 'center')}
      ${text(554, 175, 'SimCLR / NT-Xent', 'center')}${text(554, 197, 'τ = 0.07', 'center accent')}
    `), svg(label, `
      ${text(25, 30, '224 × 224', 'accent')}
      ${patches}
      ${path('M177 126 H194', 'signal-flow')}${box(194, 90, 120, 72, 'ViT-B/16')}
      ${text(254, 188, 'FROZEN · 12L / 12H', 'center accent')}${text(39, 218, '14 × 14 patches')}
      ${path('M254 198 V237', 'signal-flow')}
      ${Array.from({ length: 12 }, (_, i) => `<rect x="${225 + i * 5}" y="238" width="3" height="35" class="embedding-cell" style="--i:${i}"/>`).join('')}
      ${text(254, 296, '768-d token', 'center accent')}
      ${text(25, 333, 'SimCLR / NT-Xent', 'accent')}${text(25, 358, 'align augmented views · τ = 0.07')}
    `, '0 0 340 380'));
  }

  function fusion() {
    const label = 'Images, numeric IOP measurements, and demographics form 768-dimensional tokens. A two-layer, eight-head temporal transformer produces a CLS representation and sigmoid risk.';
    return responsive(svg(label, `
      ${text(25, 25, 'MULTIMODAL TOKENS', 'accent')}
      ${box(25, 48, 135, 36, 'image + context')}
      ${box(25, 107, 135, 36, 'IOP → MLP')}
      ${box(25, 166, 135, 36, 'demographics → MLP')}
      ${text(25, 230, 'all tokens: 768-d')}
      ${path('M160 66 H209 V125 H265', 'signal-flow')}
      ${path('M160 125 H265', 'signal-flow flow-two')}
      ${path('M160 184 H209 V125', 'signal-flow flow-three')}
      ${box(265, 60, 156, 130, '')}
      ${box(280, 79, 126, 32, 'attention + FFN', 'transformer-layer')}
      ${box(280, 127, 126, 32, 'attention + FFN', 'transformer-layer')}
      ${text(343, 218, '2 layers · 8 heads', 'center accent')}
      ${path('M421 125 H467', 'signal-flow')}
      ${box(467, 104, 48, 42, 'CLS', 'accent-box')}
      ${path('M515 125 H553', 'signal-flow')}
      ${text(549, 86, 'MLP', 'center')}
      <circle cx="580" cy="125" r="26" class="risk-node"/>
      ${text(580, 131, 'σ', 'center risk-symbol')}
      ${text(580, 185, 'risk', 'center accent')}${text(580, 206, 'p̂ ∈ [0, 1]', 'center')}
    `), svg(label, `
      ${text(15, 25, '768-d TOKENS', 'accent')}
      ${box(15, 48, 125, 36, 'image + context')}${box(15, 107, 125, 36, 'IOP → MLP')}${box(15, 166, 125, 36, 'demo → MLP')}
      ${path('M140 66 H166 V125 H200', 'signal-flow')}${path('M140 125 H200', 'signal-flow flow-two')}${path('M140 184 H166 V125', 'signal-flow flow-three')}
      ${box(200, 48, 124, 156, '')}${box(212, 78, 100, 32, 'attn + FFN', 'transformer-layer')}${box(212, 140, 100, 32, 'attn + FFN', 'transformer-layer')}
      ${text(262, 226, '2 layers · 8 heads', 'center accent')}
      ${path('M262 236 V260 H122', 'signal-flow')}${box(75, 243, 47, 34, 'CLS', 'accent-box')}
      ${path('M99 277 V304 H242', 'signal-flow')}${text(170, 291, 'MLP', 'center')}
      <circle cx="263" cy="304" r="21" class="risk-node"/>${text(263, 311, 'σ', 'center risk-symbol')}${text(263, 353, 'risk p̂ ∈ [0,1]', 'center accent')}
    `, '0 0 340 375'));
  }

  function findings() {
    const dots = Array.from({ length: 3107 }, (_, i) => `<rect x="${30 + (i % 74) * 7.8}" y="${23 + Math.floor(i / 74) * 4.3}" width="3.3" height="2" class="${i < 64 ? 'positive-window' : 'negative-window'}"/>`).join('');
    const label = 'Each mark is one evaluated prospective window: 64 event windows and 3043 non-event windows. Marks are a count visualization, not patient records.';
    const mobileDots = Array.from({ length: 3107 }, (_, i) => `<rect x="${15 + i % 44 * 7.2}" y="${15 + Math.floor(i / 44) * 2.5}" width="3" height="1.4" class="${i < 64 ? 'positive-window' : 'negative-window'}"/>`).join('');
    return responsive(svg(label, `${dots}${text(30, 228, '64 EVENT WINDOWS', 'accent')}${text(330, 228, '3,043 NON-EVENT WINDOWS')}`), svg(label, `${mobileDots}${text(15, 221, '64 EVENT WINDOWS', 'accent')}${text(15, 243, '3,043 NON-EVENT WINDOWS')}`, '0 0 340 260'));
  }

  function ablations() {
    const rows = [['All inputs', .8317, 'baseline'], ['Images masked', .7946, 'masked'], ['IOP masked', .6894, 'masked']];
    const label = 'Exploratory epoch-45 inference-time ablations. ROC AUC: all inputs 0.8317, images masked 0.7946, IOP masked 0.6894. No retraining.';
    return responsive(svg(label, `
      ${[0, .25, .5, .75, 1].map((v) => `${path(`M${163 + v * 366} 33 V209`, 'plot-grid')}${text(163 + v * 366, 231, v.toFixed(v === 0 || v === 1 ? 0 : 2), 'center')}`).join('')}
      ${rows.map(([label, value, delta], i) => `${text(25, 64 + i * 65, label)}<rect x="163" y="${46 + i * 65}" width="${value * 366}" height="24" class="ablation-bar bar-${i}" style="--i:${i}"/>${text(552, 64 + i * 65, value.toFixed(4), 'accent')}${text(552, 83 + i * 65, delta, 'tiny')}`).join('')}
    `), svg(label, `
      ${[0, .25, .5, .75, 1].map((v) => `${path(`M${15 + v * 307} 29 V232`, 'plot-grid')}${text(15 + v * 307, 250, v.toFixed(v === 0 || v === 1 ? 0 : 2), 'center')}`).join('')}
      ${rows.map(([name, value], i) => `${text(15, 25 + i * 75, name)}${text(281, 25 + i * 75, value.toFixed(4), 'accent')}<rect x="15" y="${39 + i * 75}" width="${value * 307}" height="24" class="ablation-bar bar-${i}"/>`).join('')}
    `, '0 0 340 265'));
  }

  const chapters = [
    {
      name: 'The question', label: '01 / PREDICTION TASK', title: 'Can history signal what comes next?',
      intro: 'Estimating six-month treatment-escalation risk from the scans and measurements already available at a clinical prediction time.',
      figure: timeline, caption: 'Schematic only. History grows; the prediction horizon stays fixed.',
      detailTitle: 'A clinically grounded target', detail: 'The outcome is selective laser trabeculoplasty (SLT) or qualifying glaucoma surgery in either eye—not medication escalation alone, and not a direct measure of biological progression.',
      secondTitle: 'Why it matters', second: 'A risk signal could help prioritize follow-up before treatment escalation. That is the intended use, not a demonstrated clinical benefit or a treatment recommendation.',
      extra: `<label class="history-control">EXPLORE THE WINDOW <input type="range" min="6" max="30" step="6" value="18" aria-label="Illustrative months of available history"/><output>18 months of history → next 6 months</output></label>`,
    },
    {
      name: 'Image encoder', label: '02 / VISUAL REPRESENTATION', title: 'Learn the image. Keep the sequence.',
      intro: 'A self-supervised vision transformer compresses each OCT, visual-field image, or fundus photograph into one 768-dimensional token.',
      figure: encoder, caption: 'Synthetic patch texture—not a scan. One token per image; the encoder is frozen during downstream training.',
      detailTitle: 'Contrastive pretraining', detail: 'SimCLR brings augmented views of the same image together in representation space. The ImageNet-initialized ViT-B/16 is pretrained only on training-patient images.',
      secondTitle: 'Preserve the clinical context', second: 'Each image stays separate, retaining modality, eye side, and relative time. There is no visit-level image fusion before the temporal model.',
      extra: `<div class="science-equation"><span>NT-XENT · SCHEMATIC PAIR LOSS</span><math display="block" aria-label="Loss is negative log of exponentiated positive-pair similarity divided by the sum of exponentiated similarities to all other batch views"><mrow><msub><mi>ℓ</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><mo>−</mo><mi mathvariant="normal">log</mi><mfrac><mrow><mi mathvariant="normal">exp</mi><mo>(</mo><mi mathvariant="normal">sim</mi><mo>(</mo><msub><mi>z</mi><mi>i</mi></msub><mo>,</mo><msub><mi>z</mi><mi>j</mi></msub><mo>)</mo><mo>/</mo><mi>τ</mi><mo>)</mo></mrow><mrow><munder><mo>∑</mo><mrow><mi>k</mi><mo>≠</mo><mi>i</mi></mrow></munder><mi mathvariant="normal">exp</mi><mo>(</mo><mi mathvariant="normal">sim</mi><mo>(</mo><msub><mi>z</mi><mi>i</mi></msub><mo>,</mo><msub><mi>z</mi><mi>k</mi></msub><mo>)</mo><mo>/</mo><mi>τ</mi><mo>)</mo></mrow></mfrac></mrow></math><a href="https://arxiv.org/abs/2002.05709" target="_blank" rel="noopener">Framework: SimCLR ↗</a></div>`,
    },
    {
      name: 'Temporal fusion', label: '03 / MULTIMODAL TRANSFORMER', title: 'Different signals. One patient history.',
      intro: 'Image tokens, intraocular pressure (IOP), and demographics enter a compact temporal transformer that learns relationships across an irregular clinical record.',
      figure: fusion, caption: 'Architecture schematic. Moving signals illustrate data flow—not learned attention weights.',
      detailTitle: 'Context is part of the token', detail: 'Image embeddings receive learned modality, eye, time, and type embeddings, plus masked projections of 13 OCR features, 7 longitudinal scalar features, and a 768-d visual change representation.',
      secondTitle: 'From sequence to risk', second: 'Two transformer layers with eight heads aggregate the tokens. A learned CLS representation feeds an MLP and sigmoid output, trained with binary cross-entropy. Missing auxiliary features are masked.',
      extra: `<div class="science-equation"><span>SCALED DOT-PRODUCT ATTENTION</span>${attention}<a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noopener">Framework: Transformer ↗</a></div>`,
    },
    {
      name: 'Key findings', label: '04 / HELD-OUT EVALUATION', title: 'A rare event. A measurable signal.',
      intro: 'At the primary epoch-49 checkpoint, the model discriminates treatment-escalation windows in an internal, patient-held-out test set.',
      figure: findings, caption: 'Each mark = one evaluated window. Multiple windows can belong to one patient; these are not 3,107 unique patients.',
      detailTitle: 'Read both metrics', detail: 'ROC AUC describes discrimination. Average precision summarizes precision–recall performance; with events in only 2.06% of windows, it adds crucial context. Neither metric establishes a safe clinical threshold.',
      secondTitle: 'The next validation step', second: 'This is a single-center retrospective study with prospectively defined prediction windows—not a prospective clinical trial. External and temporal validation, calibration, and patient-clustered uncertainty remain needed.',
      extra: `<dl class="result-metrics"><div><dt>ROC AUC</dt><dd>0.8326</dd></div><div><dt>AVERAGE PRECISION</dt><dd>0.1230</dd></div><div><dt>EVENT WINDOWS</dt><dd>64<span> / 3,107</span></dd></div></dl>`,
    },
    {
      name: 'Model dependence', label: '05 / EXPLORATORY ABLATION', title: 'What does the model lean on?',
      intro: 'Masking an input at inference time probes how the trained model depends on it. IOP removal produces a much larger loss in discrimination than image removal.',
      figure: ablations, caption: 'ROC AUC on a 0–1 axis. Separate exploratory epoch-45 checkpoint; not the primary epoch-49 evaluation.',
      detailTitle: 'IOP is a strong signal', detail: 'The all-input model scores 0.8317. Masking images lowers AUC to 0.7946; masking IOP lowers it to 0.6894. These are selected ablations, not a complete ranking of all inputs.',
      secondTitle: 'Dependence is not causation', second: 'The model is not retrained after masking. These tests reveal sensitivity to missing inputs—not causal importance, an optimized reduced-input model, or proof that any modality is dispensable.',
      extra: `<p class="ablation-note">INFERENCE-TIME MASKING · NO RETRAINING · EPOCH 45</p>`,
    },
  ];

  window.mountUCSFResearch = (root) => {
    root.innerHTML = `<section class="ucsf-explorer" aria-label="UCSF glaucoma research explainer">
      <header class="science-project-header"><p>UCSF / GLAUCOMA RESEARCH</p><span>MANUSCRIPT IN PREPARATION · UNPUBLISHED</span></header>
      <div class="science-layout"><nav class="science-nav" aria-label="Research chapters">${chapters.map((c, i) => `<button type="button" data-chapter="${i}" aria-controls="science-chapter"><span>${String(i + 1).padStart(2, '0')}</span>${c.name}<i aria-hidden="true">↗</i></button>`).join('')}<p>↑ ↓ chapters<br/>← → research</p></nav>
      <section class="science-chapter" id="science-chapter" aria-labelledby="science-title"></section></div>
      <footer class="science-footer"><button type="button" data-science-step="-1" aria-label="Previous research chapter">↑ PREVIOUS</button><span class="science-position" aria-live="polite"></span><button type="button" data-science-step="1" aria-label="Next research chapter">NEXT ↓</button></footer>
    </section>`;
    let current = 0;
    let paused = false;
    const panel = root.querySelector('.science-chapter');
    const buttons = [...root.querySelectorAll('[data-chapter]')];
    const show = (index) => {
      current = (index + chapters.length) % chapters.length;
      const c = chapters[current];
      buttons.forEach((b, i) => { if (i === current) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
      panel.innerHTML = `<p class="science-kicker">${c.label}</p><h3 id="science-title">${c.title}</h3><p class="science-intro">${c.intro}</p>
        <figure class="science-figure${paused ? ' is-paused' : ''}"><div class="science-figure-toolbar"><span>${current === 3 ? 'EVALUATED WINDOW COUNTS' : current === 4 ? 'REPORTED ABLATION RESULTS' : 'INTERACTIVE SCHEMATIC'}</span>${[0, 1, 2].includes(current) ? `<button type="button" class="science-pause" aria-pressed="${paused}" aria-label="${paused ? 'Resume diagram animation' : 'Pause diagram animation'}">${paused ? 'PLAY ▷' : 'PAUSE Ⅱ'}</button>` : ''}</div>${c.figure()}<figcaption>${c.caption}</figcaption></figure>
        ${c.extra}<div class="science-copy"><section><h4>${c.detailTitle}</h4><p>${c.detail}</p></section><section><h4>${c.secondTitle}</h4><p>${c.second}</p></section></div>`;
      root.querySelector('.science-position').textContent = `${String(current + 1).padStart(2, '0')} / 05 · ${c.name}`;
      const pause = panel.querySelector('.science-pause');
      if (pause) pause.addEventListener('click', () => {
        paused = !paused;
        panel.querySelector('.science-figure').classList.toggle('is-paused', paused);
        pause.setAttribute('aria-pressed', String(paused));
        pause.setAttribute('aria-label', paused ? 'Resume diagram animation' : 'Pause diagram animation');
        pause.textContent = paused ? 'PLAY ▷' : 'PAUSE Ⅱ';
      });
      const slider = panel.querySelector('input[type="range"]');
      if (slider) slider.addEventListener('input', () => {
        panel.querySelector('output').textContent = `${slider.value} months of history → next 6 months`;
        panel.querySelectorAll('.history-token').forEach((token, i) => token.classList.toggle('is-hidden', i % 5 >= Number(slider.value) / 6));
      });
      if (slider) slider.dispatchEvent(new Event('input'));
    };
    buttons.forEach((button) => button.addEventListener('click', () => show(Number(button.dataset.chapter))));
    root.querySelectorAll('[data-science-step]').forEach((button) => button.addEventListener('click', () => show(current + Number(button.dataset.scienceStep))));
    show(0);
    return { step: (direction) => show(current + direction) };
  };
})();
