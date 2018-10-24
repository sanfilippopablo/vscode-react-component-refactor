module.exports = babel => {
  const { types: t, template } = babel;

  return {
    name: "function-to-class",
    visitor: {
      "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression"(path) {
        let statements;

        // Get render body
        if (path.node.body.type === "JSXElement") {
          let returnArgument = path.node.body;
          statements = [t.returnStatement(returnArgument)];
        } else {
          statements = path.node.body.body;
        }

        let renderBody = statements;

        // Get props destructuring (if any)
        const propsObjectPattern = path.node.params[0];
        const propsDestructuring = template(`
          const OBJECT_PATTERN = this.props;
        `)({ OBJECT_PATTERN: propsObjectPattern });

        renderBody = [propsDestructuring, ...renderBody];

        const buildClass = template(`
          class CLASS_NAME extends React.Component {
            render () {
              RENDER_BODY
            }
          }
        `);
        const classDeclaration = buildClass({
          CLASS_NAME: path.parent.id,
          RENDER_BODY: renderBody
        });
        const functionComponentDeclaration = path.findParent(
          t.isVariableDeclaration
        );
        functionComponentDeclaration.replaceWith(classDeclaration);
      }
    }
  };
};
