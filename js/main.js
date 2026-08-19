/* ============================================================
   Byggfirma Audun Sætre – main.js
   ============================================================ */
(function () {
  'use strict';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobilmeny ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Lukk meny' : 'Åpne meny');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Åpne meny');
      }
    });
  }

  /* ---------- Årstall ---------- */
  var y = document.getElementById('year');
  if (y) { y.textContent = new Date().getFullYear(); }

  /* ---------- Header: solid når hero er passert ---------- */
  var header = document.querySelector('.site-header');
  var hero = document.querySelector('.hero');
  if (header && hero && !header.classList.contains('static-solid')) {
    var setSolid = function () {
      var threshold = hero.offsetHeight - header.offsetHeight - 10;
      header.classList.toggle('solid', window.scrollY > threshold);
    };
    setSolid();
    window.addEventListener('scroll', setSolid, { passive: true });
    window.addEventListener('resize', setSolid, { passive: true });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Aktiv meny-lenke ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (links.length && 'IntersectionObserver' in window) {
    var byId = {}, sections = [];
    links.forEach(function (l) {
      var id = l.getAttribute('href').slice(1);
      var s = id && document.getElementById(id);
      if (s) { byId[id] = l; sections.push(s); }
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('active'); });
          if (byId[en.target.id]) { byId[en.target.id].classList.add('active'); }
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Kontaktskjema (demo) ---------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var navn = (new FormData(form).get('navn') || '').toString().trim().split(' ')[0];
      form.reset();
      if (status) {
        status.textContent = 'Takk' + (navn ? ', ' + navn : '') + '. Dette er en demo – ingenting ble sendt. På en ekte side går forespørselen rett til firmaet.';
        status.className = 'form-status ok';
      }
    });
  }
})();
