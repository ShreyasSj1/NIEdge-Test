const fs = require('fs');
const path = require('path');

const ROOT = path.resolve('.');
const SKIP = ['navbar.html', 'form.html', 'work-in-progress.html'];

function findHtmlFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
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

const files = findHtmlFiles(ROOT);
let updated = 0;

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Only add navbar.css if the page does NOT already import style.css or navbar.css
  if (!content.includes('style.css') && !content.includes('navbar.css')) {
    // Insert before </head>
    const replacement = '    <link rel="stylesheet" href="/assets/css/navbar.css">\n</head>';
    const updated_content = content.replace('</head>', replacement);
    if (updated_content !== content) {
      fs.writeFileSync(filePath, updated_content, 'utf8');
      const rel = path.relative(ROOT, filePath);
      console.log('[UPDATED] ' + rel);
      updated++;
    }
  }
}

console.log('\nTotal updated: ' + updated);
