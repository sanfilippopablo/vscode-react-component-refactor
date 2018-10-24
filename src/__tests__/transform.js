const { classToFunction, functionToClass } = require("../transform");

describe("transform", () => {
  test("classToFunction", () => {
    expect(
      classToFunction(
        `
        class MyComponent extends Component {
          render () {
            return <div>a</div>
          }
        }
        `.trim()
      )
    ).toMatchSnapshot();
  });

  test("functionToClass", () => {
    expect(
      functionToClass(
        `
        const MyComponent = ({a}) => <div>a</div>;
        `.trim()
      )
    ).toMatchSnapshot();
  });
});
