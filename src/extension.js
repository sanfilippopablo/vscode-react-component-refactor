// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const { classToFunction, functionToClass } = require("./transform");
const detectType = require("./detect-type");

const getTransformer = type =>
  ({
    class: classToFunction,
    function: functionToClass
  }[type]);

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerTextEditorCommand(
    "extension.refactorReactComponent",
    function(textEditor, edit, range, type) {
      // The code you place here will be executed every time your command is executed
      const text = textEditor.document.getText(range);
      const transformer = getTransformer(type);
      const transformed = transformer(text);
      const transformEdit = edit.replace(range, transformed);

      // Display a message box to the user
      vscode.window.showInformationMessage(text);
    }
  );

  vscode.languages.registerCodeActionsProvider(
    ["javascript", "javascriptreact"],
    {
      provideCodeActions(document, range) {
        const type = detectType(document.getText(range));
        if (type) {
          return [
            {
              command: "extension.refactorReactComponent",
              title: `Refactor component to a ${
                type === "function" ? "class" : "function"
              }`,
              arguments: [range, type]
            }
          ];
        }
        return null;
      }
    },
    { providedCodeActionKinds: [vscode.CodeActionKind.RefactorRewrite] }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;

function initialize() {
  return {
    capabilities: {
      codeActionProvider: "true"
    }
  };
}
exports.initialize = initialize;
