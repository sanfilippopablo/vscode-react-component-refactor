module.exports = babel => {
  const { types: t } = babel;

  return {
    name: "class-to-function", // not required
    visitor: {
      ClassDeclaration(path) {
        // Get the render method of the class component
        const renderMethod = path.node.body.body.find(member =>
          t.isIdentifier(member.key, { name: "render" })
        );

        // Get all props destructuring patterns
        const propsDestructuringPatterns = [];
        path.traverse({
          ObjectPattern(path) {
            const variableDeclarator = path.findParent(
              p =>
                p.isVariableDeclarator() &&
                t.isThisExpression(p.node.init.object) &&
                t.isIdentifier(p.node.init.property, { name: "props" })
            );
            if (variableDeclarator) {
              propsDestructuringPatterns.push(path.node);
              variableDeclarator.remove();
            }
          }
        });

        let referenceThisProps = false;
        path.traverse({
          MemberExpression(path) {
            if (
              t.isThisExpression(path.node.object) &&
              t.isIdentifier(path.node.property, { name: "props" })
            ) {
              referenceThisProps = true;
              path.replaceWith(t.identifier("props"));
            }
          }
        });

        let functionBody;
        if (renderMethod.body.body.length > 1) {
          // If there are many statements in the render method body,
          // then just copy it
          functionBody = renderMethod.body;
          if (referenceThisProps) {
          }
        } else {
          // It it's just one (the return), then use an implicit return
          functionBody = renderMethod.body.body[0].argument;
        }

        // Merge all props destructuring patterns into one
        let functionArguments = [];
        const objectPattern = t.objectPattern(
          propsDestructuringPatterns
            .map(pattern => pattern.properties)
            .reduce((prev, curr) => [...prev, ...curr], [])
        );

        if (referenceThisProps) {
          functionArguments = [t.identifier("props")];

          if (objectPattern.properties.length > 0) {
            functionBody.body = [
              t.variableDeclaration("const", [
                t.variableDeclarator(objectPattern, t.identifier("props"))
              ]),
              ...functionBody.body
            ];
          }
        } else if (objectPattern.properties.length > 0) {
          functionArguments.push(objectPattern);
        }

        // Replace class definition with a function whose body is
        // the modified version of the class render method body
        path.replaceWith(
          t.variableDeclaration("const", [
            t.variableDeclarator(
              t.identifier(path.node.id.name),
              t.arrowFunctionExpression(functionArguments, functionBody)
            )
          ])
        );
      }
    }
  };
};
