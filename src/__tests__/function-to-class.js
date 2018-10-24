const pluginTester = require("babel-plugin-tester");
const functionToClass = require("../function-to-class");

pluginTester({
  plugin: functionToClass,
  tests: [
    {
      code: `
        const MyComponent = ({ a, b, c }) => {
          const result = a + b + c;
          return <div>{result}</div>;
        };
      `,
      snapshot: true
    },
    {
      code: `
        const MyComponent = ({ a, b, c }) => <div>hello</div>;
      `,
      snapshot: true
    },
    {
      code: `
        const MyComponent = () => <div>hello</div>;
      `,
      // snapshot: true
      output: `
        class 
      `
    }
  ],
  babelOptions: { babelrc: true, filename: ".babelrc" }
});
