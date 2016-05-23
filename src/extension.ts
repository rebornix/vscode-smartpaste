'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
var ncp = require("copy-paste");
var X2JS = require("x2js");
var x2js = new X2JS();

function updateContent(editor: vscode.TextEditorEdit, selection: vscode.Selection, content: string) {
    if (selection.end === selection.start) {
        editor.insert(selection.active, content);
    }
    else {
        editor.replace(selection, content);
    }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "smart-paste" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('smart.paste', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        return vscode.window.showQuickPick([
            <vscode.QuickPickItem>{
                label: "JSON2XML",
                description: "JSON TO XML",
                detail: "JSON TO XML"
            },
            <vscode.QuickPickItem>{
                label: "XML2JSON",
                description: "XML to JSON",
                detail: "XML to JSON"
            }
        ]).then((choice) => {
            if (choice && choice.label) {
                var activeEditor = vscode.window.activeTextEditor;
				if (activeEditor && activeEditor.selection && activeEditor.selection.active) {
					activeEditor.edit((editor) => {
                        let content = '';
                        if (choice.label === 'JSON2XML') {
                            try{
                                let jsonContent = JSON.parse(ncp.paste());
                                content = x2js.js2xml(jsonContent);
                            } catch(e){
                                vscode.window.showErrorMessage("Invalid JSON content");
                                content = ncp.paste();
                            }
                        }
                        else {
                            try{
                                let jsonContent = x2js.xml2js(ncp.paste());
                                content = JSON.stringify(jsonContent);
                            } catch(e){
                                vscode.window.showErrorMessage("Invalid XML content");
                                content = ncp.paste();
                            }
                        }
                        
                        updateContent(editor, activeEditor.selection, content);
					});
				}
               
            }
        });
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}