(function () {
  var loader = document.getElementById('appLoader');
  if (!loader) return;

  var MIN_MS = 1000;
  var FADE_MS = 400;
  var seen = false;
  try { seen = sessionStorage.getItem('senkyoLoaderSeen') === '1'; } catch (e) {}

  if (seen) {
    loader.classList.add('is-removed');
    return;
  }

  var start = (window.performance && performance.now) ? performance.now() : Date.now();

  function hide() {
    var now = (window.performance && performance.now) ? performance.now() : Date.now();
    var elapsed = now - start;
    var wait = Math.max(0, MIN_MS - elapsed);
    setTimeout(function () {
      loader.classList.add('is-hidden');
      try { sessionStorage.setItem('senkyoLoaderSeen', '1'); } catch (e) {}
      setTimeout(function () { loader.classList.add('is-removed'); }, FADE_MS);
    }, wait);
  }

  if (document.readyState === 'complete') {
    hide();
  } else {
    window.addEventListener('load', hide);
  }
})();
