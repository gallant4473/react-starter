const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackNotifierPlugin = require('webpack-notifier');
const WriteFilePlugin = require("write-file-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cssnano = require("cssnano");
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

exports.page = ({
  path = '',
  template = require.resolve('html-webpack-plugin/default_index.ejs'),
  title,
  entry,
  output,
  chunks
} = {}) => ({
  entry,
  output,
  plugins: [
    new HtmlWebpackPlugin({
      chunks,
      filename: 'index.html',
      template,
      title
    }),
  ],
});

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    stats: "errors-only",
    host, // Defaults to `localhost`
    port, // Defaults to 8080
    open: false,
    historyApiFallback: true,
    overlay: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
    contentBase: path.join(__dirname, '../public'),
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.WatchIgnorePlugin([
      path.join(__dirname, "node_modules")
    ]),
  ]
});

exports.extractHtml = () => ({
  plugins: [
    new HtmlWebpackPlugin({
      title: "Webpack demo",
    }),
  ]
})

exports.notifyAlert = () => ({
  plugins: [
    new WebpackNotifierPlugin()
  ],
})

exports.writeDevBuildToFile = () => ({
  plugins: [
    new WriteFilePlugin(),
  ]
})

exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
});

exports.loadSCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.scss$/,
        include,
        exclude,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          "sass-loader"
        ],
      },
    ],
  },
});

exports.extractCSS = ({ include, exclude, use = [] } = {}) => {
  // Output extracted CSS to a file
  const plugin = new MiniCssExtractPlugin({
    filename: "[name].[contenthash:4].css",
  });

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,

          use: [
            MiniCssExtractPlugin.loader,
          ].concat(use),
        },
      ],
    },
    plugins: [plugin],
  };
};

exports.extractSCSS = ({ include, exclude, use = [] } = {}) => {
  // Output extracted CSS to a file
  const plugin = new MiniCssExtractPlugin({
    filename: "[name].[contenthash:4].css"
  });

  return {
    module: {
      rules: [
        {
          test: /\.scss$/,
          include,
          exclude,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader"
          ],
        },
      ],
    },
    plugins: [plugin],
  };
};

exports.purifyCSS = ({ paths } = {}) => ({
  plugins: [new PurifyCSSPlugin({ paths })],
});

exports.autoprefix = () => ({
  loader: "postcss-loader",
  options: {
    plugins: () => [require("autoprefixer")()],
  },
});

exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg)$/,
        include,
        exclude,
        use: {
          loader: "url-loader",
          options,
        },
      },
    ],
  },
});

exports.loadSvg = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.svg$/,
        include,
        exclude,
        use: {
          loader: "file-loader",
          options,
        },
      },
    ],
  },
});

exports.loadFonts = ({ include, exclude, options = {} } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        include,
        exclude,
        use: {
          loader: "file-loader",
          options,
        },
      },
    ],
  },
});

exports.loadJavaScript = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,
        use: "babel-loader",
      },
    ],
  },
});

exports.generateSourceMaps = ({ type }) => ({
  devtool: type,
});

exports.clean = path => ({
  plugins: [new CleanWebpackPlugin()],
});

exports.attachRevision = () => ({
  plugins: [
    new webpack.BannerPlugin({
      banner: new GitRevisionPlugin().version(),
    }),
  ],
});

exports.minifyJavaScript = () => ({
  optimization: {
    minimizer: [new TerserPlugin({ sourceMap: true })],
  },
});

exports.minifyCSS = ({ options }) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false,
    }),
  ],
});

exports.setFreeVariable = (key, value) => {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [new webpack.DefinePlugin(env)],
  };
};

exports.duplicatePackageChecker = () => (
  {
    plugins: [new DuplicatePackageCheckerPlugin()]
  }
)

exports.bundleAnalyzer = () => ({
  plugins: [
    new BundleAnalyzerPlugin()
  ]
})
