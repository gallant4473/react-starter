import merge from 'webpack-merge';
import { sync } from 'glob';
import { join, resolve } from 'path';
import {
  setFreeVariable, loadJavaScript, clean, minifyJavaScript, minifyCSS, generateSourceMaps,
  loadImages, loadSvg, loadFonts, extractSCSS, autoprefix, extractCSS, purifyCSS,
  duplicatePackageChecker, loadSvgSprite,
  attachRevision, notifyAlert, loadCSS, loadSCSS, devServer, writeDevBuildToFile, page,
  bundleAnalyzer,
} from './config/webpack.parts.babel';
import CONFIG from './config/config';

const PATHS = {
  app: join(__dirname, 'src'),
  build: resolve(__dirname, 'build'),
  svgImages: join(__dirname, 'public/svg/small/*.svg'),
};

const commonConfig = (type, app) => merge([
  {
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      },
    },
  },
  setFreeVariable({
    ...CONFIG[type][app], current: app, APPS: CONFIG[type],
  }),
  loadJavaScript({ include: `${PATHS.app}/${app}` }),
  loadSvgSprite({
    include: PATHS.svgImages,
  }),
]);

const productionConfig = (type, app) => merge([
  {
    recordsPath: join(__dirname, 'records.json'),
  },
  clean(),
  minifyJavaScript(),
  minifyCSS({
    options: {
      discardComments: {
        removeAll: true,
      },
      safe: true,
    },
  }),
  generateSourceMaps({ type: 'source-map' }),
  loadImages({
    options: {
      limit: 15000,
      name: '/images/[name].[hash:4].[ext]',
    },
  }),
  loadSvg({
    options: {
      limit: 15000,
      name: '/svg/[name].[hash:4].[ext]',
    },
  }),
  loadFonts({
    options: {
      name: '[name].[hash:4].[ext]',
      outputPath: 'fonts/',
    },
  }),
  extractSCSS([autoprefix()]),
  extractCSS({
    use: ['css-loader', autoprefix()],
  }),
  purifyCSS({
    paths: sync(`${`${PATHS.app}/${app}`}/**/*.js`, { nodir: true }),
  }),
  {
    performance: {
      hints: 'warning', // "error" or false are valid too
      maxEntrypointSize: 50000, // in bytes, default 250k
      maxAssetSize: 450000, // in bytes
    },
  },
  duplicatePackageChecker(),
  bundleAnalyzer(),
  attachRevision(),
  notifyAlert(),
]);

const developmentConfig = merge([
  loadImages(),
  loadSvg(),
  loadFonts({
    options: {
      name: '[name].[ext]',
      publicPath: '/fonts/',
      outputPath: 'fonts/',
    },
  }),
  loadCSS(),
  loadSCSS(),
  devServer({
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  writeDevBuildToFile(),
]);

export default ({ mode, ...rest }) => {
  const { app, type } = rest;
  const pages = [
    page({
      path: 'app',
      title: 'Title',
      template: join(`${PATHS.app}/${app}`, 'index.ejs'),
      entry: ['@babel/polyfill', join(`${PATHS.app}/${app}`, 'index.js')],
      output: mode === 'production' ? {
        path: `${PATHS.build}/${app}-${type}`,
        chunkFilename: '[name].[chunkhash:4].js',
        filename: '[name].[chunkhash:4].js',
      } : {
        path: resolve(__dirname, `dist/${app}`),
        filename: 'main.js',
      },
    }),
  ];
  const mainConfig = mode === 'production' ? productionConfig(type, app) : developmentConfig;
  return merge([commonConfig(type, app), mainConfig, { mode }].concat(pages));
};
