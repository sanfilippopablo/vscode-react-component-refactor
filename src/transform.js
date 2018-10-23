const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const types = require("@babel/types");
const generate = require("@babel/generator").default;
const classToFunctionPlugin = require("./class-to-function");

function classToFunction(code) {
  const ast = parse(code, { plugins: ["jsx"] });
  const { visitor } = classToFunctionPlugin({ types });
  traverse(ast, visitor);
  return generate(ast).code;
}

module.exports = {
  classToFunction
};
