(function () {
  "use strict";

  var VENUES = window.SW_VENUES || [];

  var SLOTS = [
    { key: "morning", label: "Morning", time: "8:30 am" },
    { key: "lunch", label: "Lunch", time: "12:30 pm" },
    { key: "afternoon", label: "Afternoon", time: "3:00 pm" },
    { key: "evening", label: "Evening", time: "6:30 pm" }
  ];

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

  var PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" fill="currentColor"/><circle cx="12" cy="10" r="2.6" fill="#fff"/></svg>';

  var form = document.getElementById("planner");
  var timeline = document.getElementById("timeline");
  var planSection = document.getElementById("plan");
  var kicker = document.getElementById("plan-kicker");
  var tagsEl = document.getElementById("plan-tags");
  var totalEl = document.getElementById("plan-total");
  var againBtn = document.getElementById("again-btn");

  var lastPlan = [];      // ids shown most recently
  var history = [];       // ids shown since preferences last changed
  var lastPrefsKey = "";

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

  /* Pick one venue per slot. Avoids anything in `avoid` where possible,
     so "Try another plan" always changes the line-up. */
  function buildPlan(p, avoid) {
    return SLOTS.map(function (slot) {
      var scored = VENUES
        .filter(function (v) { return v.slot === slot.key && v.budget <= p.budget; })
        .map(function (v) { return { v: v, s: score(v, p) }; })
        .sort(function (a, b) { return b.s - a.s; });

      var best = scored.length ? scored[0].s : 0;
      var pool = scored.filter(function (x) { return x.s >= best - 2; });
      if (pool.length < 3) pool = scored.slice(0, 3);

      var fresh = pool.filter(function (x) { return avoid.indexOf(x.v.id) === -1; });
      if (!fresh.length) fresh = scored.filter(function (x) { return lastPlan.indexOf(x.v.id) === -1; }).slice(0, 4);
      if (!fresh.length) fresh = pool;
      return { slot: slot, venue: weightedPick(fresh) };
    });
  }

  function money(n) {
    return n === 0 ? "Free" : "~$" + n.toLocaleString("en-AU");
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function cardHTML(item, i) {
    var v = item.venue;
    var types = v.types.map(function (t) { return "<span>" + LABELS.interest[t] + "</span>"; }).join("");
    return (
      '<li class="stop enter" style="--i:' + i + '">' +
        '<div class="stop-when"><span class="stop-slot">' + item.slot.label + '</span>' +
        '<span class="stop-time">' + item.slot.time + '</span></div>' +
        '<article class="card">' +
          '<div class="photo"><div class="photo-bg" style="background-image:' + SCENES[v.scene] + '"></div>' +
            '<span class="photo-area">' + PIN + esc(v.area) + '</span></div>' +
          '<div class="card-body">' +
            '<div class="card-type">' + types + '</div>' +
            '<h3 class="card-name">' + esc(v.name) + '</h3>' +
            '<p class="card-desc">' + esc(v.desc) + '</p>' +
            '<div class="card-foot">' +
              '<span class="cost">' + money(v.cost) + (v.cost ? ' <small>pp</small>' : '') + '</span>' +
              '<p class="tip"><b>Tip:</b> ' + esc(v.tip) + '</p>' +
            '</div>' +
          '</div>' +
        '</article>' +
      '</li>'
    );
  }

  function render(plan, p, isSample) {
    kicker.textContent = isSample ? "Sample plan" : "Your plan";
    tagsEl.innerHTML = [
      LABELS.interest[p.interest], LABELS.budget[p.budget], LABELS.vibe[p.vibe]
    ].map(function (t) { return '<span class="tag">' + t + "</span>"; }).join("");

    timeline.innerHTML = plan.map(cardHTML).join("");

    var total = plan.reduce(function (t, x) { return t + x.venue.cost; }, 0);
    totalEl.textContent = money(total);
    totalEl.classList.remove("bump");
    void totalEl.offsetWidth;
    totalEl.classList.add("bump");

    lastPlan = plan.map(function (x) { return x.venue.id; });
  }

  function generate(isSample, scroll) {
    var p = readPrefs();
    var key = p.interest + p.budget + p.vibe;
    if (key !== lastPrefsKey) { history = []; lastPrefsKey = key; }

    // Avoid everything seen with these settings; once exhausted, just avoid the last plan.
    var plan = buildPlan(p, history.concat(lastPlan));
    var ids = plan.map(function (x) { return x.venue.id; });
    history = history.concat(ids);
    render(plan, p, isSample);

    if (scroll) planSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    generate(false, true);
  });

  againBtn.addEventListener("click", function () {
    generate(false, true);
  });

  // Open on a ready-made sample so the page shows what it does.
  generate(true, false);
})();
