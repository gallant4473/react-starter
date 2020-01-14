module.exports = {
  coverageReporters: [
    'json',
    'lcov',
    'text-summary'
  ],
  moduleFileExtensions: [
    'js',
    'jsx',
    'scss'
  ],
  modulePaths: [
    './src'
  ],
  setupFiles: [
    '<rootDir>/testingConfig/jest/setup.js'
  ],
  transform: {
    '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/testingConfig/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|css|json)$)': '<rootDir>/testingConfig/jest/fileTransform.js'
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'
  ]
}