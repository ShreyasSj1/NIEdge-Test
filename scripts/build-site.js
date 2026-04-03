const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CONFIG = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data", "site-config.json"), "utf8")
);

const SKIP_DIRS = new Set([".git", "node_modules", "imp-unlinkedFiles"]);
const SKIP_HTML = new Set(["navbar.html"]);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {
        files = files.concat(walk(fullPath));
      }
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html") && !SKIP_HTML.has(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function renderNavbar() {
  const links = CONFIG.navigation.items
    .map(
      (item) =>
        `      <a href="${item.href}">${item.label}</a>`
    )
    .join("\n");

  return `<nav class="navbar" style="will-change: transform">
  <div class="container">
    <a href="${CONFIG.navigation.logoHref}" class="logo">
      <img
        src="/assets/images/LOGO.jpg"
        class="logo-image"
        alt="${CONFIG.navigation.logoAlt}"
      />
    </a>
    <div class="nav-links">
${links}
    </div>
    <div class="hamburger" aria-label="Toggle navigation" role="button" tabindex="0">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>
  </div>
</nav>
`;
}

function ensureHeadIncludes(content, hrefOrSrc, tagMarkup) {
  if (content.includes(hrefOrSrc)) {
    return content;
  }

  return content.replace("</head>", `${tagMarkup}\n</head>`);
}

function stripInlineNavbarScripts(content) {
  const scriptBlocks = [
    /<!--\s*Navbar script\s*-->[\s\S]*?<\/script>\s*/gi,
    /<script>\s*document\.addEventListener\('DOMContentLoaded', function\(\) \{\s*const hamburger = document\.querySelector\('\.hamburger'\);[\s\S]*?<\/script>\s*/gi
  ];

  return scriptBlocks.reduce((current, pattern) => current.replace(pattern, ""), content);
}

function migrateNavbar(content) {
  const navRegex = /<nav\s+class="navbar"[^>]*>[\s\S]*?<\/nav>\s*/i;
  if (!navRegex.test(content)) {
    return content;
  }

  return content.replace(navRegex, '<div id="navbar-placeholder"></div>\n');
}

function processHtml(filePath) {
  const original = fs.readFileSync(filePath, "utf8");
  let content = original;

  const hadNavbar = /<nav\s+class="navbar"/i.test(content);
  if (hadNavbar) {
    content = migrateNavbar(content);
    content = stripInlineNavbarScripts(content);
    content = ensureHeadIncludes(
      content,
      "/assets/js/navbar-loader.js",
      '    <script src="/assets/js/navbar-loader.js" defer></script>'
    );

    if (
      !content.includes("/assets/css/navbar.css") &&
      !content.includes("/assets/css/style.css")
    ) {
      content = ensureHeadIncludes(
        content,
        "/assets/css/navbar.css",
        '    <link rel="stylesheet" href="/assets/css/navbar.css">'
      );
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    return true;
  }

  return false;
}

function writeNavbarFile() {
  const navbarPath = path.join(ROOT, "navbar.html");
  fs.writeFileSync(navbarPath, renderNavbar(), "utf8");
}

function main() {
  writeNavbarFile();

  const files = walk(ROOT);
  let updated = 0;

  for (const file of files) {
    if (processHtml(file)) {
      updated += 1;
      console.log(`updated ${path.relative(ROOT, file)}`);
    }
  }

  console.log(`navbar regenerated`);
  console.log(`html files scanned: ${files.length}`);
  console.log(`html files updated: ${updated}`);
}

main();
