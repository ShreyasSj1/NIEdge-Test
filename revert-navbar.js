const fs = require('fs');
const path = require('path');

const ROOT = path.resolve('.');

// The hardcoded navbar to inject
const NAVBAR_HTML = `<nav class="navbar" style="will-change: transform">
  <div class="container">
    <a href="#" class="logo">
      <img
        src="/assets/images/LOGO.jpg"
        class="logo-image"
        alt="NIEdge Logo"
      />
    </a>
    <div class="nav-links">
      <a href="/index.html#home">HOME</a>
      <a href="/work-in-progress.html">EVENTS</a>
      <a href="/index.html#academics">ACADEMICS</a>
      <a href="/index.html#skills-new">SKILLS</a>
      <a href="/form.html">FEEDBACK</a>
      <a href="/index.html#about">ABOUT US</a>
    </div>
    <div class="hamburger">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>
  </div>
</nav>`;

// Pages that should NOT get the navbar
const SKIP = ['navbar.html', 'form.html', 'work-in-progress.html'];

function findHtmlFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['.git', 'node_modules', 'imp-unlinkedFiles'].includes(entry.name)) continue;
      results = results.concat(findHtmlFiles(fullPath));
    } else if (entry.name.endsWith('.html') && !SKIP.includes(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // 1. Replace placeholder with actual navbar
  content = content.replace('<div id="navbar-placeholder"></div>', NAVBAR_HTML);

  // 2. Remove navbar-loader.js script tag (handles both \n and \r\n)
  content = content.replace(/[ \t]*<script src="\/assets\/js\/navbar-loader\.js" defer><\/script>\r?\n/g, '');

  // 3. Remove navbar.css link tag (handles both \n and \r\n)
  content = content.replace(/[ \t]*<link rel="stylesheet" href="\/assets\/css\/navbar\.css">\r?\n/g, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    const rel = path.relative(ROOT, filePath);
    console.log('[UPDATED] ' + rel);
    return true;
  }
  const rel = path.relative(ROOT, filePath);
  console.log('[SKIPPED] ' + rel);
  return false;
}

const files = findHtmlFiles(ROOT);
console.log('Found ' + files.length + ' HTML files\n');

let updated = 0;
for (const file of files) {
  if (processFile(file)) updated++;
}

console.log('\n=== Summary ===');
console.log('Updated: ' + updated);
console.log('Skipped: ' + (files.length - updated));
console.log('Total: ' + files.length);
