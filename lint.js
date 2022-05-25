/* eslint-disable import/no-amd, no-undef, no-unused, no-useless-escape */

function lint(edi) {
 let model = edi.getModel();
 issues = [];
 const API_KEY = "";
 return xhr(`https://svc.webspellchecker.net/api?cmd=check&lang=en_US&format=json&customerid=${API_KEY}&text=${model.getValue().replaceAll("\n", " ")}`).then(function (response) {
  let errors = JSON.parse(response.responseText);
  // console.log(response);
  // console.log(errors);
  let errs = errors.result[0].matches;

  errs.map(err => {
   let ereStart = model.getPositionAt(err.offset + 0);
   let ereEnd = model.getPositionAt(err.offset + 0 + err.length);
   issues.push({
    startLineNumber: ereStart.lineNumber,
    endLineNumber: ereEnd.lineNumber,
    startColumn: ereStart.column,
    endColumn: ereEnd.column,
    message: `${err.message} (${err.type.toLowerCase()}) 
 Fix: [${err.suggestions[0]}]`,
    severity: 2,
    source: "EN-US",
    relatedInformation: {message: err.suggestions[0] + ""}
   });
  });
  monaco.editor.setModelMarkers(model, "EN-US", issues);
  // console.log(issues);
 });
}
