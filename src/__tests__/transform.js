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
        const MyComponent = (theProps) => {
          const { a, b } = theProps;
          <div>{theProps.c}</div>
        };
        `.trim()
      )
    ).toMatchSnapshot();
  });
});
