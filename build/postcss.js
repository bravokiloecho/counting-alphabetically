const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const precss = require('precss');
const cssnano = require('cssnano');
const fs = require('fs');

const srcDir = 'src';
const destDir = 'public';
const filename = 'style.css';

const runPostCss = (isProd) => {
  const basePlugins = [
    precss,
    autoprefixer,
  ];
  const prodPlugins = [
    cssnano,
  ];
  const plugins = isProd ? [...basePlugins, ...prodPlugins] : basePlugins;
  return new Promise((resolve) => {
    fs.readFile(`${srcDir}/${filename}`, (err, css) => {
      postcss(plugins)
        .process(css, { from: `${srcDir}/${filename}`, to: `${destDir}/${filename}` })
        .then(async (result) => {
          await fs.writeFile(`${destDir}/${filename}`, result.css, () => true);
          if (result.map) {
            await fs.writeFile(`${destDir}/${filename}.map`, result.map.toString(), () => true);
          }
          resolve(`🎉 CSS generated at ${destDir}/${filename}`);
        });
    });
  });
};

module.exports = runPostCss;
