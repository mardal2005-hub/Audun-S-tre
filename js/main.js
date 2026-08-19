/* ============================================================
   Byggfirma Audun Sætre – main.js (DEMO)
   ============================================================ */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobil-meny ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');

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

  /* ---------- Årstall i footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* ---------- Scroll reveal (dempet fade-in) ---------- */
  var revealSelectors = '.section-head, .service-card, .why-card, .about-text, .about-visual, .ref-item, .contact-info, .contact-form-wrap, .contact-map, .cta-inner, .intro .container';
  var revealEls = document.querySelectorAll(revealSelectors);

  if (revealEls.length && 'IntersectionObserver' in window && !prefersReduced) {
    revealEls.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Header: skygge ved scroll ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 12) { header.classList.add('scrolled'); }
      else { header.classList.remove('scrolled'); }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Scroll-spy: marker aktiv meny-lenke ---------- */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.main-nav a[href^="#"]')
  );
  if (navLinks.length && 'IntersectionObserver' in window) {
    var linkById = {};
    var spySections = [];
    navLinks.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = id && document.getElementById(id);
      if (section) { linkById[id] = link; spySections.push(section); }
    });

    var setActive = function (id) {
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      if (linkById[id]) { linkById[id].classList.add('active'); }
    };

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { setActive(entry.target.id); }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    spySections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Skjul flytende ring-knapp nær kontakt/footer ---------- */
  var fab = document.querySelector('.call-fab');
  if (fab && 'IntersectionObserver' in window) {
    var zones = [
      document.getElementById('kontakt'),
      document.querySelector('.cta'),
      document.querySelector('.site-footer')
    ].filter(Boolean);
    var zoneVisible = zones.map(function () { return false; });
    var fabObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var idx = zones.indexOf(entry.target);
        if (idx > -1) { zoneVisible[idx] = entry.isIntersecting; }
      });
      var anyVisible = zoneVisible.some(function (v) { return v; });
      fab.classList.toggle('is-hidden', anyVisible);
    }, { threshold: 0 });
    zones.forEach(function (z) { fabObs.observe(z); });
  }

  /* ---------- Lett parallax på hero-bildet ---------- */
  var hero = document.querySelector('.hero');
  var heroMedia = document.querySelector('.hero-media');

  if (hero && heroMedia && !prefersReduced && !window.matchMedia('(max-width: 768px)').matches) {
    var heroH = hero.offsetHeight || 1;
    var ticking = false;
    var render = function () {
      ticking = false;
      var rect = hero.getBoundingClientRect();
      if (rect.bottom <= 0) { return; }
      var p = Math.min(Math.max(-rect.top / heroH, 0), 1);
      heroMedia.style.transform = 'translate3d(0,' + (p * heroH * 0.08).toFixed(1) + 'px,0) scale(' + (1.02 + p * 0.04).toFixed(3) + ')';
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(render); }
    }, { passive: true });
    window.addEventListener('resize', function () { heroH = hero.offsetHeight || 1; render(); }, { passive: true });
    render();
  }

  /* ---------- Forhåndsutfyll tema fra tjenestekort ---------- */
  var subjectSelect = document.getElementById('subject');
  var messageField = document.getElementById('message');

  document.querySelectorAll('[data-service]').forEach(function (link) {
    link.addEventListener('click', function () {
      var service = link.getAttribute('data-service');
      if (subjectSelect) {
        for (var i = 0; i < subjectSelect.options.length; i++) {
          if (subjectSelect.options[i].value === service) {
            subjectSelect.selectedIndex = i;
            break;
          }
        }
      }
      if (messageField && !messageField.value.trim()) {
        messageField.value = 'Hei! Jeg ønsker et uforpliktende tilbud på ' + service.toLowerCase() + '. ';
      }
    });
  });

  /* ---------- Kontaktskjema (demo – sender ingen data) ---------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  function setStatus(msg, type) {
    if (!status) return;
    status.textContent = msg;
    status.className = 'form-status' + (type ? ' ' + type : '');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var name = (new FormData(form).get('navn') || '').toString().trim();
      form.reset();
      setStatus('Takk' + (name ? ', ' + name.split(' ')[0] : '') + '! Dette er en demo, så ingenting ble sendt. På en ekte side ville forespørselen gått rett til firmaet.', 'success');
    });
  }
})();
