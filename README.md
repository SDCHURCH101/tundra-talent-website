# Tundra Talent — Website

Static marketing site for **Tundra Talent**, an Alaska skilled-trades staffing company serving
oil &amp; gas (upstream, midstream, downstream), mining, and construction.

## Stack
Plain HTML / CSS / JS. No framework, no build step. Fonts: Archivo + Inter (Google Fonts).
Shared `assets/styles.css` and `assets/app.js`; header/footer duplicated per page.

## Pages
- `index.html` — Home
- `services.html` — Workforce Solutions (staffing models, turnkey process, FIFO/DIDO mobilization, man-camp housing)
- `industries.html` — Oil &amp; Gas (up/mid/downstream), Mining, Construction
- `safety.html` — Safety &amp; Technology
- `about.html` — Company, offices, leadership
- `contact.html` — Request Talent / Find Work forms + offices

## Contact form
Demo mode: `data-demo="true"` forms validate client-side and show a success panel. They do **not**
send anywhere yet. To receive real submissions, wire up Netlify Forms / Formspree / an endpoint
and remove `data-demo`.

## Brand
Navy `#0A3A5E`, deep arctic `#06223A`, glacier blue `#19A0D8`, ice `#E8F1F8`.
Logo in `assets/img/tundra-logo.png` (color, for light) and `tundra-logo-white.png` (knockout, for dark).

## Deploy
Intended for GitHub Pages with custom domain `www.tundra-talent.com`
(rename `CNAME.ready` to `CNAME` at cutover). All canonical/OG/sitemap URLs use that domain.
