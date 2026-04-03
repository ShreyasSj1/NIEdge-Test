const fs = require('fs');
const path = require('path');
function getCss(dir) {
  let res = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && !['.git', 'node_modules'].includes(e.name)) {
      res = res.concat(getCss(p));
    } else if (e.name.endsWith('.css')) {
      res.push(p);
    }
  }
  return res;
}
const files = getCss('.');
let u = 0;
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  if (c.includes('.logo-image') && c.includes('transition: all 0.3s ease;')) {
    // Replace transition inside .logo-image bounds
    const replaced = c.replace(/\.logo-image\s*\{[^}]*transition:\s*all\s*0\.3s\s*ease;?[^}]*\}/g, match => {
      return match.replace(/\s*transition:\s*all\s*0\.3s\s*ease;?/g, '');
    });
    if (replaced !== c) {
      fs.writeFileSync(f, replaced, 'utf8');
      u++;
      console.log(`Updated ${f}`);
    }
  }
});
console.log(`Total CSS updated: ${u}`);
