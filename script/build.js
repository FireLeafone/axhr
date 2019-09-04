/*
* npm run build
*/

"use strict";

var ora = require("ora"); // 终端 spinner
var rm = require("rimraf");
var chalk = require("chalk");
var webpack = require("webpack");
var CONFIG = require("./config");
var webpackConfig = require("./webpack.pro.config.js");
var spinner = ora("building for production...");

process.env.NODE_ENV = process.env.NODE_ENV || "production";

spinner.start();

rm(CONFIG.buildPath, err => {
  if (err) throw err;
  console.log(chalk.cyan("build step 1"));
  webpack(webpackConfig, function (err, stats) {
    spinner.stop();
    console.log(chalk.cyan("build step 2"));
    if (err) {
      throw err;
    }
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + "\n\n");

    console.log(chalk.cyan("  Build complete.\n"));
    console.log(chalk.yellow(
      "  Tip: built files are meant to be served over an HTTP server.\n" +
      "  Opening index.html over file:// won't work.\n"
    ));
  });
});