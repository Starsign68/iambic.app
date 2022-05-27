/* eslint-disable import/no-amd, no-unused-expressions, no-useless-escape */
/* globals fH:writable, fHandle:writable, monaco, themes, showSuggests:writable, lint */
const globalThis = window.globalThis;

async function openFile() {
 [fH] = await window.showOpenFilePicker();
 const file = await fH.getFile();
 const contents = await file.text();
 globalThis.txtValue = contents;
 const type = await file.type;
 globalThis.curTyp = type;
}
async function saveFile() {
 if (!globalThis?.fH) {
  let fHandle = await window.showSaveFilePicker();
  globalThis.fH = fHandle;
 } else {
  fHandle = fH;
 }
 const writableStream = await fHandle.createWritable();
 await writableStream.write(globalThis.txtValue);
 await writableStream.close();
}

globalThis.showHover = false;
globalThis.showSuggests = false;
globalThis.txtValue = "";

let Lang = "HW";
let Theme = "Oceanic-Next";
let txt = `This is a good start ... But is it really the best?
This is a good test case. I will repeat all of the best examples to show that this is good, and not bad.
You are starting to get it! Now, just try to find some of the errors in the data and then fix the not good math.
Then, once you are done, add, then subtract most of the test results.
Can you then please start over and describe what you just fixed? `;
// Define new themes that contain rules that match this language
for (const [key, value] of Object.entries(themes)) {
 monaco.editor.defineTheme(key, value);
}
const editorElement = document.getElementById("editor");
const editor = monaco.editor.create(editorElement, {
 model: monaco.editor.createModel("", Lang, monaco.Uri.parse("inmemory://1")),
 language: Lang,
 loading: "Loading . . . ",
 autoIndent: true,
 cursorBlinking: "phase",
 cursorSmoothCaretAnimation: true,
 cursorStyle: "line-thin",
 theme: Theme,
 fontSize: 15,
 lineHeight: 1.5,
 minimap: {enabled: false, renderCharacters: false},
 multiCursorModifier: "ctrlCmd",
 overviewRulerBorder: false,
 overviewRulerLanes: 0,
 smoothScrolling: false,
 cursorSurroundingLines: 2
});
// Resize the editor when the window size changes
window.addEventListener("resize", () =>
 editor.layout({
  width: editorElement.offsetWidth,
  height: editorElement.offsetHeight
 })
);
globalThis.actions = {
 short_help: editor.addAction({
  id: "short-help",
  label: "Show menu",
  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.Space, monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP],
  contextMenuOrder: 0,
  run: function (edi) {
   edi._actions["editor.action.quickCommand"]._run();
  }
 }),
 show_hover: editor.addAction({
  id: "show-hover",
  label: "Toggle hover definitions",
  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyH],
  contextMenuOrder: -0.2,
  contextMenuGroupId: "1_navigation",
  run: function (edi) {
   globalThis.showHover = !globalThis.showHover;
  }
 }),
 show_suggests: editor.addAction({
  id: "show-suggests",
  label: "Toggle suggestions",
  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
  contextMenuOrder: -0.2,
  contextMenuGroupId: "1_navigation",
  run: function (edi) {
   globalThis.showSuggests = !globalThis.showSuggests;
  }
 }),
 re_suggests: editor.addAction({
  id: "re-suggests",
  label: "Toggle Tags",
  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
  contextMenuOrder: -0.2,
  contextMenuGroupId: "1_navigation",
  run: function (edi) {
   globalThis.showSuggests = !globalThis.showSuggests;
  }
 }),
 save_edits: editor.addAction({
  id: "save-edits",
  label: "Save to cached file",
  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
  contextMenuOrder: 0,
  run: function (edi) {
   globalThis.txtValue = edi.getValue();
   saveFile();
   document.getElementById("saved").innerText = "Saved";
  }
 }),
 save_edits_as: editor.addAction({
  id: "save-edits-as",
  label: "Save to new file",
  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyS],
  contextMenuOrder: 0,
  run: function (edi) {
   globalThis.txtValue = edi.getValue();
   saveFile();
  }
 }),
 engl_lint: editor.addAction({
  id: "engl-lint",
  label: "Check spelling and style",
  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyI],
  contextMenuOrder: -0.2,
  contextMenuGroupId: "2_lint",
  run: function (edi) {
   let model = edi.getModel();
   const API_KEY = "";
   return xhr(`https://svc.webspellchecker.net/api?cmd=check&lang=en_US&format=json&customerid=${API_KEY}&text=${model.getValue().replaceAll("\n", " ")}`).then(function (
    response
   ) {
    let errors = JSON.parse(response.responseText);
    let issues = [];
    let errs = errors.result[0].matches;
    errs.forEach(function (err) {
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
    edi.setModelMarkers(model, "EN-US", issues);
   });
  }
 }),
 open_edits_from: editor.addAction({
  id: "open-edits-from",
  label: "Open a file",
  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyO],
  contextMenuOrder: 0,
  run: function (edi) {
   openFile().then(() => edi.setValue(globalThis.txtValue));
  }
 })
};
