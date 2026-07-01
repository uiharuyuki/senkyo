(function () {
  var toggle = document.getElementById('menuToggle');
  var menu = document.getElementById('siteMenu');
  if (!toggle || !menu) return;

  var lastFocused = null;

  function open() {
    lastFocused = document.activeElement;
    menu.classList.add('is-open');
    toggle.classList.add('is-active');
    toggle.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('has-menu-open');
    var firstLink = menu.querySelector('a, button');
    if (firstLink) firstLink.focus();
  }

  function close() {
    menu.classList.remove('is-open');
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('has-menu-open');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  toggle.addEventListener('click', function () {
    if (menu.classList.contains('is-open')) close(); else open();
  });

  menu.querySelectorAll('[data-menu-close]').forEach(function (el) {
    el.addEventListener('click', close);
  });

  menu.querySelectorAll('.site-menu__list a').forEach(function (a) {
    a.addEventListener('click', function () {
      setTimeout(close, 30);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) close();
  });
})();
