const { classToFunction } = require("../transform");

test("transform", () => {
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
  ).toBe(
    `
        const MyComponent = () => <div>a</div>;
        `.trim()
  );
});
