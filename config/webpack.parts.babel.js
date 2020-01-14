import {
  HotModuleReplacementPlugin, WatchIgnorePlugin, BannerPlugin, DefinePlugin,
} from 'webpack';
import { join } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackNotifierPlugin from 'webpack-notifier';
import WriteFilePlugin from 'write-file-webpack-plugin';
import MiniCssExtractPlugin, { loader as _loader } from 'mini-css-extract-plugin';
import PurifyCSSPlugin from 'purifycss-webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import GitRevisionPlugin from 'git-revision-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import cssnano from 'cssnano';
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import SVGSpritemapPlugin from 'svg-spritemap-webpack-plugin';

export function page({
  template = require.resolve('html-webpack-plugin/default_index.ejs'),
  title,
  entry,
  output,
} = {}) {
  return ({
    entry,
    output,
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template,
        title,
      }),
    ],
  });
}

export function devServer({ host, port } = {}) {
  return ({
    devServer: {
      stats: 'errors-only',
      host, // Defaults to `localhost`
      port, // Defaults to 8080
      open: false,
      historyApiFallback: true,
      overlay: true,
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
      },
      contentBase: join(__dirname, '../public'),
    },
    plugins: [
      new HotModuleReplacementPlugin(),
      new WatchIgnorePlugin([
        join(__dirname, 'node_modules'),
      ]),
    ],
  });
}

export function extractHtml() {
  return ({
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Webpack demo',
      }),
    ],
  });
}

export function notifyAlert() {
  return ({
    plugins: [
      new WebpackNotifierPlugin(),
    ],
  });
}

export function writeDevBuildToFile() {
  return ({
    plugins: [
      new WriteFilePlugin(),
    ],
  });
}

export function loadCSS({ include, exclude } = {}) {
  return ({
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
  });
}

export function loadSCSS({ include, exclude } = {}) {
  return ({
    module: {
      rules: [
        {
          test: /\.scss$/,
          include,
          exclude,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            'sass-loader',
          ],
        },
      ],
    },
  });
}

export function extractCSS({ include, exclude, use = [] } = {}) {
  // Output extracted CSS to a file
  const plugin = new MiniCssExtractPlugin({
    filename: '[name].[contenthash:4].css',
  });

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,

          use: [
            _loader,
          ].concat(use),
        },
      ],
    },
    plugins: [plugin],
  };
}

export function autoprefix() {
  return ({
    loader: 'postcss-loader',
    options: {
      plugins: () => [require('autoprefixer')()],
    },
  });
}

export function extractSCSS({ include, exclude } = {}) {
  // Output extracted CSS to a file
  const plugin = new MiniCssExtractPlugin({
    filename: '[name].[contenthash:4].css',
  });

  return {
    module: {
      rules: [
        {
          test: /\.scss$/,
          include,
          exclude,
          use: [
            _loader,
            'css-loader',
            autoprefix(),
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [plugin],
  };
}

export function purifyCSS({ paths } = {}) {
  return ({
    plugins: [new PurifyCSSPlugin({ paths })],
  });
}

export function loadImages({ include, exclude, options } = {}) {
  return ({
    module: {
      rules: [
        {
          test: /\.(png|jpg|jpeg)$/,
          include,
          exclude,
          use: {
            loader: 'url-loader',
            options,
          },
        },
      ],
    },
  });
}

export function loadSvg({ include, exclude, options } = {}) {
  return ({
    module: {
      rules: [
        {
          test: /\.svg$/,
          include,
          exclude,
          use: {
            loader: 'file-loader',
            options,
          },
        },
      ],
    },
  });
}

export function loadSvgSprite({ include } = {}) {
  return ({
    plugins: [
      new SVGSpritemapPlugin(
        include,
        {
          output: {
            filename: 'spritemap.svg',
            svgo: false,
          },
          styles: join(__dirname, '../public/styles/_sprites.scss'),
        },
      ),
    ],
  });
}

export function loadFonts({ include, exclude, options = {} } = {}) {
  return ({
    module: {
      rules: [
        {
          test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
          include,
          exclude,
          use: {
            loader: 'file-loader',
            options,
          },
        },
      ],
    },
  });
}

export function loadJavaScript({ include, exclude } = {}) {
  return ({
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
        }, {
          test: /\.js$/,
          include,
          exclude,
          use: 'babel-loader',
        },
      ],
    },
  });
}

export function generateSourceMaps({ type }) {
  return ({
    devtool: type,
  });
}

export function clean() {
  return ({
    plugins: [new CleanWebpackPlugin()],
  });
}

export function attachRevision() {
  return ({
    plugins: [
      new BannerPlugin({
        banner: new GitRevisionPlugin().version(),
      }),
    ],
  });
}

export function minifyJavaScript() {
  return ({
    optimization: {
      minimizer: [new TerserPlugin({ sourceMap: true })],
    },
  });
}

export function minifyCSS({ options }) {
  return ({
    plugins: [
      new OptimizeCSSAssetsPlugin({
        cssProcessor: cssnano,
        cssProcessorOptions: options,
        canPrint: false,
      }),
    ],
  });
}

export function setFreeVariable(value) {
  const newValue = { ...value };
  const env = {};
  Object.keys(newValue).forEach((data) => { env[data] = JSON.stringify(newValue[data]); });
  return {
    plugins: [new DefinePlugin({
      'process.env': env,
    })],
  };
}

export function duplicatePackageChecker() {
  return (
    {
      plugins: [new DuplicatePackageCheckerPlugin()],
    }
  );
}

export function bundleAnalyzer() {
  return ({
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),
    ],
  });
}
