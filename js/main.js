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
  var policy = (inPosts ? "../" : "") + (en ? "privacy.html" : "gizlilik.html");
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
