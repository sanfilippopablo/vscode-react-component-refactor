const pluginTester = require("babel-plugin-tester");
const myPlugin = require("./plugin");
const assert = require('assert')

pluginTester({
  plugin: myPlugin,
  filename: __filename,
  tests: [
    {
      fixture: "__fixtures__/1/from.js",
      outputFixture: "__fixtures__/1/to.js"
    }
  ],
  babelOptions: { babelrc: true }
});
