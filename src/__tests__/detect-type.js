const detectType = require("../detect-type");

describe("detectType", () => {
  test("with one class component", () => {
    expect(
      detectType(`
      class MyComponent extends Component {
        render () {
          return <div>a</div>
        }
      }
    `)
    ).toBe("class");
  });
  test("with one class without render method", () => {
    expect(
      detectType(`
      class MyComponent extends Component {
        notRender () {
          return <div>a</div>
        }
      }
    `)
    ).toBe(null);
  });
  test("with two class components", () => {
    expect(
      detectType(`
      class MyComponent extends Component {
        render () {
          return <div>a</div>
        }
      }
      class MyOtherComponent extends Component {
        render () {
          return <div>a</div>
        }
      }
    `)
    ).toBe(null);
  });

  test("with no components", () => {
    expect(
      detectType(`
      const hey = "a";
    `)
    ).toBe(null);
  });

  test("with one function component", () => {
    expect(
      detectType(`
      const MyComponent = ({ a, b, c }) => <div>a</div>;
    `)
    ).toBe("function");
  });

  test("with two function components", () => {
    expect(
      detectType(`
      const MyComponent = ({ a, b, c }) => <div>a</div>;
      const MyComponent2 = ({ a, b, c }) => <div>a</div>;
    `)
    ).toBe(null);
  });
});
