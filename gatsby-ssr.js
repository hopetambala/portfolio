const React = require('react');

// Runs synchronously before first paint — reads localStorage and sets
// data-theme/data-mode on <html> to prevent flash of unstyled content.
const themeInitScript = `
(function() {
  try {
    var t = localStorage.getItem('dlite-theme') || 'kooky';
    var m = localStorage.getItem('dlite-mode') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.setAttribute('data-mode', m);
  } catch (e) {}
})();
`;

exports.onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
  const components = getHeadComponents();
  replaceHeadComponents([
    React.createElement('script', {
      key: 'dlite-theme-init',
      dangerouslySetInnerHTML: { __html: themeInitScript },
    }),
    ...components,
  ]);
};
