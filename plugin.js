module.exports = function(babel) {
  const { types: t } = babel;

  console.log(babel);

  return {
    name: "ast-transform", // not required
    visitor: {
      ClassDeclaration(path) {
        const renderMethod = path.node.body.body.find(member =>
          t.isIdentifier(member.key, { name: "render" })
        );

        let objectPattern;

        path.traverse({
          ObjectPattern(path) {
            console.log(path);
            const variableDeclarator = path.findParent(
              p =>
                p.isVariableDeclarator() &&
                t.isThisExpression(p.node.init.object) &&
                t.isIdentifier(p.node.init.property, { name: "props" })
            );
            if (variableDeclarator) {
              objectPattern = path.node;
            }
          }
        });

        console.log({ objectPattern });

        path.replaceWith(
          t.variableDeclaration("const", [
            t.variableDeclarator(
              t.identifier(path.node.id.name),
              t.arrowFunctionExpression(
                objectPattern ? [objectPattern] : [],
                renderMethod.body
              )
            )
          ])
        );

        console.log(renderMethod.body);

        renderMethod.body.body.forEach(statement => {
          console.log(statement);
          const variableDeclarator = path.findParent(
            p =>
              p.isVariableDeclarator() &&
              t.isThisExpression(p.node.init.object) &&
              t.isIdentifier(p.node.init.property, { name: "props" })
          );
          if (statement) {
          }
        });
      }
    }
  };
}
