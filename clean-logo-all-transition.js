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
  if (c.includes('.logo ') || c.includes('.logo{') || c.includes('.logo {')) {
    // Replace transition inside .logo bounds
    const replaced = c.replace(/\.logo\s*\{[^}]*transition:\s*all\s*0\.3s\s*ease;?[^}]*\}/g, match => {
      return match.replace(/transition:\s*all\s*0\.3s\s*ease;?/g, 'transition: transform 0.3s ease, color 0.3s ease;');
    });
    if (replaced !== c) {
      fs.writeFileSync(f, replaced, 'utf8');
      u++;
      console.log(`Updated ${f}`);
    }
  }
});
console.log(`Total CSS updated: ${u}`);
