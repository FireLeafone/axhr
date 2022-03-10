/*
* npm run build
*/

"use strict";

var ora = require("ora"); // 终端 spinner
var rm = require("rimraf");
var chalk = require("chalk");
var rollup = require('rollup');
var rollupConfig = require("./rollup.config.js");
var CONFIG = require("./config");

var spinner = ora("building for production...");

process.env.NODE_ENV = process.env.NODE_ENV || "production";

spinner.start();

rm(CONFIG.buildPath, async (err) => {
  if (err) throw err;
  console.log(chalk.cyan("build start ..."));
  spinner.stop();

  const outOptions = rollupConfig.output;
  const bundle = await rollup.rollup(rollupConfig);

  // 写入需要遍历输出配置
  if (Array.isArray(outOptions)) {
    outOptions.forEach(async (outOption) => {
      await bundle.write(outOption);
    });
    console.log(chalk.cyan("build success"));
  }
});
