// Load canvas-confetti from CDN and expose window.confetti
(function() {
  if (!window.confetti) {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    script.async = true;
    script.onload = function() {
      window.confetti = window.confetti || confetti;
    };
    document.head.appendChild(script);
  }
})();
