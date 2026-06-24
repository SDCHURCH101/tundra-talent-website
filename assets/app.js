/* Tundra Talent — shared JS */
(function () {
  "use strict";

  /* sticky header solid-on-scroll */
  var header = document.querySelector("header.site");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 30) header.classList.add("solid");
    else header.classList.remove("solid");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* active nav by filename */
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-nav a").forEach(function (a) {
    var href = (a.getAttribute("href") || "").split("#")[0];
    if (href === path || (path === "index.html" && (href === "" || href === "./" || href === "index.html"))) {
      a.classList.add("active");
    }
  });

  /* mobile nav */
  var burger = document.querySelector(".burger");
  var mnav = document.querySelector(".mobile-nav");
  var scrim = document.querySelector(".scrim");
  var closeX = document.querySelector(".close-x");
  function openNav() { if (mnav) mnav.classList.add("open"); if (scrim) scrim.classList.add("open"); document.body.style.overflow = "hidden"; }
  function closeNav() { if (mnav) mnav.classList.remove("open"); if (scrim) scrim.classList.remove("open"); document.body.style.overflow = ""; }
  if (burger) burger.addEventListener("click", openNav);
  if (closeX) closeX.addEventListener("click", closeNav);
  if (scrim) scrim.addEventListener("click", closeNav);
  if (mnav) mnav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeNav); });

  /* reveal on scroll */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* count-up stats */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function animate(el) {
    var raw = el.getAttribute("data-count");
    var target = parseFloat(raw);
    var suffix = el.getAttribute("data-suffix") || "";
    var prefix = el.getAttribute("data-prefix") || "";
    if (reduceMotion) {
      var fin = (target % 1 !== 0) ? target.toFixed(1) : Math.round(target).toString();
      el.innerHTML = prefix + fin + '<span class="u">' + suffix + "</span>";
      return;
    }
    var dur = 1400, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      var out = (target % 1 !== 0) ? val.toFixed(1) : Math.round(val).toString();
      el.innerHTML = prefix + out + '<span class="u">' + suffix + "</span>";
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var statio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { animate(e.target); statio.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach(function (el) { statio.observe(el); });

  /* FAQ accordion */
  document.querySelectorAll(".qa button").forEach(function (b) {
    b.addEventListener("click", function () {
      var qa = b.closest(".qa");
      var a = qa.querySelector(".a");
      var open = qa.classList.toggle("open");
      a.style.maxHeight = open ? a.scrollHeight + "px" : 0;
    });
  });

  /* contact form tabs */
  var tabs = document.querySelectorAll(".tabs button");
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      tabs.forEach(function (x) { x.classList.remove("active"); });
      t.classList.add("active");
      var target = t.getAttribute("data-tab");
      document.querySelectorAll("[data-pane]").forEach(function (p) {
        p.style.display = p.getAttribute("data-pane") === target ? "block" : "none";
      });
    });
  });

  /* contact forms: validate, then submit via AJAX (FormSubmit), keep success panel */
  document.querySelectorAll("form[data-contact]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var bad = !input.value.trim() || (input.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value));
        if (field) field.classList.toggle("invalid", bad);
        if (bad) ok = false;
      });
      if (!ok) return;

      var card = form.closest(".formwrap") || form.parentElement;
      var success = card.querySelector(".form-success");
      var errMsg = form.querySelector(".form-error");
      var btn = form.querySelector("button[type=submit]");
      var label = btn ? btn.textContent : "";
      if (errMsg) errMsg.style.display = "none";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      fetch(form.action, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("bad status");
          return res.json().catch(function () { return {}; });
        })
        .then(function () {
          form.style.display = "none";
          if (success) success.classList.add("show");
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = label; }
          if (errMsg) errMsg.style.display = "block";
        });
    });
    form.querySelectorAll("input,select,textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field) field.classList.remove("invalid");
      });
    });
  });

  /* year */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

/* ===== language switcher (Google Translate, client-side) ===== */
(function () {
  "use strict";
  // [Google code, native name] — major world languages
  var LANGS = [
    ["en","English"],["es","Español"],["zh-CN","中文 (简体)"],["zh-TW","中文 (繁體)"],
    ["hi","हिन्दी"],["ar","العربية"],["pt","Português"],["ru","Русский"],["ja","日本語"],
    ["de","Deutsch"],["fr","Français"],["ko","한국어"],["it","Italiano"],["tr","Türkçe"],
    ["pl","Polski"],["uk","Українська"],["nl","Nederlands"],["vi","Tiếng Việt"],["th","ไทย"],
    ["id","Bahasa Indonesia"],["ms","Bahasa Melayu"],["tl","Filipino"],["bn","বাংলা"],
    ["ur","اردو"],["fa","فارسی"],["pa","ਪੰਜਾਬੀ"],["ta","தமிழ்"],["te","తెలుగు"],["mr","मराठी"],
    ["gu","ગુજરાતી"],["el","Ελληνικά"],["iw","עברית"],["sv","Svenska"],["no","Norsk"],
    ["da","Dansk"],["fi","Suomi"],["cs","Čeština"],["ro","Română"],["hu","Magyar"],
    ["sw","Kiswahili"],["am","አማርኛ"],["so","Soomaali"],["ne","नेपाली"],["my","မြန်မာ"],
    ["km","ខ្មែរ"],["ht","Kreyòl Ayisyen"]
  ];
  var selects = document.querySelectorAll("select.lang-select");
  if (!selects.length) return;

  // populate
  var opts = LANGS.map(function (l) { return '<option value="' + l[0] + '">' + l[1] + "</option>"; }).join("");
  selects.forEach(function (s) { s.innerHTML = opts; });

  function currentLang() {
    var m = document.cookie.match(/googtrans=\/[^/]*\/([^;]+)/);
    return m ? decodeURIComponent(m[1]) : "en";
  }
  function setCookie(name, val, del) {
    var base = name + "=" + val + ";path=/";
    var exp = del ? ";expires=Thu, 01 Jan 1970 00:00:00 GMT" : "";
    var host = location.hostname;
    var root = host.replace(/^www\./, "");
    document.cookie = base + exp;
    document.cookie = base + ";domain=" + host + exp;
    if (root.indexOf(".") > -1) document.cookie = base + ";domain=." + root + exp;
  }
  function setLang(code) {
    setCookie("googtrans", "", true);            // clear
    if (code && code !== "en") setCookie("googtrans", "/en/" + code);
    location.reload();
  }

  var cur = currentLang();
  document.querySelectorAll(".lang .lang-code").forEach(function (el) {
    el.textContent = (cur.split("-")[0] || "en").toUpperCase();
  });
  selects.forEach(function (s) {
    try { s.value = cur; } catch (e) {}
    s.addEventListener("change", function () { setLang(this.value); });
  });

  // load Google Translate (drives the actual translation from the cookie)
  if (!document.getElementById("google_translate_element")) {
    var d = document.createElement("div");
    d.id = "google_translate_element";
    d.setAttribute("aria-hidden", "true");
    document.body.appendChild(d);
  }
  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement(
      { pageLanguage: "en", includedLanguages: LANGS.map(function (l) { return l[0]; }).join(","), autoDisplay: false },
      "google_translate_element"
    );
  };
  if (!document.getElementById("gtrans-js")) {
    var sc = document.createElement("script");
    sc.id = "gtrans-js";
    sc.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(sc);
  }
})();
