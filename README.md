# Vansiwala Dresses — Handcrafted Poshak Website

Premium devotional e-commerce site for **Bal Gopal / Kanha Ji, Khatu Shyam Ji & other deities**.
Orders are placed directly on **WhatsApp: +91 96259 79355**.

Built with **HTML5 + Tailwind CSS (CDN) + vanilla JavaScript**. No build step needed.

---

## How to run locally

**Option A — with the dev server (recommended, enables edit mode)**

```bash
cd /Users/rohit/Downloads/vansiwala
/usr/bin/python3 tools/server.py
```

Open http://localhost:8080 in your browser.

**Option B — plain static server**

```bash
/usr/bin/python3 -m http.server 8080
```

**Option C — just open the file**

Double-click `index.html`. It works from `file://` too, because the catalog
is also bundled into `assets/js/data.js`. (Edit mode needs Option A.)

---

## Hidden Edit Mode — change price / category by clicking

The fastest way to fix prices and categories is the built-in **edit mode**.
It's hidden — regular visitors never see it.

1. Start the dev server: `/usr/bin/python3 tools/server.py`
2. Open **http://localhost:8080/#edit**
3. A bottom bar says **"Edit Mode"**. On every product card you'll now see:

   - **Category** dropdown — pick Bal Gopal Poshak / Khatu Shyam Ji / Accessories / Handmade Special
   - **Price (₹)** number box — type the real price
   - **Name** text box — optional title edit

4. Click **"Save to products.json"** when done. It writes `products.json`
   *and* refreshes `assets/js/data.js` automatically.
5. To exit, click **Exit** (or remove `#edit` from the URL).

> The site works exactly like the real catalog — browse, search, filter — while
> editing. Photos are the actual product images, so you can match each one visually.

---

## Project structure

```
vansiwala/
├── index.html              # Single-page site (header, hero, catalog, footer)
├── products.json           # ← EDIT THIS — your product catalog
├── package.json            # Build scripts (Tailwind CLI)
├── assets/
│   ├── css/
│   │   ├── input.css       # Tailwind entry + brand theme tokens
│   │   ├── custom.css      # ← EDIT THIS for hand-written styles
│   │   └── site.css        # COMPILED output (do not edit)
│   ├── js/
│   │   ├── data.js         # Auto-generated from products.json (don't edit)
│   │   └── main.js         # Rendering, filters, search, WhatsApp logic
│   └── products/           # ← PUT your product images here
└── tools/
    ├── generate_products.py # Scans images → updates products.json + data.js
    └── server.py            # Dev server + edit-mode save endpoint
```

## Rebuilding the CSS (Tailwind)

CSS is **precompiled** — no CDN needed at runtime. Only rebuild when you
change a class in `index.html`/`main.js` or styles in `custom.css`:

```bash
cd /Users/rohit/Downloads/vansiwala
npm install        # first time only
npm run build      # compile + minify -> assets/css/site.css
```

`npm run dev` watches files and rebuilds automatically while you work.

## Editing your products

`products.json` is the source of truth. Each product looks like:

```json
{
  "id": 1,
  "name": "Royal Stitched Poshak with Zari Work",
  "category": "bal-gopal-poshak",
  "price": 1799,
  "image": "0115EBDF-1FE0-4DEA-873A-82E31574304D.JPG",
  "warranty": true
}
```

- **name** — product title shown on the card.
- **category** — one of `bal-gopal-poshak`, `khatu-shyam`, `accessories`, `handmade-special`.
- **price** — in ₹ (Indian Rupees). Currency is set by the top-level `"currency"` field.
- **image** — must match the filename inside `assets/products/` exactly.
- **warranty** — set `false` to hide the "1-Yr Warranty" tag.

Top-level settings:

```json
"whatsapp": "919625979355",   // order number (country code, no + or spaces)
"hero": { "image": "", ... }  // set "image" to a filename to use it in the hero banner
```

### Adding new product images

1. Drop the image into `assets/products/`.
2. Run `python3 tools/generate_products.py`.

The script adds any new images as placeholder products (default title, price,
rotating category). It **never overwrites** the name/price/category you already
set for existing products — then it regenerates `assets/js/data.js` for you.

> Tip: to batch-assign prices, open `products.json`, use find & replace
> (e.g. `"price": 1999` → your real price), and re-run the script.

## Customising the design

- Colors, fonts and animations: `assets/css/style.css` (CSS variables at top) and the
  `tailwind.config` block in `index.html` (colors like `maroon`, `gold`, `cream`).
- Brand taglines, WhatsApp number, email and categories: edit directly in
  `index.html` and `products.json`.

## Hosting (when ready)

Upload the whole folder to any static host (Netlify, Vercel, Hostinger, GitHub Pages).
No server or database is needed — it's pure static files.
