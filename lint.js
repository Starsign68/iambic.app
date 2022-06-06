/* eslint-disable */ //import/no-amd, , no-unused-vars, no-useless-escape */
/* global xhr, monaco, lint:writable, */
// type|tag\.decorator\.js|keyword|constant\.numeric| namespace|markup\.inserted|markup\.deleted|entity\.name\.class|namespace|blur|
const e = {
 provideCodeActions: function (document = vscode.TextDocument, range = vscode.Range, context = vscode.CodeActionContext, token = vscode.CancellationToken) {
  let diagnostic = context.diagnostics[0];
  let actions = [];

  if (diagnostic === undefined || this.useCLI) {
   return actions;
  }

  let key = `${diagnostic.message}-${diagnostic.range}`;
  let alert = this.alertMap[key];

  let server = "http://localhost:7777";

  let t = request
   .post({
    uri: server + "/suggest",
    qs: {alert: JSON.stringify(alert)},
    json: true
   })
   .catch(error => {
    return Promise.reject(`Vale Server could not connect: ${error}.`);
   })
   .then(body => {
    for (let idx in body["suggestions"]) {
     const suggestion = body["suggestions"][idx];
     const title = utils.toTitle(alert, suggestion);
     const action = new vscode.CodeAction(title, monaco.CodeActionKind.QuickFix);

     action.command = {
      title: title,
      command: ValeServerProvider.commandId,
      arguments: [document, diagnostic, alert.Match, suggestion, alert.Action.Name]
     };

     actions.push(action);
    }
   });

  return actions;
 },

 runCodeAction: function (document = vscode.TextDocument, diagnostic = vscode.Diagnostic, error = string, suggestion = string, action = string) {
  let docError = document.getText(diagnostic.range);

  if (error === docError) {
   // Remove diagnostic from list
   let diagnostics = this.diagnosticMap[document.uri.toString()];
   let index = diagnostics.indexOf(diagnostic);

   diagnostics.splice(index, 1);

   // Update with new diagnostics
   this.diagnosticMap[document.uri.toString()] = diagnostics;
   this.diagnosticCollection.set(document.uri, diagnostics);

   // Insert the new text
   let edit = new vscode.WorkspaceEdit();
   if (action !== "remove") {
    edit.replace(document.uri, diagnostic.range, suggestion);
   } else {
    // NOTE: we need to add a character when deleting to avoid leaving a
    // double space.
    const range = new vscode.Range(diagnostic.range.start.line, diagnostic.range.start.character, diagnostic.range.end.line, diagnostic.range.end.character + 1);
    edit.delete(document.uri, range);
   }

   return vscode.workspace.applyEdit(edit);
  } else {
   vscode.window.showErrorMessage("The suggestion was not applied because it is out of date.");
   console.log(error, docError);
  }
 }
};
