# REAP Website

Static rebuild of [reapwestafrica.org](https://www.reapwestafrica.org), the website of
Restoration of Educational Advancement Programs (REAP), Bentol City, Liberia.

Plain HTML, CSS and JavaScript — no build step and no dependencies. It can be hosted on
any static host (GitHub Pages, Netlify, Cloudflare Pages, or regular web hosting).

## Preview locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Pages

| Page | File | Original URL |
|---|---|---|
| Home | `index.html` | `/` |
| Founder & History | `founder-history.html` | `/about-5` |
| Mission & Vision | `mission-vision.html` | `/general-4` |
| Core Values & Target | `core-values.html` | `/copy-of-mission-vision` |
| Gallery | `gallery.html` | `/projects-7` |
| PLI Seminars | `pli-seminars.html` | `/pli-seminars` |
| REAP-VTCI | `reap-vtci.html` | `/reap-vtci` |
| VAT-ECDC | `vat-ecdc.html` | `/vat-ecdc` |
| FICM-USA | `ficm-usa.html` | `/who-we-are` |
| Blog | `blog.html` and `blog/*.html` | `/blog`, `/post/*` |
| Contact | `contact.html` | `/contact` |
| Search results | `search.html` | — |

## Files

- `assets/css/style.css` — all styles (colors are defined at the top).
- `assets/js/main.js` — menu, events calendar, gallery viewer, forms and search.
- `assets/js/search-index.js` — page text used by the search box.
- `assets/img/` — photos and logo; `assets/docs/` — PDF documents.

## Connecting the forms

The newsletter and contact forms are not connected to anything yet. To make them send email,
sign up for a form service (for example Formspree), then paste its endpoint URL into
`FORM_ENDPOINT` at the top of `assets/js/main.js`.

## Editing the menu

The header and footer are repeated in every page. If you change the menu, update it in each
`.html` file.
