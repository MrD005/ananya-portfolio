(() => {
  const localHosts = new Set(['localhost', '127.0.0.1', '::1']);

  if (localHosts.has(window.location.hostname)) return;

  window.va = window.va || function queueAnalyticsEvent(...args) {
    (window.vaq = window.vaq || []).push(args);
  };

  const script = document.createElement('script');
  script.src = '/_vercel/insights/script.js';
  script.async = true;
  script.dataset.sdkn = 'static-html';
  document.head.appendChild(script);
})();
