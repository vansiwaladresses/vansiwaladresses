/* ============================================================
   Vansiwala Dresses — main.js
   Renders the catalog, filters, search and WhatsApp ordering.
   Data source: window.VANSIWALA_DATA (from assets/js/data.js),
   generated from products.json.
   ============================================================ */

(function () {
  "use strict";

  var DATA = window.VANSIWALA_DATA || {
    brand: "Vansiwala Dresses",
    currency: "₹",
    whatsapp: "919625979355",
    categories: [],
    products: [],
  };

  var WHATSAPP = DATA.whatsapp || "919625979355";
  var CURRENCY = DATA.currency || "₹";

  /* Hidden edit mode: add #edit to the URL, e.g. http://localhost:8080/#edit */
  var EDIT_MODE = window.location.hash.indexOf("edit") !== -1;
  var WORK = DATA.products.slice();

  var state = {
    category: "all",
    query: "",
  };

  var grid = document.getElementById("product-grid");
  var chipsEl = document.getElementById("chips");
  var countEl = document.getElementById("result-count");
  var emptyEl = document.getElementById("empty-state");

  /* ---------- helpers ---------- */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatPrice(n) {
    var num = Number(n) || 0;
    return CURRENCY + num.toLocaleString("en-IN");
  }

  function imgPath(image) {
    return "assets/products/" + encodeURIComponent(image);
  }

  function catName(id) {
    var c = DATA.categories.filter(function (x) { return x.id === id; })[0];
    return c ? c.name : "Handmade Special";
  }

  /* ---------- WhatsApp ordering ---------- */
  function waLink(product) {
    var msg =
      "🙏 Jai Shri Krishna! I would like to order this product from Vansiwala Dresses:\n\n" +
      "🪔 Product: " + product.name + "\n" +
      "💰 Price: " + formatPrice(product.price) + "\n" +
      "🖼 Image ref: " + product.image + "\n\n" +
      "Please confirm availability, size and delivery details. Thank you!";
    return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
  }

  function showToast(message) {
    var toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message || "Opening WhatsApp… 🙏";
    toast.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);
  }

  /* ---------- render chips ---------- */
  function renderChips() {
    var chips = [{ id: "all", name: "All Items" }].concat(DATA.categories);
    chipsEl.innerHTML = chips.map(function (c) {
      var count = c.id === "all"
        ? WORK.length
        : WORK.filter(function (p) { return p.category === c.id; }).length;
      return (
        '<button data-cat="' + c.id + '" class="chip ' +
        (state.category === c.id ? "active " : "") +
        'border border-gold/50 text-ink-soft rounded-full px-4 py-2 text-sm font-medium">' +
        escapeHtml(c.name) + ' <span class="opacity-60">(' + count + ")</span></button>"
      );
    }).join("");
  }

  /* ---------- render grid ---------- */
  function visibleProducts() {
    var q = state.query.trim().toLowerCase();
    return WORK.filter(function (p) {
      var okCat = state.category === "all" || p.category === state.category;
      var okQ = !q || (p.name + " " + catName(p.category)).toLowerCase().indexOf(q) !== -1;
      return okCat && okQ;
    });
  }

  function renderGrid() {
    var list = visibleProducts();

    if (!list.length) {
      grid.innerHTML = "";
      emptyEl.classList.remove("hidden");
      countEl.textContent = "";
      return;
    }
    emptyEl.classList.add("hidden");
    countEl.textContent = "Showing " + list.length + " of " + WORK.length + " handcrafted pieces";

    grid.innerHTML = list.map(function (p, i) {
      var wi = WORK.indexOf(p);
      var warranty = p.warranty !== false
        ? '<span class="warranty-tag absolute top-2.5 left-2.5 inline-flex items-center gap-1 bg-maroon-deep/90 text-gold-light text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full border border-gold/50">🛡️ 1-Yr Warranty</span>'
        : "";
      var orderBtn = EDIT_MODE
        ? ""
        : '<a href="' + waLink(p) + '" target="_blank" rel="noopener" data-wa="1" ' +
            'class="btn-wa mt-3 inline-flex items-center justify-center gap-2 rounded-full px-3 py-2.5 text-xs sm:text-sm w-full">' +
            '<svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.11 3.22 5.1 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35zM12.05 21.7h-.01a9.9 9.9 0 01-5.04-1.38l-.36-.21-3.75.98.99-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.89 9.9-9.89a9.83 9.83 0 019.9 9.9c0 5.45-4.44 9.89-9.9 9.89zm8.42-18.31A11.8 11.8 0 0012.05 0C5.5 0 .17 5.34.17 11.9c0 2.1.55 4.15 1.59 5.96L.06 24l6.3-1.65a11.9 11.9 0 005.68 1.45h.01c6.55 0 11.89-5.33 11.89-11.9 0-3.18-1.24-6.16-3.47-8.51z"/></svg>' +
            "Order on WhatsApp</a>";
      var editPanel = EDIT_MODE
        ? '<div class="edit-panel mt-3 pt-3 border-t border-gold/25 space-y-2">' +
            '<label class="block"><span class="block text-[10px] uppercase tracking-wider text-gold mb-1">Category</span>' +
              '<select data-e="cat" data-i="' + wi + '" class="w-full text-xs bg-cream border border-gold/40 rounded-lg px-2 py-1.5 outline-none focus:border-gold">' +
              DATA.categories.map(function (c) {
                return '<option value="' + c.id + '"' + (p.category === c.id ? " selected" : "") + ">" + escapeHtml(c.name) + "</option>";
              }).join("") + "</select></label>" +
            '<label class="block"><span class="block text-[10px] uppercase tracking-wider text-gold mb-1">Price (₹)</span>' +
              '<input data-e="price" data-i="' + wi + '" type="number" min="0" step="1" value="' + p.price + '" class="w-full text-xs bg-cream border border-gold/40 rounded-lg px-2 py-1.5 outline-none focus:border-gold" /></label>' +
            '<label class="block"><span class="block text-[10px] uppercase tracking-wider text-gold mb-1">Name</span>' +
              '<input data-e="name" data-i="' + wi + '" value="' + escapeHtml(p.name) + '" class="w-full text-xs bg-cream border border-gold/40 rounded-lg px-2 py-1.5 outline-none focus:border-gold" /></label>' +
          "</div>"
        : "";
      return (
        '<article class="product-card card-glow bg-white rounded-2xl overflow-hidden border border-gold/20 shadow-sm flex flex-col" style="animation-delay:' + (i * 0.03) + 's">' +
          '<div class="relative img-ratio overflow-hidden bg-cream-dark">' +
            '<img src="' + imgPath(p.image) + '" alt="' + escapeHtml(p.name) + '" loading="lazy" class="card-media w-full h-full object-cover" onerror="this.style.display=\'none\'" />' +
            warranty +
            '<span class="absolute bottom-2.5 right-2.5 text-[10px] sm:text-xs bg-white/90 text-maroon-deep font-semibold px-2 py-0.5 rounded-full">' + escapeHtml(catName(p.category)) + "</span>" +
          "</div>" +
          '<div class="p-3 sm:p-4 flex flex-col flex-1">' +
            '<h3 class="font-display text-sm sm:text-base font-semibold leading-snug line-clamp-2">' + escapeHtml(p.name) + "</h3>" +
            '<div class="mt-2 flex items-baseline gap-1.5">' +
              '<span data-price-wi="' + wi + '" class="text-lg sm:text-xl font-bold text-maroon">' + formatPrice(p.price) + "</span>" +
              '<span class="text-xs text-ink-soft line-through">' + formatPrice(Math.round(p.price * 1.25)) + "</span>" +
            "</div>" +
            orderBtn +
            editPanel +
          "</div>" +
        "</article>"
      );
    }).join("");
  }

  function apply() {
    renderChips();
    renderGrid();
    var active = document.querySelector('.chip.active');
    if (active) active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  /* ---------- events: chips ---------- */
  chipsEl.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.category = btn.getAttribute("data-cat");
    apply();
  });

  /* ---------- events: nav category buttons ---------- */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-cat-nav]");
    if (!btn) return;
    var cat = btn.getAttribute("data-cat-nav");
    state.category = cat;
    apply();
    closeMenu();
    document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
  });

  /* ---------- events: search (synced inputs) ---------- */
  var searches = [].slice.call(document.querySelectorAll("#header-search, #mobile-search, #catalog-search"));
  function setQuery(val) {
    state.query = val;
    searches.forEach(function (inp) { if (inp.value !== val) inp.value = val; });
    renderGrid();
  }
  searches.forEach(function (inp) {
    inp.addEventListener("input", function () { setQuery(inp.value); });
  });

  /* ---------- events: WhatsApp order toast ---------- */
  grid.addEventListener("click", function (e) {
    if (e.target.closest("[data-wa]")) showToast();
  });

  /* ---------- edit mode: live inputs ---------- */
  function markDirty() {
    var st = document.getElementById("edit-status");
    if (st) st.textContent = "Unsaved changes — click Save";
  }

  grid.addEventListener("input", function (e) {
    if (!EDIT_MODE) return;
    var t = e.target.closest("[data-e]");
    if (!t) return;
    var wi = parseInt(t.getAttribute("data-i"), 10);
    var p = WORK[wi];
    if (!p) return;
    var kind = t.getAttribute("data-e");
    if (kind === "price") {
      var v = Math.max(0, Math.round(Number(t.value) || 0));
      p.price = v;
      var shown = grid.querySelector('[data-price-wi="' + wi + '"]');
      if (shown) shown.textContent = formatPrice(v);
    } else if (kind === "name") {
      p.name = t.value;
    }
    markDirty();
  });

  grid.addEventListener("change", function (e) {
    if (!EDIT_MODE) return;
    var t = e.target.closest("[data-e]");
    if (!t) return;
    var wi = parseInt(t.getAttribute("data-i"), 10);
    var p = WORK[wi];
    if (!p) return;
    var kind = t.getAttribute("data-e");
    if (kind === "cat") {
      p.category = t.value;
      renderGrid();
    }
    markDirty();
  });

  /* ---------- edit mode: save ---------- */
  function setEditStatus(msg) {
    var st = document.getElementById("edit-status");
    if (st) st.textContent = msg;
  }

  function saveChanges() {
    var catalog = {};
    var k;
    for (k in DATA) if (Object.prototype.hasOwnProperty.call(DATA, k)) catalog[k] = DATA[k];
    catalog.products = WORK;
    var btn = document.getElementById("edit-save");
    if (btn) btn.disabled = true;
    fetch("api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(catalog),
    })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function () {
        DATA.products = WORK;
        setEditStatus("Saved ✓ " + new Date().toLocaleTimeString());
        showToast("Saved to products.json ✓");
      })
      .catch(function () {
        setEditStatus("Save failed — run tools/server.py, not file://");
        showToast("Save failed — server.py required");
      })
      .then(function () { if (btn) btn.disabled = false; });
  }

  function initEditMode() {
    if (!EDIT_MODE) return;
    document.body.classList.add("edit-mode");

    var badge = document.createElement("div");
    badge.id = "edit-badge";
    badge.textContent = "🛠 EDIT MODE";
    document.body.appendChild(badge);

    var bar = document.createElement("div");
    bar.id = "edit-bar";
    bar.innerHTML =
      '<div class="text-xs leading-tight">' +
        '<p class="font-semibold text-gold-light">Edit Mode</p>' +
        '<p id="edit-status" class="text-gold-light/60">Editing in browser — click Save when done</p>' +
      "</div>" +
      '<button id="edit-exit" class="btn-ghost-gold rounded-full px-4 py-2 text-xs shrink-0">Exit</button>' +
      '<button id="edit-save" class="btn-gold rounded-full px-5 py-2 text-xs shrink-0">Save to products.json</button>';
    document.body.appendChild(bar);

    document.getElementById("edit-exit").addEventListener("click", function () {
      window.location.hash = "";
    });
    document.getElementById("edit-save").addEventListener("click", saveChanges);
  }

  window.addEventListener("hashchange", function () { window.location.reload(); });

  /* ---------- mobile menu ---------- */
  var menuToggle = document.getElementById("menu-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  var iconOpen = document.getElementById("icon-open");
  var iconClose = document.getElementById("icon-close");
  function closeMenu() {
    mobileMenu.classList.add("hidden");
    iconOpen.classList.remove("hidden");
    iconClose.classList.add("hidden");
  }
  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      var isHidden = mobileMenu.classList.toggle("hidden");
      iconOpen.classList.toggle("hidden", !isHidden);
      iconClose.classList.toggle("hidden", isHidden);
    });
  }

  /* ---------- header scroll effect ---------- */
  var header = document.getElementById("site-header");
  window.addEventListener("scroll", function () {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }, { passive: true });

  /* ---------- hero ---------- */
  function initHero() {
    var heroImg = DATA.hero && DATA.hero.image;
    if (heroImg) {
      var bg = document.getElementById("hero-bg");
      if (bg) bg.style.backgroundImage = "url('" + imgPath(heroImg) + "')";
      var frame = document.getElementById("hero-frame-img");
      if (frame) frame.src = imgPath(heroImg);
    }

    var particles = document.getElementById("particles");
    if (!particles) return;
    var count = window.innerWidth < 640 ? 18 : 30;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var s = document.createElement("span");
      s.className = "particle";
      var size = 3 + Math.random() * 7;
      s.style.width = size + "px";
      s.style.height = size + "px";
      s.style.left = Math.random() * 100 + "%";
      s.style.animationDuration = 8 + Math.random() * 10 + "s";
      s.style.animationDelay = Math.random() * 12 + "s";
      s.style.opacity = 0.3 + Math.random() * 0.5;
      frag.appendChild(s);
    }
    particles.appendChild(frag);
  }

  /* ---------- reveal on scroll ---------- */
  function initReveal() {
    var els = [].slice.call(document.querySelectorAll(".reveal"));
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- boot ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
  initHero();
  initEditMode();
  renderChips();
  renderGrid();
  initReveal();
})();
