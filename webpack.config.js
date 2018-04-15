const path = require('path')
const merge = require('webpack-merge')
const glob = require('glob')

const parts = require('./config/webpack.parts')
const CONFIG = require('./config/config.json')

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build'),
  style: path.join(__dirname, 'src/assets/styles')
}

const commonConfig = (type, app) => {
  return merge([
    {
      output: {
        path: path.join(__dirname, 'build', `${app}-${type.toLowerCase()}`),
        publicPath: '/'
      }
    },
    parts.loadJavaScript({ include: PATHS.app }),
    parts.setFreeVariable(CONFIG[type][app])
  ])
}

const productionConfig = (type, app) => {
  return merge([
    {
      performance: {
        hints: 'warning',
        maxEntrypointSize: 150000,
        maxAssetSize: 450000
      }
    },
    {
      recordsPath: path.join(__dirname, 'records.json'),
      output: {
        chunkFilename: '[name].[chunkhash:4].js',
        filename: '[name].[chunkhash:4].js'
      }
    },
    parts.clean(path.join(__dirname, 'build', `${app}-${type.toLowerCase()}`)),
    parts.minifyJavaScript(),
    parts.loadFonts({
      options: {
        name: '/fonts/[name].[hash:8].[ext]'
      }
    }),
    parts.extractCSS({
      include: PATHS.style,
      use: ['css-loader', parts.autoprefix()]
    }),
    parts.purifyCSS({
      paths: glob.sync(path.join(__dirname, PATHS.app, `${app}/**/*.js`), { nodir: true })
    }),
    parts.minifyCSS({
      options: {
        discardComments: {
          removeAll: true
        },
        safe: true
      }
    }),
    {
      optimization: {
        splitChunks: {
          chunks: 'initial'
        },
        runtimeChunk: {
          name: 'manifest'
        }
      }
    },
    parts.loadImages({
      options: {
        limit: 15000,
        name: '[name].[hash:4].[ext]'
      }
    }),
    parts.generateSourceMaps({ type: 'source-map' }),
    parts.attachRevision()
  ])
}
const developmentConfig = merge([
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT
  }),
  parts.HMR(),
  parts.loadCSS(),
  parts.loadImages(),
  parts.loadFonts({
    options: {
      name: '[name].[ext]',
      publicPath: './',
      outputPath: 'fonts/'
    }
  })
])

module.exports = (mode, config = {}) => {
  const { TYPE, APP } = config.env
  const pages = [
    parts.page({
      path: 'app',
      title: CONFIG[TYPE][APP]['title'],
      template: path.join(`${PATHS.app}/${APP}/`, 'index.ejs'),
      entry: {
        app: path.join(`${PATHS.app}/${APP}/`, 'index.js')
      },
      output: path.join(__dirname, 'build', `${APP}-${TYPE.toLowerCase()}`),
      chunks: ['app', 'manifest', 'vendors~app']
    })
  ]
  const mainConfig =
  mode === 'production' ? productionConfig : developmentConfig

  return merge([commonConfig(TYPE, APP), mainConfig, { mode }].concat(pages))
}
