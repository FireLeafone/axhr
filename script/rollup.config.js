// rollup.config.js
const nodeResolve = require('@rollup/plugin-node-resolve').default; // 处理npm依赖
const babel = require('@rollup/plugin-babel').default; // 配合babel, 处理新特性兼容
const commonjs = require('@rollup/plugin-commonjs'); // 处理 CommonJS 转换成 ES2015 模块
const reslint = require('@rollup/plugin-eslint');
const rterser = require('rollup-plugin-terser');

const path = require("path");
const pkg = require('../package.json');
const CONFIG = require("./config");
const utils = require("./utils");

module.exports = {
  input: utils.resolve("src/index.js"),
  output: [{
    file: path.join(CONFIG.buildPath, 'axhr.js'),
    format: 'umd',
    name: pkg.name,
    plugins: [rterser.terser()]
  }, {
    file: path.join(CONFIG.buildPath, 'axhr.es.js'),
    format: 'es',
    name: pkg.name,
  }],
  plugins: [
    // 验证导入的文件
    reslint.eslint({
      throwOnError: true, // lint 结果有错误将会抛出异常
      throwOnWarning: true,
      include: ['src/**/*.js'],
      exclude: ['node_modules/**', 'lib/**', '*.js'],
    }),
    nodeResolve({
      // 将自定义选项传递给解析插件
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      },
    }),
    commonjs(),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**', // 防止打包node_modules下的文件
    })
  ],
  // 指出应将哪些模块视为外部模块
  // external: ['lodash']
  external: id => /lodash|axios/.test(id), // 处理 `import _merge from 'lodash/merge';`
};
