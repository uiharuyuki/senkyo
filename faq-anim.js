(function () {
  var items = document.querySelectorAll('.faq-list details');
  if (!items.length) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  var DURATION = 260;

  items.forEach(function (details) {
    var summary = details.querySelector('summary');
    var content = details.querySelector('p');
    if (!summary || !content) return;

    content.style.overflow = 'hidden';
    content.style.transition = 'max-height ' + DURATION + 'ms ease, padding ' + DURATION + 'ms ease, margin ' + DURATION + 'ms ease';

    if (!details.open) {
      content.style.maxHeight = '0px';
      content.style.paddingTop = '0';
      content.style.paddingBottom = '0';
    }

    var animating = false;

    summary.addEventListener('click', function (e) {
      e.preventDefault();
      if (animating) return;
      animating = true;

      if (details.open) {
        var h = content.scrollHeight;
        content.style.maxHeight = h + 'px';
        content.style.paddingTop = '';
        content.style.paddingBottom = '';
        requestAnimationFrame(function () {
          content.style.maxHeight = '0px';
          content.style.paddingTop = '0';
          content.style.paddingBottom = '0';
        });
        setTimeout(function () {
          details.open = false;
          animating = false;
        }, DURATION);
      } else {
        details.open = true;
        content.style.maxHeight = '0px';
        content.style.paddingTop = '0';
        content.style.paddingBottom = '0';
        requestAnimationFrame(function () {
          var h = content.scrollHeight;
          content.style.maxHeight = h + 'px';
          content.style.paddingTop = '';
          content.style.paddingBottom = '';
        });
        setTimeout(function () {
          content.style.maxHeight = 'none';
          animating = false;
        }, DURATION);
      }
    });
  });
})();
