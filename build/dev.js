const bs = require('browser-sync').create();

// BUILDERS
const runPostCss = require('./postcss');

// CONSTANTS
const srcDir = 'src';
const destDir = 'public';

// Listen to change events on HTML and JS
const reloadFiles = [
  `./${destDir}/*.html`,
  `./${destDir}/*.js`,
];
bs.watch(reloadFiles).on('change', bs.reload);

// Listen to CSS changes
bs.watch(`./${destDir}/*.css`, (event) => {
  if (event === 'change') {
    bs.reload('*.css');
  }
});

// Run PostCSS
bs.watch(`./${srcDir}/*.css`, () => {
  runPostCss();
});

// .init starts the server
bs.init({
  server: './public',
});
