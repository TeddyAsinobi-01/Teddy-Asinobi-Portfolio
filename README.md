# Teddy Asinobi: Portfolio

Personal portfolio for Teddy Asinobi, front-end developer and vibe coder in Nigeria.
Plain HTML, CSS and JavaScript. No build step, no frameworks, no icon scripts.

## Run it
Open `index.html` in a browser, or serve the folder with any static host (Netlify, Vercel, GitHub Pages).

## Structure
```
index.html            Page markup (icons are an inline SVG sprite)
css/style.css         Design tokens, components, sections, responsive rules
js/main.js            Mobile menu, accessible tabs, nav highlight, contact form
assets/img/           Portrait and optimised project screenshots (WebP)
assets/icons/         Favicon set (SVG, ICO, PNG, Apple touch icon)
assets/logo.png       Logo lockup on a transparent background
assets/og-image.png   Social sharing image (1200x630)
documents/            CV (PDF and DOCX)
site.webmanifest      Install/theme metadata
```

## Common edits
- **Colours:** change the variables at the top of `css/style.css` (`:root`).
- **Add a project:** copy one `<article class="project">` block in `index.html` and add a WebP screenshot to `assets/img/projects/`.
- **Contact form:** messages post to the Google Apps Script URL in `FORM_ENDPOINT` at the top of `js/main.js`.
- **Social sharing:** once the site is live, change `og:image` in `index.html` to the full URL (for example `https://yourdomain.com/assets/og-image.png`).

## Fonts
Bricolage Grotesque and Instrument Sans load from Google Fonts. If they can't load, the page falls back to Inter and then the system font.
