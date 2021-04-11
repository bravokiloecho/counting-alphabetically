/* eslint-disable no-alert, no-console */

const runPostCss = require('./postcss');

const build = async () => {
  const res = await runPostCss(true);
  console.info(res);
};

build();
