module.exports = function(babel) {
  const { types: t } = babel;

  return {
    name: "ast-transform", // not required
    visitor: {
      ClassDeclaration(path) {
        // Get the render method of the class component
        const renderMethod = path.node.body.body.find(member =>
          t.isIdentifier(member.key, { name: "render" })
        );

        let objectPattern;

        path.traverse({
          ObjectPattern(path) {
            // Get the `const { my, vars } = this.props` declaration
            const variableDeclarator = path.findParent(
              p =>
                p.isVariableDeclarator() &&
                t.isThisExpression(p.node.init.object) &&
                t.isIdentifier(p.node.init.property, { name: "props" })
            );
            if (variableDeclarator) {
              // Save the properties being spread to `objectPattern`
              objectPattern = path.node;

              // Remove the `const { my, vars } = this.props` declaration
              // from the function body
              variableDeclarator.remove();
            }
          }
        });

        let functionBody;
        if (renderMethod.body.body.length > 1) {
          // If there are many statements in the render method body,
          // then just copy it
          functionBody = renderMethod.body;
        } else {
          // It it's just one (the return), then use an implicit return
          functionBody = renderMethod.body.body[0].argument;
        }

        // Replace class definition with a function whose body is
        // the modified version of the class render method body
        path.replaceWith(
          t.variableDeclaration("const", [
            t.variableDeclarator(
              t.identifier(path.node.id.name),
              t.arrowFunctionExpression(
                objectPattern ? [objectPattern] : [],
                functionBody
              )
            )
          ])
        );
      }
    }
  };
};
