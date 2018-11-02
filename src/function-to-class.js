const generate = require("@babel/generator").default;
module.exports = babel => {
  const { types: t, template, traverse } = babel;

  return {
    name: "function-to-class",
    visitor: {
      "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression"(path) {
        let statements, propsParamName;

        // Get render body
        if (path.node.body.type === "JSXElement") {
          let returnArgument = path.node.body;
          statements = [t.returnStatement(returnArgument)];
        } else {
          statements = path.node.body.body;
        }

        let renderBody = statements;

        // Get props destructuring (if any)
        const propsParam = path.node.params[0];
        if (propsParam) {
          if (propsParam.type === "ObjectPattern") {
            const propsDestructuring = template(`
            const OBJECT_PATTERN = this.props;
            `)({ OBJECT_PATTERN: propsParam });

            renderBody = [propsDestructuring, ...renderBody];
          } else if (propsParam.type === "Identifier") {
            propsParamName = propsParam.name;
          }
        }

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

        // console.log(classDeclaration);

        // console.log(generate(classDeclaration).code);

        const functionComponentDeclaration = path.findParent(
          t.isVariableDeclaration
        );
        functionComponentDeclaration.replaceWith(classDeclaration);

        let propsIdentifierPaths = [];
        functionComponentDeclaration.traverse({
          Identifier(path) {
            if (t.isIdentifier(path.node, { name: propsParamName })) {
              propsIdentifierPaths.push(path);
            }
          }
        });

        propsIdentifierPaths.forEach(path => {
          path.replaceWith(
            t.memberExpression(t.thisExpression(), t.identifier("props"))
          );
        });
      }
    }
  };
};
