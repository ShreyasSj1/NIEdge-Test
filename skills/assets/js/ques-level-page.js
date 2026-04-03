(function () {
  const TOTAL_LEVELS = 100;
  const SIDE_PAD = 70;

  const board = document.getElementById('px-board');
  const canvas = document.getElementById('px-canvas');
  const svg = document.getElementById('px-trace');
  const nodesWrap = document.getElementById('px-nodes');
  const miniSvg = document.getElementById('px-mini-svg');
  const miniJumps = document.getElementById('px-mini-jumps');
  if (!board) return;

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const debounce = (fn, ms = 150) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const cssNodeSize = () => {
    const s = getComputedStyle(document.documentElement).getPropertyValue('--px-node-size').trim();
    const n = parseFloat(s); return isNaN(n) ? 80 : n;
  };

  function makeCurveFns(width) {
    const nodeR = cssNodeSize() / 2;
    const left = SIDE_PAD + nodeR + 6;
    const right = width - SIDE_PAD - nodeR - 6;
    const centerX = (left + right) / 2;
    const halfSpan = (right - left) / 2;

    const A = halfSpan * 0.96;
    const lambda = Math.max(320, window.innerHeight * 0.85);
    const omega = (2 * Math.PI) / lambda;
    const hAmp = A * 0.12;
    const hMul = 2.2;
    const phase = 0;

    const xOfY = (y) =>
      centerX + A * Math.sin(omega * y + phase) + hAmp * Math.sin(hMul * omega * y + 0.8);

    return { xOfY, left, right, A, lambda };
  }

  function sampleEqualSpacing(xOfY, yStart, yEnd, count) {
    const dy = 2;
    const pts = [];
    for (let y = yStart; y <= yEnd; y += dy) {
      pts.push({ x: xOfY(y), y });
    }
    const L = [0];
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i].x - pts[i - 1].x;
      const dy2 = pts[i].y - pts[i - 1].y;
      L.push(L[i - 1] + Math.hypot(dx, dy2));
    }
    const total = L[L.length - 1];

    const out = [];
    let j = 1;
    for (let k = 0; k < count; k++) {
      const target = (k * total) / (count - 1);
      while (j < L.length && L[j] < target) j++;
      if (j >= L.length) { out.push(pts[pts.length - 1]); break; }
      const t = (target - L[j - 1]) / (L[j] - L[j - 1] || 1);
      const x = pts[j - 1].x + t * (pts[j].x - pts[j - 1].x);
      const y = pts[j - 1].y + t * (pts[j].y - pts[j - 1].y);
      out.push({ x, y });
    }
    return out;
  }

  function build() {
    svg.innerHTML = '';
    nodesWrap.innerHTML = '';
    miniSvg.innerHTML = '';
    miniJumps.innerHTML = '';

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;

    const targetVisible = 11;
    const yAvg = window.innerHeight / targetVisible;

    const yStart = 70;
    const yEnd = yStart + (TOTAL_LEVELS - 1) * yAvg * 0.95;

    const { xOfY } = makeCurveFns(width);
    const pts = sampleEqualSpacing(xOfY, yStart, yEnd, TOTAL_LEVELS);

    const totalHeight = pts[pts.length - 1].y + cssNodeSize() * 1.9;
    canvas.style.height = totalHeight + 'px';

    const defs = createDefs(svg);
    svg.appendChild(defs);

    const d = catmullRomPath(pts, 0.32);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);

    // Create nodes with proper HTML href links
    for (let i = 0; i < TOTAL_LEVELS; i++) {
      const levelNumber = i + 1;
      const p = pts[i];
      const a = document.createElement('a');
      a.className = 'px-node';
      a.href = `/skills/ques-page/PQ${levelNumber}.html`;
      a.id = `px-level-${levelNumber}`;
      a.setAttribute('aria-label', `Practice Level P${levelNumber}`);
      a.style.left = p.x + 'px';
      a.style.top = p.y + 'px';
      a.innerHTML = `<span>P${levelNumber}</span>`;
      nodesWrap.appendChild(a);
    }

    buildMiniMap(pts);

    // Create decade jump links (HTML anchors instead of buttons)
    for (let k = 0; k < 10; k++) {
      const start = k * 10 + 1;
      const a = document.createElement('a');
      a.href = `/skills/ques-page/PQ${start}.html`;
      a.textContent = `P${start}`;
      a.title = `Jump to P${start}`;
      miniJumps.appendChild(a);
    }

    highlightOnScroll(pts);
  }

  function createDefs(svgRoot) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    grad.setAttribute('id', 'px-stroke');
    grad.setAttribute('x1', '0%'); grad.setAttribute('y1', '0%');
    grad.setAttribute('x2', '0%'); grad.setAttribute('y2', '100%');

    const s1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    s1.setAttribute('offset', '0%');    s1.setAttribute('stop-color', '#ffb347');
    const s2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    s2.setAttribute('offset', '50%');   s2.setAttribute('stop-color', '#ff9500');
    const s3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    s3.setAttribute('offset', '100%');  s3.setAttribute('stop-color', '#ff7a00');

    grad.append(s1, s2, s3);
    defs.appendChild(grad);
    return defs;
  }

  function buildMiniMap(points) {
    const w = 180, h = 210;
    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));

    const mPts = points.map(p => ({
      x: map(p.x, minX, maxX, 10, w - 10),
      y: map(p.y, minY, maxY, 10, h - 10)
    }));

    const pathD = catmullRomPath(mPts, 0.34);
    miniSvg.setAttribute('viewBox', `0 0 ${w} ${h}`);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathD);
    miniSvg.appendChild(path);

    for (let i = 0; i < points.length; i += 10) {
      const src = mPts[i];
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', src.x);
      dot.setAttribute('cy', src.y);
      dot.setAttribute('r', 4.5);
      
      // Create a clickable link for each dot
      const link = document.createElementNS('http://www.w3.org/2000/svg', 'a');
      link.setAttribute('href', `/skills/ques-page/PQ${i + 1}.html`);
      link.setAttribute('title', `Go to P${i + 1}`);
      link.appendChild(dot);
      
      miniSvg.appendChild(link);
    }
  }

  function catmullRomPath(pts, tension = 0.5) {
    if (pts.length < 2) return '';
    const d = [];
    const p = (i) => pts[ Math.min(pts.length - 1, Math.max(0, i)) ];
    d.push(`M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`);
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2);
      const cp1x = p1.x + (p2.x - p0.x) * tension * 0.5;
      const cp1y = p1.y + (p2.y - p0.y) * tension * 0.5;
      const cp2x = p2.x - (p3.x - p1.x) * tension * 0.5;
      const cp2y = p2.y - (p3.y - p1.y) * tension * 0.5;
      d.push(`C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`);
    }
    return d.join(' ');
  }

  function highlightOnScroll(points) {
    const nodes = Array.from(document.querySelectorAll('.px-node'));
    const yList = points.map(p => p.y);
    const onScroll = () => {
      const viewMiddle = window.scrollY + window.innerHeight / 2;
      let idx = 0, best = Infinity;
      for (let i = 0; i < yList.length; i++) {
        const d = Math.abs(yList[i] - viewMiddle);
        if (d < best) { best = d; idx = i; }
      }
      nodes.forEach((el, i) => {
        const intensity = Math.max(0, 1 - Math.abs(i - idx) / 8);
        el.style.filter = `drop-shadow(0 6px 12px rgba(255,149,0,${0.25 * intensity}))`;
        el.style.transform = `translateZ(0) scale(${1 + 0.035 * intensity})`;
      });
    };
    onScroll();
    document.addEventListener('scroll', debounce(onScroll, 60), { passive: true });
  }

  function map(v, a, b, c, d) {
    const t = (v - a) / (b - a || 1);
    return c + t * (d - c);
  }

  const runBuild = () => {
    if (window.matchMedia('(max-width: 767.98px)').matches) return;
    build();
  };
  runBuild();
  window.addEventListener('resize', debounce(runBuild, 250));
})();