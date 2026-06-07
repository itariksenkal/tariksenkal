/* tariksenkal.com — etkileşim katmanı
   Tema, mobil menü, scroll-reveal, okuma ilerlemesi, "yukarı" butonu. */
(function () {
  "use strict";

  /* ---- Tema (açık / koyu) -------------------------------------------- */
  /* İlk tema, <head>'deki satır içi script tarafından (flash olmadan) uygulanır:
     kullanıcının kaydedilmiş tercihi varsa o, yoksa işletim sistemi/tarayıcı teması.
     Burada yalnızca toggle ve canlı sistem-tema takibi yönetilir. */
  var root = document.documentElement;
  var THEME_KEY = "ts-theme";
  function savedTheme() { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } }

  function toggleTheme() {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  }
  document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
    b.addEventListener("click", toggleTheme);
  });

  /* Kullanıcı elle bir tema seçmediyse, işletim sistemi teması değiştikçe canlı takip et. */
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onSystemChange = function (e) {
      if (!savedTheme()) root.setAttribute("data-theme", e.matches ? "dark" : "light");
    };
    try { mq.addEventListener("change", onSystemChange); }
    catch (_) { try { mq.addListener(onSystemChange); } catch (__) {} }
  }

  /* ---- Navbar: kaydırınca arka plan + mobil menü --------------------- */
  var nav = document.getElementById("nav");
  function onScrollNav() {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 8);
  }
  onScrollNav();

  var navToggle = document.querySelector("[data-nav-toggle]");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () { nav.classList.toggle("open"); });
    nav.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  /* ---- Bölüm bağlantıları: yumuşak kaydır, adres çubuğunda # bırakma --- */
  function sectionOffset() { return (nav ? nav.offsetHeight : 68) + 14; }
  function scrollToId(id, smooth) {
    var el = document.getElementById(id);
    if (!el) return false;
    var y = el.getBoundingClientRect().top + window.scrollY - sectionOffset();
    window.scrollTo({ top: y < 0 ? 0 : y, behavior: smooth ? "smooth" : "auto" });
    return true;
  }
  /* Aynı sayfadaki çapalar: kaydır ama URL'ye # ekleme. */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href").slice(1);
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      if (nav) nav.classList.remove("open");
      scrollToId(id, true);
    });
  });
  /* Başka sayfadan #bölüm ile gelindiyse: kaydır, sonra # işaretini adresten sil. */
  if (location.hash.length > 1) {
    var _hid = location.hash.slice(1);
    var _clean = function () {
      if (scrollToId(_hid, false) && window.history && history.replaceState) {
        history.replaceState(null, "", location.pathname + location.search);
      }
    };
    if (document.readyState === "complete") _clean();
    else window.addEventListener("load", _clean);
  }

  /* ---- Yıl ----------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Scroll reveal -------------------------------------------------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- "Yukarı" butonu ----------------------------------------------- */
  var toTop = document.querySelector(".to-top");
  function onScrollTop() {
    if (toTop) toTop.classList.toggle("show", window.scrollY > 600);
  }
  if (toTop) toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---- Okuma ilerleme çubuğu (makale sayfaları) ---------------------- */
  var progress = document.querySelector(".progress");
  function onScrollProgress() {
    if (!progress) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    progress.style.width = pct + "%";
  }

  /* ---- Tek scroll dinleyici ------------------------------------------ */
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScrollNav(); onScrollTop(); onScrollProgress();
      ticking = false;
    });
  }, { passive: true });
  onScrollProgress();
})();

/* Çerez bildirimi (basit, kalıcı kapatma) */
(function () {
  try { if (localStorage.getItem("ck-ok")) return; } catch (e) {}
  var p = location.pathname, en = p.indexOf("/en/") !== -1, inPosts = /\/posts\//.test(p);
  var policy = en ? "/en/privacy/" : "/gizlilik/";
  var txt = en ? "We use only essential cookies and local storage to improve your experience."
              : "Deneyiminizi iyileştirmek için yalnızca gerekli çerezler ve yerel depolama kullanılır.";
  var more = en ? "Cookie Policy" : "Çerez Politikası";
  var ok = en ? "Got it" : "Tamam";
  function mount() {
    if (!document.body) { setTimeout(mount, 50); return; }
    var bar = document.createElement("div");
    bar.className = "cookie-bar";
    bar.innerHTML = '<span>' + txt + ' <a href="' + policy + '">' + more + '</a></span>';
    var b = document.createElement("button");
    b.className = "btn btn-primary"; b.type = "button"; b.textContent = ok;
    b.addEventListener("click", function () { try { localStorage.setItem("ck-ok", "1"); } catch (e) {} bar.remove(); });
    bar.appendChild(b);
    document.body.appendChild(bar);
  }
  mount();
})();

/* Blog sayfalama (sayfa başına en fazla 9) */
(function () {
  var grid = document.querySelector(".posts-grid");
  if (!grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll(".post-card"));
  var per = 9;
  if (cards.length <= per) return;
  var pages = Math.ceil(cards.length / per), cur = 1;
  var nav = document.createElement("div");
  nav.className = "pagination";
  grid.parentNode.insertBefore(nav, grid.nextSibling);
  function up() { var y = grid.getBoundingClientRect().top + window.scrollY - 90; window.scrollTo({ top: y, behavior: "smooth" }); }
  function render(scroll) {
    cards.forEach(function (c, i) {
      var show = i >= (cur - 1) * per && i < cur * per;
      c.style.display = show ? "" : "none";
      if (show) c.classList.add("in");
    });
    nav.innerHTML = "";
    var prev = document.createElement("button"); prev.textContent = "‹"; prev.setAttribute("aria-label", "Önceki"); prev.disabled = cur === 1;
    prev.addEventListener("click", function () { cur--; render(true); }); nav.appendChild(prev);
    for (var p = 1; p <= pages; p++) {
      (function (p) {
        var b = document.createElement("button"); b.textContent = p;
        if (p === cur) b.setAttribute("aria-current", "true");
        b.addEventListener("click", function () { cur = p; render(true); }); nav.appendChild(b);
      })(p);
    }
    var nx = document.createElement("button"); nx.textContent = "›"; nx.setAttribute("aria-label", "Sonraki"); nx.disabled = cur === pages;
    nx.addEventListener("click", function () { cur++; render(true); }); nav.appendChild(nx);
    if (scroll) up();
  }
  render(false);
})();
