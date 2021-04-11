const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const precss = require('precss');
const cssnano = require('cssnano');
const fs = require('fs');

const srcDir = 'src';
const destDir = 'public';
const filename = 'style.css';

const plugins = [
  precss,
  autoprefixer,
  cssnano,
];

fs.readFile(`${srcDir}/${filename}`, (err, css) => {
  postcss(plugins)
    .process(css, { from: `${srcDir}/${filename}`, to: `${destDir}/${filename}` })
    .then((result) => {
      fs.writeFile(`${destDir}/${filename}`, result.css, () => true);
      if (result.map) {
        fs.writeFile(`${destDir}/${filename}.map`, result.map.toString(), () => true);
      }
    });
});
