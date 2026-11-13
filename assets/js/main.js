/* REAP site scripts: menu, events calendar, gallery lightbox, forms, search. */

/* Where the newsletter and contact forms send their data.
   Leave empty until a form service (e.g. Formspree, Netlify Forms, Basin) is set up,
   then paste its endpoint URL here. */
const FORM_ENDPOINT = "";

document.documentElement.classList.add("js");

/* ---------- Header menu ---------- */
(function () {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const toggle = header.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }
  header.querySelectorAll(".has-sub > button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const li = btn.parentElement;
      const open = !li.classList.contains("open");
      header.querySelectorAll(".has-sub.open").forEach((o) => {
        if (o !== li) { o.classList.remove("open"); o.firstElementChild.setAttribute("aria-expanded", "false"); }
      });
      li.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".has-sub")) {
      header.querySelectorAll(".has-sub.open").forEach((o) => {
        o.classList.remove("open"); o.firstElementChild.setAttribute("aria-expanded", "false");
      });
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") header.querySelectorAll(".has-sub.open").forEach((o) => o.classList.remove("open"));
  });
})();

/* ---------- Upcoming events calendar ---------- */
(function () {
  const cal = document.querySelector("[data-calendar]");
  if (!cal) return;
  const label = cal.querySelector(".cal-month");
  const grid = cal.querySelector(".cal-grid");
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dows = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const today = new Date();
  let view = new Date(today.getFullYear(), today.getMonth(), 1);

  function render() {
    label.textContent = months[view.getMonth()] + " " + view.getFullYear();
    grid.innerHTML = "";
    dows.forEach((d) => {
      const el = document.createElement("div");
      el.className = "cal-dow"; el.textContent = d; grid.appendChild(el);
    });
    const offset = (view.getDay() + 6) % 7; // Monday-first
    const start = new Date(view.getFullYear(), view.getMonth(), 1 - offset);
    for (let i = 0; i < 42; i++) {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      const el = document.createElement("div");
      el.className = "cal-day";
      if (i < 7) el.classList.add("first-row");
      if (i % 7 >= 5) el.classList.add("weekend");
      if (d.getMonth() !== view.getMonth()) el.classList.add("other");
      if (d.toDateString() === today.toDateString()) { el.classList.add("today"); el.setAttribute("aria-current", "date"); }
      el.textContent = d.getDate();
      grid.appendChild(el);
    }
  }
  cal.querySelector(".cal-prev").addEventListener("click", () => { view.setMonth(view.getMonth() - 1); render(); });
  cal.querySelector(".cal-next").addEventListener("click", () => { view.setMonth(view.getMonth() + 1); render(); });
  cal.querySelector(".cal-today").addEventListener("click", () => { view = new Date(today.getFullYear(), today.getMonth(), 1); render(); });
  render();
})();

/* ---------- Gallery lightbox ---------- */
(function () {
  const items = Array.from(document.querySelectorAll("[data-lightbox]"));
  if (!items.length) return;
  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Photo viewer");
  box.innerHTML =
    '<button class="lb-close" aria-label="Close">&times;</button>' +
    '<button class="lb-prev" aria-label="Previous photo">&#8249;</button>' +
    '<img alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==">' +
    '<button class="lb-next" aria-label="Next photo">&#8250;</button>';
  document.body.appendChild(box);
  const img = box.querySelector("img");
  let idx = 0, opener = null;

  function show(i) {
    idx = (i + items.length) % items.length;
    img.src = items[idx].getAttribute("data-lightbox");
    img.alt = items[idx].querySelector("img").alt;
  }
  function close() { box.classList.remove("open"); document.body.style.overflow = ""; if (opener) opener.focus(); }
  items.forEach((btn, i) => btn.addEventListener("click", () => {
    opener = btn; show(i); box.classList.add("open"); document.body.style.overflow = "hidden";
    box.querySelector(".lb-close").focus();
  }));
  box.querySelector(".lb-close").addEventListener("click", close);
  box.querySelector(".lb-prev").addEventListener("click", () => show(idx - 1));
  box.querySelector(".lb-next").addEventListener("click", () => show(idx + 1));
  box.addEventListener("click", (e) => { if (e.target === box) close(); });
  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
})();

/* ---------- Newsletter & contact forms ---------- */
(function () {
  document.querySelectorAll("form[data-form]").forEach((form) => {
    const status = form.querySelector(".form-status");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const okMsg = form.getAttribute("data-success") || "Thanks!";
      if (!FORM_ENDPOINT) {
        status.textContent = "This form isn't connected yet, so your details were not sent.";
        return;
      }
      const data = new FormData(form);
      data.append("form", form.getAttribute("data-form"));
      status.textContent = "Sending…";
      try {
        const res = await fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        status.textContent = okMsg;
      } catch (err) {
        status.textContent = "Sorry, something went wrong. Please try again.";
      }
    });
  });
})();

/* ---------- Site search ---------- */
(function () {
  const out = document.querySelector("[data-search-results]");
  if (!out || !window.REAP_SEARCH_INDEX) return;
  const q = (new URLSearchParams(location.search).get("q") || "").trim();
  const input = document.querySelector("#search-page-input");
  if (input) input.value = q;
  const heading = document.querySelector("[data-search-heading]");
  if (!q) { heading.textContent = "Search the site"; return; }
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const hits = window.REAP_SEARCH_INDEX
    .map((p) => {
      const hay = (p.title + " " + p.text).toLowerCase();
      const score = terms.reduce((s, t) => s + (hay.split(t).length - 1) + (p.title.toLowerCase().includes(t) ? 5 : 0), 0);
      return { p, score, ok: terms.every((t) => hay.includes(t)) };
    })
    .filter((r) => r.ok)
    .sort((a, b) => b.score - a.score);
  heading.textContent = hits.length + (hits.length === 1 ? " result" : " results") + " for “" + q + "”";
  hits.forEach(({ p }) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = p.url; a.textContent = p.title;
    const para = document.createElement("p");
    const lower = p.text.toLowerCase();
    const at = Math.max(0, lower.indexOf(terms[0]) - 80);
    para.textContent = (at > 0 ? "…" : "") + p.text.slice(at, at + 220) + "…";
    li.append(a, para);
    out.appendChild(li);
  });
})();
