const t = require("@babel/types");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;

function detectType(code) {
  const ast = parse(code, { plugins: ["jsx"] });

  let numberOfClassComponents = 0;
  let numberOfFunctionComponents = 0;
  const visitor = {
    ClassDeclaration(path) {
      // Get the render method of the class component
      const renderMethod = path.node.body.body.find(member =>
        t.isIdentifier(member.key, { name: "render" })
      );
      if (renderMethod) {
        numberOfClassComponents++;
      }
    },
    "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression"(path) {
      if (path.node.body.type === "JSXElement") {
        numberOfFunctionComponents++;
      } else {
        path.traverse({
          ReturnStatement(path) {
            if (path.node.argument.type === "JSXElement") {
              numberOfFunctionComponents++;
            }
          }
        });
      }
    }
  };

  traverse(ast, visitor);

  if (numberOfClassComponents === 1 && numberOfFunctionComponents === 0) {
    return "class";
  } else if (
    numberOfClassComponents === 0 &&
    numberOfFunctionComponents === 1
  ) {
    return "function";
  } else {
    return null;
  }
}

module.exports = detectType;
