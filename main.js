/* eslint-disable import/no-amd, no-unused-expressions, no-useless-escape */
/* globals xhr fH:writable, fHandle:writable, monaco, themes */
console.time("MAIN");
const globalThis = window.globalThis;
globalThis.issues = [];

globalThis.dev = false;
function logz(inp) {
 if (globalThis.dev === true) {
  console.log(inp);
 }
}

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
globalThis.langDef = "HW";
require(["vs/editor/editor.main"], function () {
 monaco.languages.register({id: globalThis.langDef});
 let Theme = "Oceanic-Next-Simple";

 //  let Theme = "Pencil-simp";
 globalThis.theme = Theme;
 let txt = `This is a good start ... But is it really the best?
One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections. The bedding was hardly able to cover it and seemed ready to slide off any moment. His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked. "What's happened to me?" he thought. It wasn't a dream. His room, a proper human room although a little too small, lay peacefully between its four familiar walls. A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame. It showed a lady fitted out with a fur hat and fur boa who sat upright, raising a heavy fur muff that covered the whole of her lower arm towards the viewer. Gregor then turned to look out the window at the dull weather...`;
 let txt2 = `this is not jjust a great app ... It is an awesome app!!!`;
 // Define new themes that contain rules that match this language
 console.time("THEME");
 for (const [key, value] of Object.entries(themes)) {
  monaco.editor.defineTheme(key, value);
 }
 console.timeEnd("THEME");
 const editorElement = document.getElementById("editor");
 let editor = monaco.editor.create(editorElement, {
  language: "HW",
  loading: "Loading . . . ",
  cursorBlinking: "phase",
  scrollbar: {
   horizontal: "hidden",
   vertical: "hidden"
  },
  cursorSmoothCaretAnimation: true,
  cursorStyle: "line-thin",
  theme: Theme,
  fontSize: 15,
  lineHeight: 1.5,
  minimap: {enabled: false, renderCharacters: false},
  multiCursorModifier: "ctrlCmd",
  overviewRulerBorder: false,
  overviewRulerLanes: 0,
  smoothScrolling: true,
  cursorSurroundingLines: 12,
  suggest: {preview: false, previewMode: "subword-smart"}
 });
 // Resize the editor when the window size changes
 const model = monaco.editor.createModel(txt, globalThis.langDef, monaco.Uri.parse("inmemory://1"));
 editor.setModel(model);
 window.addEventListener("resize", () =>
  editor.layout({
   width: editorElement.offsetWidth,
   height: editorElement.offsetHeight
  })
 );
 let actionsW = {
  short_help: editor.addAction({
   id: "short-help",
   label: "Show menu",
   keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.Space, monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP],
   contextMenuOrder: 0,
   run: function (edi) {
    edi._actions["editor.action.quickCommand"]._run();
   }
  }),
  re_init: editor.addAction({
   id: "re-Init",
   label: "Reload",
   keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.Space],
   contextMenuOrder: 0,
   run: function (edi) {
    globalThis.pr.init();

    monaco.editor.setModelLanguage(model, "HW");
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
   id: "inspect-tokens",
   label: "Inspect Tokens",
   keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyM],
   contextMenuOrder: -0.2,
   contextMenuGroupId: "1_navigation",
   run: function (edi) {
    edi._actions["editor.action.inspectTokens"]._run();
   }
  }),
  setTheme: editor.addAction({
   id: "theme-toggle",
   label: "Toggle Theme",
   keybindings: [monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyE)],
   contextMenuOrder: -0.2,
   contextMenuGroupId: "1_navigation",
   run: function (edi) {
    let themeMap = {"Pencil": "Oceanic-Next", "Oceanic-Next": "Pencil", "Pencil-Simple": "Oceanic-Next-Simple", "Oceanic-Next-Simple": "Pencil-Simple"};
    let t = globalThis.theme;
    globalThis.theme = themeMap[t];
    monaco.editor.setTheme(globalThis.theme);
   }
  }),
  setSimple: editor.addAction({
   id: "simple-theme-toggle",
   label: "Toggle Simple Theme",
   keybindings: [monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS)],
   contextMenuOrder: -0.2,
   contextMenuGroupId: "1_navigation",
   run: function (edi) {
    let themeMap = {"Pencil": "Pencil-Simple", "Oceanic-Next": "Oceanic-Next-Simple", "Pencil-Simple": "Pencil", "Oceanic-Next-Simple": "Oceanic-Next"};
    let t = globalThis.theme;
    globalThis.theme = themeMap[t];
    monaco.editor.setTheme(globalThis.theme);
   }
  }),
  save_edits: editor.addAction({
   id: "save-edits",
   label: "Save to cached file",
   keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
   contextMenuOrder: 0,
   run: function (edi) {
    globalThis.txtValue = edi.getValue();
    // saveFile();
    // document.getElementById("saved").innerText = "Saved";
   }
  }),

  save_edits_as: editor.addAction({
   id: "save-edits-as",
   label: "Save to new file",
   keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyS],
   contextMenuOrder: 0,
   run: function (edi) {
    globalThis.txtValue = edi.getValue();
    // saveFile();
   }
  }),
  save_T: editor.addAction({
   id: "remove-marks-now",
   label: "Clear the Spelling errors",
   keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI],
   contextMenuOrder: 0.2,
   contextMenuGroupId: "2_lint",
   run: function (edi) {
    globalThis.issues = [];
    let model = edi.getModel();
    logz("Issues:", globalThis.issues);
    monaco.editor.setModelMarkers(model, "EN-US ", globalThis.issues);
   }
  }),
  engl_lint: editor.addAction({
   id: "engl-lint",
   label: "Check spelling and style",
   keybindings: [[monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyI], [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyO]],
   contextMenuOrder: -0.2,
   contextMenuGroupId: "2_lint",
   run: async function (edi) {
    let model = edi.getModel();
    /* Speed run getting API key revoked: */
    let API_KEY = "1iKQaZAKfHX9MQz"; /* Free trial API key, just for POC ... don't take ... Can't be bothered to fix ... */
    console.time("LINT");
    const response = await xhr(`https://svc.webspellchecker.net/api?cmd=check&lang=en_US&format=json&customerid=${API_KEY}&text=${model.getValue().replaceAll(/[\n\:]/g, " ")}`);
    console.timeEnd("LINT");
    let errors = JSON.parse(response.responseText);
    let errs = errors.result[0].matches;
    let mark = [];
    errs.forEach(function (err) {
     let ereStart = model.getPositionAt(err.offset + 0);
     let ereEnd = model.getPositionAt(err.offset + 0 + err.length);
     err.suggestions.forEach(function (i) {
      mark.push({
       startLineNumber: ereStart.lineNumber,
       endLineNumber: ereEnd.lineNumber,
       startColumn: ereStart.column,
       endColumn: ereEnd.column,
       code: `${err.type}`,
       message: `${err.message} (${err.type}) 
 Fix: [${i}]`,
       severity: err.type === "spelling" ? 0 : 2,
       source: "EN-US ",
       relatedInformation: {message: i, resource: model.uri}
      });
     });
    });
    const intersection = (a, b) => a.filter(x => b.includes(x));
    let c = intersection(globalThis.issues, mark);
    globalThis.issues = mark;
    monaco.editor.setModelMarkers(model, "EN-US ", globalThis.issues);
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
 monaco.languages.setMonarchTokensProvider(globalThis.langDef, globalThis.tokenThings);
 monaco.languages.setLanguageConfiguration(globalThis.langDef, globalThis.config);
 globalThis.pr.init();
});

console.timeEnd("MAIN");
