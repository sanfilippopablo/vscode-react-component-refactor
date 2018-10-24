const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const types = require("@babel/types");
const generate = require("@babel/generator").default;
const template = require("@babel/template").default;
const classToFunctionPlugin = require("./class-to-function");
const functionToClassPlugin = require("./function-to-class");

function classToFunction(code) {
  const ast = parse(code, { plugins: ["jsx"] });
  const { visitor } = classToFunctionPlugin({ types, template });
  traverse(ast, visitor);
  return generate(ast).code;
}
function functionToClass(code) {
  const ast = parse(code, { plugins: ["jsx"] });
  const { visitor } = functionToClassPlugin({ types, template });
  traverse(ast, visitor);
  return generate(ast).code;
}

module.exports = {
  classToFunction,
  functionToClass
};
