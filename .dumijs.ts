/**
 * dumi 配置文件
 */
import { defineConfig } from 'dumi';
const pname = '/bdx-chakra';

export default defineConfig({
  base: pname + '/',
  publicPath: pname + '/',
  outputPath: 'docsDist',
  favicons: [pname + 'favicon.ico'],
  hash: true,
  themeCofing: {
    name: 'chakra',
    description: 'chakra插件开发库',
    logo: pname + '/logo.png',
  },
  theme: {
    '@primary-color': '#0f89df',
  },
  styles: [],
});
