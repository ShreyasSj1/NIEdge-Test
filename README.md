# NIEdge

NIEdge is a static student platform for academic resources, PYQs, notes, and skills content. The site is still pure HTML/CSS/JavaScript, but the repo now includes a small build-maintenance layer so shared navigation and content updates do not require hand-editing every page.

## Local Development

1. Clone the repository.
2. Open the root folder in VS Code.
3. Run a local static server such as Live Server.
4. Start from [index.html](/Users/sj/Desktop/NIEdge-main/index.html).

## Project Structure

- `index.html`, `events.html`, `chooseYear.html`, `subject-list.html`: primary product entry points.
- `assets/css`, `assets/js`: shared styles and client-side scripts.
- `2ndYear`, `skills`: section-specific pages and assets.
- `data`: shared JSON data used by build scripts and client pages.
- `scripts`: repo maintenance scripts for shared layout generation and migrations.

## Shared Maintenance Workflow

- Run `node scripts/build-site.js` after changing shared navigation.
- Shared navigation is defined in `data/site-config.json`.
- Event content is defined in `data/events.json`.
- `navbar.html` is generated from config and injected into pages by `assets/js/navbar-loader.js`.

## Architecture Notes

- Static hosting friendly: no bundler or framework required.
- Shared layout is injected at runtime to avoid duplicated nav markup.
- Repeated event content has been moved into JSON instead of hardcoded routes in JavaScript.
- Placeholder routes are visibly labeled as "Coming soon" so unfinished sections are clearer to users.

## Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Optional local server tooling such as Live Server

## Known Constraints

- Much of the site is still page-based and content-heavy, so future cleanup should keep moving repeated subject/module data into structured files.
- Firebase is only used by the `work-in-progress` subscription form.
