/**
 * Script to remove hardcoded navbars from all HTML files and inject navbar-loader.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve('.');

// Recursively find all HTML files
function findHtmlFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'imp-unlinkedFiles') continue;
      results = results.concat(findHtmlFiles(fullPath));
    } else if (entry.name.endsWith('.html') && entry.name !== 'navbar.html') {
      results.push(fullPath);
    }
  }
  return results;
}

function removeNavbar(content) {
  // Match any nav element with class attribute, including multi-line content
  const navRegex = /<nav\s+class="[^"]*"[^>]*>[\s\S]*?<\/nav>/gi;
  return content.replace(navRegex, '<div id="navbar-placeholder"></div>');
}

function hasLoader(content) {
  return content.includes('navbar-loader.js');
}

function hasNavbarCss(content) {
  return content.includes('navbar.css');
}

function hasStyleCss(content) {
  return content.includes('style.css');
}

function addLoaderToHead(content) {
  let insertions = '';
  
  if (!hasStyleCss(content) && !hasNavbarCss(content)) {
    insertions += '    <link rel="stylesheet" href="/assets/css/navbar.css">\n';
  }
  
  if (!hasLoader(content)) {
    insertions += '    <script src="/assets/js/navbar-loader.js" defer><\/script>\n';
  }
  
  if (!insertions) return content;
  
  return content.replace('</head>', insertions + '</head>');
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  const hasNav = /<nav\s/i.test(content);
  
  if (hasNav) {
    content = removeNavbar(content);
  }
  
  content = addLoaderToHead(content);
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    const rel = path.relative(ROOT, filePath);
    console.log('[UPDATED] ' + rel + (hasNav ? ' (nav removed)' : ' (loader added only)'));
    return true;
  } else {
    const rel = path.relative(ROOT, filePath);
    console.log('[SKIPPED] ' + rel);
    return false;
  }
}

const files = findHtmlFiles(ROOT);
console.log('Found ' + files.length + ' HTML files\n');

let updated = 0;
let skipped = 0;

for (const file of files) {
  if (processFile(file)) {
    updated++;
  } else {
    skipped++;
  }
}

console.log('\n=== Summary ===');
console.log('Updated: ' + updated);
console.log('Skipped: ' + skipped);
console.log('Total: ' + files.length);
