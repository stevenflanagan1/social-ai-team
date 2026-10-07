(function () {
  "use strict";

  var VENUES = window.SW_VENUES || [];
  var BY_ID = {};
  VENUES.forEach(function (v) { BY_ID[v.id] = v; });

  var SLOTS = [
    { key: "morning", label: "Morning", time: "8:30 am" },
    { key: "lunch", label: "Lunch", time: "12:30 pm" },
    { key: "afternoon", label: "Afternoon", time: "3:00 pm" },
    { key: "evening", label: "Evening", time: "6:30 pm" }
  ];
  var SLOT_TIMES = {
    morning: ["8:00", "8:30", "9:00", "9:30", "10:00"],
    lunch: ["12:00", "12:30", "1:00", "1:30"],
    afternoon: ["2:30", "3:00", "3:30", "4:00"],
    evening: ["6:00", "6:30", "7:00", "7:30", "8:00"]
  };

  var LABELS = {
    interest: { food: "Food", outdoors: "Outdoors", drinks: "Drinks", culture: "Culture" },
    budget: { 1: "$", 2: "$$", 3: "$$$" },
    vibe: { chill: "Chill", date: "Date Night", friends: "With Friends" }
  };

  /* Photography-style gradient "scenes", one per kind of place. */
  var SCENES = {
    coast:
      "radial-gradient(60% 30% at 70% 62%, rgba(255,255,255,.75), transparent 70%)," +
      "radial-gradient(50% 40% at 20% 10%, #FFF4D6, transparent 70%)," +
      "linear-gradient(180deg, #A7DDEB 0%, #6CC6DA 34%, #1F92B3 50%, #27B0BF 60%, #8FD3CB 66%, #F1DDB4 72%, #E2C08A 100%)",
    harbour:
      "radial-gradient(28% 30% at 74% 28%, #FFE6B5, transparent 70%)," +
      "radial-gradient(70% 20% at 50% 70%, rgba(255,255,255,.35), transparent 70%)," +
      "linear-gradient(180deg, #89BDE3 0%, #4F8CC2 48%, #164A7E 52%, #1D5C93 70%, #0D3560 100%)",
    garden:
      "radial-gradient(45% 45% at 22% 18%, #F3FAD8, transparent 70%)," +
      "radial-gradient(50% 50% at 85% 85%, #1C5236, transparent 70%)," +
      "linear-gradient(160deg, #A4D27A 0%, #5FA25B 45%, #2E7449 75%, #1D5638 100%)",
    market:
      "radial-gradient(30% 34% at 28% 68%, #F4A04F, transparent 70%)," +
      "radial-gradient(26% 30% at 72% 34%, #E5533F, transparent 70%)," +
      "radial-gradient(26% 28% at 58% 86%, #9CC64E, transparent 70%)," +
      "radial-gradient(22% 26% at 18% 22%, #FFE08A, transparent 70%)," +
      "linear-gradient(135deg, #F7DCB0 0%, #DE9558 100%)",
    cafe:
      "radial-gradient(34% 38% at 70% 30%, #FFF0D8, transparent 70%)," +
      "radial-gradient(40% 40% at 25% 80%, #4A2A19, transparent 70%)," +
      "linear-gradient(160deg, #D7AE7F 0%, #9B6640 50%, #5A3420 100%)",
    gallery:
      "radial-gradient(circle at 30% 42%, #E9604A 0 17%, transparent 17.6%)," +
      "linear-gradient(90deg, transparent 58%, #1E3A5F 58% 74%, transparent 74%)," +
      "linear-gradient(0deg, transparent 18%, #F3C24A 18% 24%, transparent 24%)," +
      "linear-gradient(180deg, #F1EFEA 0%, #DAD5CB 100%)",
    dining:
      "radial-gradient(18% 22% at 48% 66%, #FFC46E, transparent 70%)," +
      "radial-gradient(14% 18% at 70% 58%, #FF9F4A, transparent 70%)," +
      "radial-gradient(50% 50% at 22% 25%, #8E3A27, transparent 70%)," +
      "linear-gradient(180deg, #3A1A16 0%, #160A08 100%)",
    bar:
      "radial-gradient(38% 40% at 28% 30%, #FF7A59, transparent 70%)," +
      "radial-gradient(44% 46% at 76% 62%, #B14DB2, transparent 70%)," +
      "radial-gradient(16% 18% at 60% 20%, #FFD27A, transparent 70%)," +
      "linear-gradient(180deg, #2B1640 0%, #0F0A1F 100%)",
    dusk:
      "radial-gradient(22% 18% at 50% 64%, #FFE2A0, transparent 70%)," +
      "linear-gradient(180deg, #2C3E73 0%, #8E4F86 30%, #E0707A 48%, #F7A35E 62%, #FFD08A 68%, #22355A 69%, #0E1A30 100%)",
    theatre:
      "radial-gradient(50% 40% at 50% 0%, #FFD9A0, transparent 70%)," +
      "radial-gradient(60% 30% at 50% 100%, #1A0408, transparent 70%)," +
      "repeating-linear-gradient(90deg, #8A1426 0 22px, #5E0A16 22px 44px)",
    island:
      "radial-gradient(24% 20% at 72% 24%, #FFF5D6, transparent 70%)," +
      "linear-gradient(180deg, #C3E6EE 0%, #8FCAD8 42%, #6C8E5A 44%, #4A6B3E 58%, #2C7A8F 60%, #1A5870 100%)",
    brewery:
      "radial-gradient(36% 36% at 40% 30%, #FFEBB0, transparent 70%)," +
      "radial-gradient(30% 40% at 80% 85%, #6A3A0C, transparent 70%)," +
      "linear-gradient(160deg, #F4BC48 0%, #CF7D1C 60%, #7A4410 100%)",
    neon:
      "radial-gradient(34% 36% at 22% 30%, #FF4F8B, transparent 70%)," +
      "radial-gradient(34% 36% at 80% 40%, #3DD6D0, transparent 70%)," +
      "radial-gradient(26% 28% at 50% 90%, #FFC94A, transparent 70%)," +
      "linear-gradient(180deg, #1E1236 0%, #0B0818 100%)"
  };

  var HOODS = [
    { name: "Bondi", line: "Coast walks and ocean pools", scene: "coast", prefs: { interest: "outdoors", vibe: "chill" } },
    { name: "Surry Hills", line: "Cafés, wine bars, small stages", scene: "cafe", prefs: { interest: "food", vibe: "date" } },
    { name: "Newtown", line: "Street art, taprooms, late nights", scene: "neon", prefs: { interest: "drinks", vibe: "friends" } },
    { name: "The Rocks", line: "Sandstone lanes and old pubs", scene: "harbour", prefs: { interest: "culture", vibe: "date" } },
    { name: "Chippendale", line: "Galleries and hawker laneways", scene: "gallery", prefs: { interest: "culture", vibe: "chill" } },
    { name: "Manly", line: "Ferries, bushwalks and surf", scene: "island", prefs: { interest: "outdoors", vibe: "friends" } }
  ];

  /* ---------- Logos ---------- */
  var LOGO_COLORS = [
    ["#0E2233", "#F7EFE3"], ["#F2785C", "#2A0F06"], ["#1F6E5A", "#F3FAD8"], ["#F4C95D", "#3A2A05"],
    ["#6B3FA0", "#FBEAFF"], ["#C23B4E", "#FFF1E6"], ["#0F7C8C", "#E9FBFC"], ["#1D1D1F", "#FFD27A"],
    ["#E8E1D3", "#1E3A5F"], ["#B5562D", "#FFF4E8"]
  ];
  var LOGO_FONTS = [
    "font-family:Fraunces,Georgia,serif;font-style:italic;font-weight:600",
    "font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800",
    "font-family:'DM Mono',ui-monospace,monospace;font-weight:500"
  ];
  var LOGO_SHAPES = [
    '<circle cx="26" cy="26" r="26" fill="BG"/>',
    '<rect width="52" height="52" rx="14" fill="BG"/>',
    '<path d="M0 52V26a26 26 0 0 1 52 0v26z" fill="BG"/>',
    '<path d="M15 0h22l15 15v22L37 52H15L0 37V15z" fill="BG"/>',
    '<rect width="52" height="52" rx="26" fill="BG"/><circle cx="26" cy="26" r="21" fill="none" stroke="FG" stroke-opacity=".45" stroke-width="1.5"/>'
  ];
  var ICONS = {
    wave: '<path d="M8 30c4 0 4-4 9-4s5 4 9 4 4-4 9-4 5 4 9 4M8 22c4 0 4-4 9-4s5 4 9 4 4-4 9-4 5 4 9 4" fill="none" stroke="FG" stroke-width="3" stroke-linecap="round"/>',
    leaf: '<path d="M14 38C14 22 24 13 39 13c0 16-9 25-25 25zM14 38l13-13" fill="none" stroke="FG" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
    ferry: '<path d="M11 30h30l-4 8H15zM17 30v-8h18v8M22 22v-5h8v5" fill="none" stroke="FG" stroke-width="3" stroke-linejoin="round"/>',
    sun: '<circle cx="26" cy="28" r="7" fill="none" stroke="FG" stroke-width="3"/><path d="M26 13v4M14 28h-4M42 28h-4M17 19l3 3M35 19l-3 3M10 38h32" stroke="FG" stroke-width="3" stroke-linecap="round"/>',
    city: '<path d="M11 39V22h8v17M19 39V14h10v25M29 39V24h10v15M8 39h36" fill="none" stroke="FG" stroke-width="3" stroke-linejoin="round"/>',
    sails: '<path d="M12 36c2-10 7-15 14-16-2 5-3 11-3 16zM22 36c3-12 9-18 18-19-3 6-5 13-5 19zM9 37h34" fill="none" stroke="FG" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>'
  };

  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  function initials(name) {
    var skip = { the: 1, "&": 1, and: 1, "co.": 1, by: 1, le: 1, a: 1, at: 1 };
    var words = name.replace(/[^\w&.\s'-]/g, "").split(/\s+/).filter(function (w) { return w && !skip[w.toLowerCase()]; });
    if (!words.length) return name.charAt(0);
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }

  function logoSVG(v, cls) {
    var h = hash(v.id);
    var body;
    if (v.icon) {
      body = '<rect width="52" height="52" rx="14" fill="#E3F2F3"/>' + ICONS[v.icon].replace(/FG/g, "#0F7C8C");
    } else {
      var c = LOGO_COLORS[h % LOGO_COLORS.length];
      var shape = LOGO_SHAPES[(h >>> 4) % LOGO_SHAPES.length];
      var font = LOGO_FONTS[(h >>> 8) % LOGO_FONTS.length];
      var txt = initials(v.name);
      var size = txt.length > 1 ? 19 : 25;
      body = shape.replace(/BG/g, c[0]).replace(/FG/g, c[1]) +
        '<text x="26" y="' + (shape.indexOf("M0 52V26") === 0 ? 34 : 27) + '" text-anchor="middle" dominant-baseline="central" fill="' + c[1] +
        '" style="' + font + ';font-size:' + size + 'px;letter-spacing:-0.5px">' + esc(txt) + "</text>";
    }
    return '<svg class="' + (cls || "logo") + '" viewBox="0 0 52 52" role="img" aria-label="' + esc(v.name) + ' logo">' + body + "</svg>";
  }

  /* ---------- Helpers ---------- */
  function money(n) { return n === 0 ? "Free" : "~$" + n.toLocaleString("en-AU"); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(id) { return document.getElementById(id); }

  var toastEl = $("toast");
  var toastTimer;
  function toast(msg) {
    toastEl.hidden = true;
    void toastEl.offsetWidth;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 2800);
  }

  var ICON_PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" fill="currentColor"/><circle cx="12" cy="10" r="2.6" fill="#fff"/></svg>';
  var ICON_HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
  var ICON_SWAP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v5h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
  var ICON_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ---------- State ---------- */
  var form = $("planner");
  var timeline = $("timeline");
  var planSection = $("plan");
  var buildBtn = $("build-btn");

  var current = [];      // [{slot, venue}]
  var prefs = null;
  var history = [];
  var lastPrefsKey = "";
  var saved = {};
  var booked = {};

  function readPrefs() {
    var fd = new FormData(form);
    return {
      interest: fd.get("interest") || "food",
      budget: Number(fd.get("budget") || 2),
      vibe: fd.get("vibe") || "date"
    };
  }

  function score(v, p) {
    var s = 0;
    if (v.types.indexOf(p.interest) !== -1) s += 4;
    if (v.vibes.indexOf(p.vibe) !== -1) s += 2;
    if (v.budget === p.budget) s += 1.5;
    return s;
  }

  function weightedPick(list) {
    var total = list.reduce(function (t, x) { return t + x.s + 1; }, 0);
    var r = Math.random() * total;
    for (var i = 0; i < list.length; i++) {
      r -= list[i].s + 1;
      if (r <= 0) return list[i].v;
    }
    return list[list.length - 1].v;
  }

  function pickFor(slotKey, p, avoid) {
    var scored = VENUES
      .filter(function (v) { return v.slot === slotKey && v.budget <= p.budget; })
      .map(function (v) { return { v: v, s: score(v, p) }; })
      .sort(function (a, b) { return b.s - a.s; });
    var best = scored.length ? scored[0].s : 0;
    var pool = scored.filter(function (x) { return x.s >= best - 2; });
    if (pool.length < 3) pool = scored.slice(0, 3);
    var fresh = pool.filter(function (x) { return avoid.indexOf(x.v.id) === -1; });
    if (!fresh.length) fresh = scored.filter(function (x) { return avoid.indexOf(x.v.id) === -1; }).slice(0, 4);
    if (!fresh.length) fresh = pool;
    return weightedPick(fresh);
  }

  /* ---------- Rendering ---------- */
  function cardInner(item) {
    var v = item.venue;
    var types = v.types.map(function (t) { return "<span>" + LABELS.interest[t] + "</span>"; }).join("");
    var bookable = !v.icon && v.cost > 0;
    var ctaLabel = booked[v.id] ? "Booked · " + booked[v.id] : (bookable ? "Book" : "Details");
    return (
      '<article class="card">' +
        '<div class="photo"><div class="photo-bg" style="background-image:' + SCENES[v.scene] + '"></div>' +
          '<span class="photo-area">' + ICON_PIN + esc(v.area) + "</span></div>" +
        '<div class="card-body">' +
          '<div class="card-head">' + logoSVG(v) +
            '<div><div class="card-type">' + types + "</div>" +
            '<h3 class="card-name">' + esc(v.name) + "</h3></div>" +
            '<div class="card-tools">' +
              '<button type="button" class="icon-btn" data-act="save" aria-pressed="' + (saved[v.id] ? "true" : "false") + '" aria-label="Save ' + esc(v.name) + '">' + ICON_HEART + "</button>" +
              '<button type="button" class="icon-btn" data-act="swap" aria-label="Swap this stop">' + ICON_SWAP + "</button>" +
            "</div>" +
          "</div>" +
          '<p class="card-desc">' + esc(v.desc) + "</p>" +
          '<div class="card-foot">' +
            '<span class="cost">' + money(v.cost) + (v.cost ? " <small>pp</small>" : "") + "</span>" +
            '<p class="tip"><b>Tip:</b> ' + esc(v.tip) + "</p>" +
            '<button type="button" class="card-cta' + (booked[v.id] ? " booked" : "") + '" data-act="open">' + ctaLabel + "</button>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function stopHTML(item, i) {
    return (
      '<li class="stop enter" style="--i:' + i + '" data-slot="' + item.slot.key + '" data-id="' + item.venue.id + '">' +
        '<div class="stop-when"><span class="stop-slot">' + item.slot.label + "</span>" +
        '<span class="stop-time">' + item.slot.time + "</span></div>" +
        cardInner(item) +
      "</li>"
    );
  }

  function updateTotal() {
    var total = current.reduce(function (t, x) { return t + x.venue.cost; }, 0);
    var el = $("plan-total");
    el.textContent = money(total);
    el.classList.remove("bump");
    void el.offsetWidth;
    el.classList.add("bump");
  }

  function renderPlan(kicker) {
    $("plan-kicker").textContent = kicker;
    $("plan-tags").innerHTML = [LABELS.interest[prefs.interest], LABELS.budget[prefs.budget], LABELS.vibe[prefs.vibe]]
      .map(function (t) { return '<span class="tag">' + t + "</span>"; }).join("");
    timeline.innerHTML = current.map(stopHTML).join("");
    updateTotal();
    renderPhone();
  }

  function generate(kicker, scroll) {
    prefs = readPrefs();
    var key = prefs.interest + prefs.budget + prefs.vibe;
    if (key !== lastPrefsKey) { history = []; lastPrefsKey = key; }
    var lastIds = current.map(function (x) { return x.venue.id; });
    var avoid = history.concat(lastIds);
    current = SLOTS.map(function (slot) { return { slot: slot, venue: pickFor(slot.key, prefs, avoid) }; });
    history = history.concat(current.map(function (x) { return x.venue.id; }));
    renderPlan(kicker);
    if (scroll) planSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function buildWithLoading(kicker) {
    if (buildBtn.classList.contains("loading")) return;
    buildBtn.classList.add("loading");
    buildBtn.setAttribute("aria-busy", "true");
    setTimeout(function () {
      buildBtn.classList.remove("loading");
      buildBtn.removeAttribute("aria-busy");
      generate(kicker, true);
      toast("Your Saturday is ready");
    }, 650);
  }

  function swapStop(li) {
    var idx = SLOTS.findIndex(function (s) { return s.key === li.dataset.slot; });
    var avoid = current.map(function (x) { return x.venue.id; });
    var v = pickFor(li.dataset.slot, prefs, avoid.concat(history));
    current[idx] = { slot: SLOTS[idx], venue: v };
    history.push(v.id);
    li.dataset.id = v.id;
    li.classList.remove("enter", "swapping");
    li.querySelector(".card").outerHTML = cardInner(current[idx]);
    void li.offsetWidth;
    li.classList.add("swapping");
    updateTotal();
    renderPhone();
    toast(SLOTS[idx].label + " swapped to " + v.name);
  }

  function renderPhone() {
    var el = $("phone-screen");
    if (!el) return;
    el.innerHTML = '<div class="ps-title">Saturday</div>' + current.map(function (x) {
      return '<div class="ps-row">' + logoSVG(x.venue) + "<div><b>" + esc(x.venue.name) + "</b><span>" + x.slot.time + " · " + esc(x.venue.area) + "</span></div></div>";
    }).join("");
  }

  /* ---------- Sheet (dialog) ---------- */
  var sheet = $("sheet");
  var sheetInner = $("sheet-inner");

  function openSheet(html) {
    sheetInner.innerHTML = html;
    if (typeof sheet.showModal === "function") { if (!sheet.open) sheet.showModal(); }
    else sheet.setAttribute("open", "");
    var first = sheetInner.querySelector("input, button:not(.sheet-close)");
    if (first) first.focus();
  }
  function closeSheet() { if (sheet.open) sheet.close(); else sheet.removeAttribute("open"); }

  function successHTML(title, text, ref) {
    return '<button type="button" class="sheet-close" data-sheet="close" aria-label="Close">' + ICON_CLOSE + "</button>" +
      '<div class="success"><div class="success-icon">' + ICON_CHECK + "</div>" +
      '<h2 id="sheet-title">' + title + "</h2><p>" + text + "</p>" +
      (ref ? '<span class="ref">' + ref + "</span>" : "") +
      '<button type="button" class="btn-build sheet-submit" data-sheet="close">Done</button></div>';
  }

  function venueSheet(v, slotKey) {
    var bookable = !v.icon && v.cost > 0;
    var times = SLOT_TIMES[slotKey].map(function (t, i) {
      var suffix = slotKey === "morning" ? " am" : " pm";
      return '<input type="radio" name="time" id="t-' + i + '" value="' + t + suffix + '"' + (i === 1 ? " checked" : "") + '><label for="t-' + i + '">' + t + suffix + "</label>";
    }).join("");
    openSheet(
      '<div class="sheet-hero photo"><div class="photo-bg" style="background-image:' + SCENES[v.scene] + '"></div>' +
        '<button type="button" class="sheet-close" data-sheet="close" aria-label="Close">' + ICON_CLOSE + "</button>" +
        '<span class="photo-area">' + ICON_PIN + esc(v.area) + "</span></div>" +
      '<form class="sheet-body" id="book-form" data-id="' + v.id + '">' +
        '<div class="card-head">' + logoSVG(v) + '<div><div class="card-type"><span>' + (bookable ? "Reserve" : "Plan a visit") + '</span></div><h2 id="sheet-title">' + esc(v.name) + "</h2></div></div>" +
        '<p class="card-desc">' + esc(v.desc) + "</p>" +
        '<div class="field"><span>' + (bookable ? "Time on Saturday" : "Remind me at") + '</span><div class="times">' + times + "</div></div>" +
        (bookable ? '<div class="field"><span>Guests</span><div class="stepper"><button type="button" data-step="-1" aria-label="Fewer guests">−</button><output id="guests">2</output><button type="button" data-step="1" aria-label="More guests">+</button></div></div>' : "") +
        '<div class="card-foot"><span class="cost">' + money(v.cost) + (v.cost ? " <small>pp</small>" : "") + '</span><p class="tip"><b>Tip:</b> ' + esc(v.tip) + "</p></div>" +
        '<button type="submit" class="btn-build sheet-submit">' + (bookable ? "Confirm booking" : "Add to my Saturday") + "</button>" +
      "</form>"
    );
  }

  function appSheet() {
    openSheet(
      '<button type="button" class="sheet-close" data-sheet="close" aria-label="Close">' + ICON_CLOSE + "</button>" +
      '<form class="sheet-body" id="app-form" style="padding-top:34px">' +
        '<div class="card-head"><svg class="logo" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="16" fill="#0E2233"/><path d="M10 46 Q32 10 54 46" fill="none" stroke="#F2785C" stroke-width="5" stroke-linecap="round"/><path d="M8 50h48" stroke="#7FD1D8" stroke-width="4" stroke-linecap="round"/></svg>' +
        '<div><div class="card-type"><span>iPhone</span><span>Android</span></div><h2 id="sheet-title">Get Sydney Weekend</h2></div></div>' +
        '<p class="card-desc">We\'ll email you a download link for your phone, plus a fresh Saturday plan every Friday.</p>' +
        '<label class="field"><span>Email</span><input type="email" id="app-email" required placeholder="you@example.com" autocomplete="email"></label>' +
        '<button type="submit" class="btn-build sheet-submit">Send me the link</button>' +
      "</form>"
    );
  }

  function partnerSheet() {
    openSheet(
      '<button type="button" class="sheet-close" data-sheet="close" aria-label="Close">' + ICON_CLOSE + "</button>" +
      '<form class="sheet-body" id="partner-form" style="padding-top:34px">' +
        '<div><div class="card-type"><span>For venues</span></div><h2 id="sheet-title">List your venue</h2></div>' +
        '<p class="card-desc">Tell us a little about your place and our partnerships team will reach out within two business days.</p>' +
        '<label class="field"><span>Venue name</span><input type="text" id="p-name" required placeholder="e.g. Harbourside Espresso"></label>' +
        '<label class="field"><span>Suburb</span><input type="text" id="p-suburb" required placeholder="e.g. Glebe"></label>' +
        '<label class="field"><span>Work email</span><input type="email" id="p-email" required placeholder="you@yourvenue.com.au"></label>' +
        '<button type="submit" class="btn-build sheet-submit">Submit listing</button>' +
      "</form>"
    );
  }

  function refCode() {
    return "SW-" + Math.floor(1000 + Math.random() * 9000) + "-" + "ABCDEFGHJKLMNPQRSTUVWXYZ".charAt(Math.floor(Math.random() * 24));
  }

  /* ---------- Events ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    buildWithLoading("Your plan");
  });

  $("again-btn").addEventListener("click", function () {
    generate("Your plan", true);
    toast("Here's a fresh plan");
  });

  timeline.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-act]");
    if (!btn) return;
    var li = btn.closest(".stop");
    var v = BY_ID[li.dataset.id];
    var act = btn.dataset.act;
    if (act === "save") {
      saved[v.id] = !saved[v.id];
      btn.setAttribute("aria-pressed", saved[v.id] ? "true" : "false");
      toast(saved[v.id] ? "Saved " + v.name : "Removed " + v.name + " from saved");
    } else if (act === "swap") {
      swapStop(li);
    } else if (act === "open") {
      venueSheet(v, li.dataset.slot);
    }
  });

  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-action]");
    if (a) {
      var act = a.dataset.action;
      if (act === "app") appSheet();
      else if (act === "partner") partnerSheet();
      else if (act === "copy") copyPlan();
      return;
    }
    if (e.target.closest("[data-sheet='close']")) { closeSheet(); return; }
    var step = e.target.closest("[data-step]");
    if (step) {
      var out = $("guests");
      var n = Math.min(12, Math.max(1, Number(out.textContent) + Number(step.dataset.step)));
      out.textContent = n;
      return;
    }
    var hood = e.target.closest("[data-hood]");
    if (hood) {
      var h = HOODS[Number(hood.dataset.hood)];
      $("int-" + h.prefs.interest).checked = true;
      $("vibe-" + h.prefs.vibe).checked = true;
      generate(h.name + " Saturday", true);
      toast("Built a " + h.name + " Saturday: " + LABELS.interest[h.prefs.interest] + ", " + LABELS.vibe[h.prefs.vibe]);
    }
  });

  // Close the dialog when clicking the backdrop.
  sheet.addEventListener("click", function (e) { if (e.target === sheet) closeSheet(); });

  sheetInner.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    if (f.id === "book-form") {
      var v = BY_ID[f.dataset.id];
      var time = (f.querySelector("input[name=time]:checked") || {}).value || "";
      var bookable = !v.icon && v.cost > 0;
      booked[v.id] = time;
      var g = $("guests") ? Number($("guests").textContent) : 0;
      var li = timeline.querySelector('.stop[data-id="' + v.id + '"]');
      if (li) {
        var cta = li.querySelector(".card-cta");
        cta.textContent = "Booked · " + time;
        cta.classList.add("booked");
      }
      sheetInner.innerHTML = bookable
        ? successHTML("You're booked", esc(v.name) + ", Saturday at " + time + " for " + g + (g === 1 ? " guest" : " guests") + ". A confirmation is on its way to your inbox.", refCode())
        : successHTML("Added to your Saturday", "We'll remind you at " + time + " to head to " + esc(v.name) + ".", null);
      toast(bookable ? "Table booked at " + v.name : v.name + " added");
    } else if (f.id === "app-form") {
      var email = $("app-email").value.trim();
      sheetInner.innerHTML = successHTML("Check your inbox", "We've sent the download link to <b>" + esc(email) + "</b>. Your first Friday plan lands this week.", null);
      toast("Download link sent");
    } else if (f.id === "partner-form") {
      var name = $("p-name").value.trim();
      sheetInner.innerHTML = successHTML("Thanks, " + esc(name) + "!", "Your listing request is in. Our partnerships team will be in touch within two business days.", refCode());
      toast("Listing request received");
    }
  });

  function copyPlan() {
    var text = "My Sydney Saturday (" + LABELS.interest[prefs.interest] + " · " + LABELS.budget[prefs.budget] + " · " + LABELS.vibe[prefs.vibe] + ")\n" +
      current.map(function (x) { return x.slot.time + "  " + x.venue.name + " (" + x.venue.area + "), " + money(x.venue.cost); }).join("\n");
    function done() { toast("Plan copied to clipboard"); }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (err) { /* ignore */ }
      document.body.removeChild(ta);
      done();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  }

  /* ---------- Init ---------- */
  $("hood-grid").innerHTML = HOODS.map(function (h, i) {
    return '<button type="button" class="hood" data-hood="' + i + '" style="background:' + SCENES[h.scene] + '">' +
      "<i>" + LABELS.interest[h.prefs.interest] + "</i><b>" + h.name + "</b><span>" + h.line + "</span></button>";
  }).join("");

  var areas = {};
  VENUES.forEach(function (v) { areas[v.area] = 1; });
  $("stat-spots").textContent = VENUES.length;
  $("stat-hoods").textContent = Object.keys(areas).length;

  // Open on a ready-made plan so the page shows what it does.
  generate("Popular this weekend", false);
})();
