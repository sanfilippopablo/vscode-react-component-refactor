// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const { classToFunction } = require("./transform");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "react-component-refactor" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerTextEditorCommand(
    "extension.refactorReactComponent",
    function(textEditor, edit, range) {
      // The code you place here will be executed every time your command is executed
      console.log({ textEditor, edit, range });
      const text = textEditor.document.getText(range);

      // TODO: REFACTOR
      const transformed = classToFunction(text);
      const transformEdit = edit.replace(range, transformed);

      // Display a message box to the user
      vscode.window.showInformationMessage(text);
    }
  );

  console.log("Regustering code action provider");
  vscode.languages.registerCodeActionsProvider(
    "javascript",
    {
      provideCodeActions(document, range) {
        return [
          {
            command: "extension.refactorReactComponent",
            title: "Refactor react component",
            arguments: [range]
          }
        ];
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
