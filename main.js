/* eslint-disable import/no-amd, no-undef, no-unused-expressions, no-useless-escape */
const globalThis = window.globalThis;

globalThis.showHover = false;
showSuggests = false;
globalThis.txtValue = "";

{
 let Lang = "HOMEWORK";
 let Theme = "Oceanic-Next";

 // Define new themes that contain rules that match this language
 for (const [key, value] of Object.entries(themes)) {
  monaco.editor.defineTheme(key, value);
 }

 const model = monaco.editor.createModel(
  `: This is a good start ... But is it really the best?
This is a good test case. I will repeat all of the best examples to show that this is good, and not bad.
You are starting to get it! Now, just try to find some of the errors in the data and then fix the not good math.
Then, once you are done, add, then subtract most of the test results.
Can you then please start over and describe what you just fixed? `,
  Lang,
  monaco.Uri.parse("inmemory://1")
 );

 // model.onDidChangeContent(() => {
 //   document.getElementById("saved").innerText = "Changed";
 // });
 const editorElement = document.getElementById("editor");
 const editor = monaco.editor.create(editorElement, {
  model,
  loading: "Loading",
  language: Lang,
  theme: Theme,
  autoIndent: true,
  cursorBlinking: "phase",
  cursorSmoothCaretAnimation: true,
  cursorStyle: "line-thin",
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

 editor.addAction({
  // An unique identifier of the contributed action.
  id: "re-init",
  // A label of the action that will be presented to the user.
  label: "Reload the Editor.",
  // An optional array of keybindings for the action.
  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR],
  // An optional precondition for this action.
  precondition: null,
  // An optional rule to evaluate on top of the precondition in order to dispatch the keybindings.
  keybindingContext: null,
  contextMenuOrder: 0,
  /** Method that will be executed when the action is triggered.
   *  - `editor` -- The editor instance is passed in as a convenience
   */
  run: function (edi) {
   globalThis.edi = edi;
  }
 });
 editor.addAction({
  id: "short-help",
  label: "Show Menu",
  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.Space, monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP],
  contextMenuOrder: 0,
  run: function (edi) {
   edi._actions["editor.action.quickCommand"]._run();
  }
 });
 editor.addAction({
  id: "show-hover",
  label: "Toggle hover definitions",
  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyH],
  contextMenuOrder: -0.2,

  contextMenuGroupId: "1_navigation",

  run: function (edi) {
   globalThis.showHover = !globalThis.showHover;
  }
 });
 editor.addAction({
  id: "show-suggests",
  label: "Toggle suggestions",
  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
  contextMenuOrder: -0.2,

  contextMenuGroupId: "1_navigation",

  run: function (edi) {
   showSuggests = !showSuggests;
  }
 });

 editor.addAction({
  id: "save-edits",

  label: "Save To Cached File.",

  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],

  contextMenuOrder: 0,

  run: function (edi) {
   globalThis.txtValue = edi.getValue();
   saveFile();
   document.getElementById("saved").innerText = "Saved";
  }
 });

 editor.addAction({
  id: "save-edits-as",

  label: "Save To New File.",

  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyS],

  contextMenuOrder: 0,

  run: function (edi) {
   globalThis.txtValue = edi.getValue();
   saveFile();
  }
 });
 editor.addAction({
  id: "engl-lint",

  label: "Check Spelling and style",

  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyI],

  contextMenuOrder: -0.2,

  contextMenuGroupId: "2_lint",

  run: edit => lint(edit)
 });
 editor.addAction({
  id: "open-edits-from",

  label: "Open a file.",

  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyO],

  contextMenuOrder: 0,

  run: function (edi) {
   openFile().then(() => edi.setValue(globalThis.txtValue));
  }
 });
}
