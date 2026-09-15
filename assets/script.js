/* ==========================================================================
   LCG Building — interactions
   ========================================================================== */
(function () {
  'use strict';

  /* ══ CONFIGURATION ═════════════════════════════════════════════════════
     Adresse qui reçoit les demandes de devis, et service qui les achemine.

     FormSubmit ne demande aucune inscription : à la PREMIÈRE demande envoyée
     depuis le site en ligne, un e-mail d'activation arrive sur l'adresse
     ci-dessous — il faut cliquer son lien une fois, et c'est terminé.

     Pour passer sur un autre service (Formspree, Web3Forms, votre back-end),
     remplacez simplement FORM_ENDPOINT par son URL : le reste ne bouge pas.
     ═══════════════════════════════════════════════════════════════════════ */
  var CONTACT_EMAIL = 'ishaac.baccouche@lcgbuilding.com';
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/' + CONTACT_EMAIL;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ── Header, barre de progression, lien actif ─────────────────────────── */
  var header   = $('#header');
  var progress = $('#progress');
  var navLinks = $$('.nav__link');
  var sections = navLinks
        .map(function (a) { return $(a.getAttribute('href')); })
        .filter(Boolean);

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-stuck', y > 24);

    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

    var current = null;
    sections.forEach(function (sec) {
      if (sec.getBoundingClientRect().top <= 140) current = sec.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('is-current', a.getAttribute('href') === '#' + current);
    });
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Menu mobile ──────────────────────────────────────────────────────── */
  var burger = $('#burger');
  var nav    = $('#nav');

  function closeMenu() {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');
  }

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', closeMenu); });

  /* ── Apparition au scroll ─────────────────────────────────────────────── */
  var revealables = $$('.reveal');

  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealables.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ── Accordéons services ──────────────────────────────────────────────── */
  $$('.svc__toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var list = btn.nextElementSibling;
      var open = list.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Masquer le détail' : 'Détail des prestations';
    });
  });

  /* ── Filtres réalisations ─────────────────────────────────────────────── */
  var works = $$('.work');
  var empty = $('#worksEmpty');

  $$('.filter').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.dataset.filter;

      $$('.filter').forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
      });

      var shown = 0;
      works.forEach(function (w) {
        var match = f === 'all' || w.dataset.cat === f;
        w.classList.toggle('is-hidden', !match);
        if (match) shown++;
      });
      empty.hidden = shown > 0;
    });
  });

  /* ── Lightbox réalisations ────────────────────────────────────────────── */
  var lb      = $('#lightbox');
  var lastFocus = null;

  function openLightbox(work) {
    lastFocus = document.activeElement;

    $('#lbImg').src        = work.dataset.img;
    $('#lbImg').alt        = work.dataset.title;
    $('#lbTag').textContent     = $('.tag', work).textContent;
    $('#lbTitle').textContent   = work.dataset.title;
    $('#lbDesc').textContent    = work.dataset.desc;
    $('#lbLieu').textContent    = work.dataset.lieu;
    $('#lbSurface').textContent = work.dataset.surface;
    $('#lbDuree').textContent   = work.dataset.duree;
    $('#lbBudget').textContent  = work.dataset.budget;

    var ul = $('#lbPresta');
    ul.innerHTML = '';
    work.dataset.presta.split('|').forEach(function (item) {
      var li = document.createElement('li');
      li.textContent = item;
      ul.appendChild(li);
    });

    lb.hidden = false;
    document.body.classList.add('is-locked');
    $('#lbClose').focus();
  }

  function closeLightbox() {
    lb.hidden = true;
    document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus();
  }

  works.forEach(function (w) {
    w.setAttribute('tabindex', '0');
    w.setAttribute('role', 'button');
    w.addEventListener('click', function () { openLightbox(w); });
    w.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(w); }
    });
  });

  $$('[data-close]', lb).forEach(function (el) {
    el.addEventListener('click', closeLightbox);
  });
  $('#lbClose').addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!lb.hidden) closeLightbox();
    closeMenu();
  });

  /* ── Comparateur avant / après ────────────────────────────────────────── */
  var baRange = $('#baRange');
  var baClip  = $('#baClip');
  var baGrip  = $('.ba__grip');

  function setSplit(v) {
    baClip.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)';
    baGrip.style.left = v + '%';
  }
  baRange.addEventListener('input', function () { setSplit(parseFloat(baRange.value)); });
  setSplit(50);

  /* ── Récapitulatif de projet ──────────────────────────────────────────── */
  var estType    = $('#estType');
  var estSurface = $('#estSurface');
  var estOutSurf = $('#estSurfaceOut');
  var estStruct  = $('#estStruct');
  var estOccupe  = $('#estOccupe');
  var estOut     = $('#estOut');
  var estUnit    = $('#estUnit');
  var finish     = 'standard';

  function recap() {
    var parts = [estType.value, estSurface.value + ' m²', 'finition ' + finish];
    if (estStruct.checked) parts.push('travaux structurels');
    if (estOccupe.checked) parts.push('site occupé');
    return parts.join(' — ');
  }

  function refreshRecap() {
    estOutSurf.textContent = estSurface.value;
    estOut.textContent     = recap();
    estUnit.textContent    = (estStruct.checked || estOccupe.checked)
      ? 'Ces contraintes se chiffrent sur place : la visite est gratuite.'
      : 'Prochaine étape : une visite sur place, gratuite.';
  }

  $$('#estFinish button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('#estFinish button').forEach(function (x) { x.classList.remove('is-active'); });
      b.classList.add('is-active');
      finish = b.textContent.trim().toLowerCase();
      refreshRecap();
    });
  });
  [estType, estSurface, estStruct, estOccupe].forEach(function (el) {
    el.addEventListener('input', refreshRecap);
  });
  refreshRecap();

  // Le récapitulatif part directement dans le formulaire de contact.
  $('#estSend').addEventListener('click', function () {
    var msg = $('#message');
    var line = 'Mon projet : ' + recap() + '.';
    msg.value = msg.value.trim() ? msg.value.trim() + '\n\n' + line : line + '\n\n';

    var select = $('#type');
    $$('option', select).forEach(function (o) {
      if (o.textContent.trim() === estType.value.trim()) select.value = o.value;
    });

    document.getElementById('contact').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    setTimeout(function () { msg.focus(); }, reduced ? 0 : 600);
  });

  /* ── Formulaire de devis ──────────────────────────────────────────────── */
  var form   = $('#devis');
  var status = $('#formStatus');
  var rgpd   = $('#rgpd');

  /* Mise en forme du téléphone pendant la frappe : 07 43 69 66 12 */
  var tel = $('#tel');

  function groupDigits(digits) {
    return digits.replace(/(\d{2})(?=\d)/g, '$1 ');
  }

  tel.addEventListener('input', function () {
    var caret       = tel.selectionStart;
    var digitsLeft  = (tel.value.slice(0, caret).match(/\d/g) || []).length;
    var digits      = (tel.value.match(/\d/g) || []).join('');

    // +33 6 12 … ou 0033 … collé depuis un contact : on repasse en 0X
    if (digits.length > 10 && digits.indexOf('00') === 0) digits = digits.slice(2);
    if (digits.length > 10 && digits.indexOf('33') === 0) digits = '0' + digits.slice(2);
    digits = digits.slice(0, 10);

    tel.value = groupDigits(digits);

    // On replace le curseur après le même nombre de chiffres qu'avant
    var pos = 0, seen = 0;
    while (pos < tel.value.length && seen < digitsLeft) {
      if (/\d/.test(tel.value.charAt(pos))) seen++;
      pos++;
    }
    tel.setSelectionRange(pos, pos);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;

    $$('input[required], textarea[required]', form).forEach(function (input) {
      if (input.type === 'checkbox') return;
      var ok = input.value.trim() !== '' &&
               (input.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
      input.closest('.field').classList.toggle('is-error', !ok);
      if (!ok && valid) { input.focus(); valid = false; }
    });

    rgpd.closest('.check').classList.toggle('is-error', !rgpd.checked);
    if (!rgpd.checked && valid) { rgpd.focus(); valid = false; }

    if (!valid) {
      setStatus('Merci de compléter les champs obligatoires.', 'err');
      return;
    }

    var d = new FormData(form);
    if (d.get('_honey')) return;            // robot : on ignore silencieusement

    var payload = {
      _subject:  'Demande de devis — ' + d.get('nom'),
      _template: 'table',
      _captcha:  'false',
      _replyto:  d.get('email'),
      Nom:       d.get('nom'),
      Email:     d.get('email'),
      Téléphone: d.get('tel') || '—',
      Projet:    d.get('type'),
      Démarrage: d.get('delai'),
      Message:   d.get('message')
    };

    var submit = $('button[type=submit]', form);
    var label  = submit.textContent;
    submit.disabled = true;
    submit.textContent = 'Envoi en cours…';
    setStatus('', '');

    fetch(FORM_ENDPOINT, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify(payload)
    })
    .then(function (r) { return r.json().catch(function () { return {}; }); })
    .then(function (res) {
      if (String(res.success) !== 'true') throw new Error(res.message || 'échec');
      form.reset();
      setStatus('Demande envoyée. Nous vous rappelons sous 24 h ouvrées.', 'ok');
    })
    .catch(function () {
      // Secours : on ouvre la messagerie du visiteur avec la demande pré-remplie.
      var body = [
        'Nom : '       + d.get('nom'),
        'E-mail : '    + d.get('email'),
        'Téléphone : ' + (d.get('tel') || '—'),
        'Projet : '    + d.get('type'),
        'Démarrage : ' + d.get('delai'),
        '',
        d.get('message')
      ].join('\n');

      window.location.href = 'mailto:' + CONTACT_EMAIL
        + '?subject=' + encodeURIComponent('Demande de devis — ' + d.get('nom'))
        + '&body='    + encodeURIComponent(body);

      setStatus('L\u2019envoi automatique a échoué. Votre messagerie s\u2019ouvre, ' +
                'ou appelez-nous au 07 43 69 66 12.', 'err');
    })
    .then(function () {
      submit.disabled = false;
      submit.textContent = label;
    });
  });

  function setStatus(msg, kind) {
    status.textContent = msg;
    status.className = 'form__status' + (kind ? ' form__status--' + kind : '');
  }

  /* ── Année courante ───────────────────────────────────────────────────── */
  $('#year').textContent = new Date().getFullYear();
})();
