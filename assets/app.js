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

  /* demo form validation (client-side only — no backend) */
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
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
      form.style.display = "none";
      if (success) success.classList.add("show");
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
