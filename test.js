const pluginTester = require('babel-plugin-tester')
const myPlugin = require('./plugin')

pluginTester({
  plugin: myPlugin,
  filename: __filename,
  tests: [{
    fixture: '__fixtures__/source.js',
    outputFixture: '__fixtures__/dest.js'
  }]
})