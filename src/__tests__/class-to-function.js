const pluginTester = require("babel-plugin-tester");
const classToFunction = require("../class-to-function");

pluginTester({
  plugin: classToFunction,
  tests: [
    {
      code: `
        class MyComponent extends Component {
          render() {
            const { a, b, c } = this.props;
            const result = a + b + c;
            return <div>{result}</div>;
          }
        }      
      `,
      output: `
        const MyComponent = ({ a, b, c }) => {
          const result = a + b + c;
          return <div>{result}</div>;
        };
      `
    },
    {
      code: `
        class MyComponent extends Component {
          render() {
            const { a, b, c } = this.props;
            return <div>hello</div>;
          }
        }      
      `,
      output: `
        const MyComponent = ({ a, b, c }) => <div>hello</div>;
      `
    }
  ],
  babelOptions: { babelrc: true, filename: ".babelrc" }
});
