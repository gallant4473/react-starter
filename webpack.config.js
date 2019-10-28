const merge = require("webpack-merge");
const glob = require("glob");
const path = require("path");
const parts = require("./config/webpack.parts");

const PATHS = {
  app: path.join(__dirname, "src"),
  build: path.resolve(__dirname, "build")
};

const commonConfig = merge([
  parts.setFreeVariable("HELLO", "hello from config"),
  parts.loadJavaScript({ include: PATHS.app }),
]);

const productionConfig = merge([
  {
    recordsPath: path.join(__dirname, "records.json"),
  },
  parts.clean(PATHS.build),
  parts.minifyJavaScript(),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true,
      },
      safe: true,
    },
  }),
  {
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "initial",
          },
        },
      },
      runtimeChunk: {
        name: "manifest",
      },
    },
  },
  parts.generateSourceMaps({ type: "source-map" }),
  parts.loadImages({
    options: {
      limit: 15000,
      name: "/images/[name].[hash:4].[ext]",
    },
  }),
  parts.loadSvg({
    options: {
      limit: 15000,
      name: "/svg/[name].[hash:4].[ext]",
    },
  }),
  parts.loadFonts({
    options: {
      name: '[name].[hash:4].[ext]',
      outputPath: 'fonts/'
    }
  }),
  parts.extractSCSS(),
  parts.extractCSS({
    use: ["css-loader", parts.autoprefix()]
  }),
  parts.purifyCSS({
    paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }),
  }),
  {
    performance: {
      hints: "warning", // "error" or false are valid too
      maxEntrypointSize: 50000, // in bytes, default 250k
      maxAssetSize: 450000, // in bytes
    },
  },
  parts.duplicatePackageChecker(),
  // parts.bundleAnalyzer(),
  parts.attachRevision(),
  parts.notifyAlert()
]);

const developmentConfig = merge([
  parts.loadImages(),
  parts.loadSvg(),
  parts.loadFonts({
    options: {
      name: '[name].[ext]',
      publicPath: '/fonts/',
      outputPath: 'fonts/'
    }
  }),
  parts.loadCSS(),
  parts.loadSCSS(),
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.writeDevBuildToFile()
]);

module.exports = ({ mode, ...rest}) => {
  const pages = [
    parts.page({
      path: 'app',
      title: 'Title',
      template: path.join(PATHS.app, 'index.ejs'),
      entry: path.join(PATHS.app, 'index.js'),
      output: mode === "production" ? {
        path: PATHS.build,
        chunkFilename: "[name].[chunkhash:4].js",
        filename: "[name].[chunkhash:4].js",
      } : {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js"
      },
      chunks: ['main', 'manifest', `vendor`]
    })
  ]
  const mainConfig = mode === "production" ? productionConfig : developmentConfig
  return merge([commonConfig, mainConfig, { mode, ...rest }].concat(pages));
};