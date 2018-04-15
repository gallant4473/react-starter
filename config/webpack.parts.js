const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PurifyCSSPlugin = require('purifycss-webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const cssnano = require('cssnano')
const HtmlWebpackPlugin = require('html-webpack-plugin')

exports.page = ({
  path = '',
  template = require.resolve('html-webpack-plugin/default_index.ejs'),
  title,
  entry,
  output,
  chunks
} = {}) => {
  console.log(title, path, entry, chunks)
  return ({
    entry,
    plugins: [
      new HtmlWebpackPlugin({
        chunks,
        filename: 'index.html',
        template,
        title
      })
    ]
  })
}

exports.minifyCSS = ({ options }) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false
    })
  ]
})

exports.minifyJavaScript = () => ({
  optimization: {
    minimizer: [new UglifyWebpackPlugin({ sourceMap: true })]
  }
})

exports.attachRevision = () => ({
  plugins: [
    new webpack.BannerPlugin({
      banner: new GitRevisionPlugin().version()
    })
  ]
})

exports.clean = path => ({
  plugins: [new CleanWebpackPlugin([path], {root: '/'})]
})

exports.purifyCSS = ({ paths }) => ({
  plugins: [new PurifyCSSPlugin({ paths })]
})

exports.extractCSS = ({ include, exclude, use } = {}) => {
  // Output extracted CSS to a file
  const plugin = new ExtractTextPlugin({
    allChunks: true,
    filename: '[name].[md5:contenthash:hex:4].css'
  })
  return {
    module: {
      rules: [
        {
          test: /\.scss$/,
          include,
          exclude,
          use: plugin.extract({
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 3
                }
              }, {
                loader: 'postcss-loader',
                options: {
                  plugins: () => ([require('autoprefixer')()])
                }
              }, {
                loader: 'sass-loader'
              }
            ],
            fallback: 'style-loader'
          })
        }
      ]
    },
    plugins: [plugin]
  }
}

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    stats: 'errors-only',
    host, // Defaults to `localhost`
    port, // Defaults to 8080
    open: true,
    overlay: true,
    historyApiFallback: true
  }
})

exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.scss$/,
        include,
        exclude,
        use: [
          'style-loader', {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          }, {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => ([require('autoprefixer')()])
            }
          }, {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  }
})

exports.autoprefix = () => ({
  loader: 'postcss-loader',
  options: {
    plugins: () => [require('autoprefixer')()]
  }
})

exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        include,
        exclude,
        use: {
          loader: 'url-loader',
          options
        }
      }
    ]
  }
})

exports.loadFonts = ({include, exclude, options} = {}) => ({
  module: {
    rules: [
      {
        test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        include,
        exclude,
        use: {
          loader: 'file-loader',
          options
        }
      }
    ]
  }
})

exports.loadJavaScript = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }, {
        test: /\.js$/,
        include,
        exclude,
        use: 'babel-loader'
      }
    ]
  }
})

exports.generateSourceMaps = ({ type }) => ({
  devtool: type
})

exports.setFreeVariable = (value) => {
  const env = {}
  for (var key in value) {
    env[key] = JSON.stringify(value[key])
  }
  return {
    plugins: [new webpack.DefinePlugin(env)]
  }
}

exports.HMR = () => ({
  plugins: [new webpack.HotModuleReplacementPlugin()]
})
