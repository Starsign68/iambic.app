/* eslint-disable import/no-amd, no-unused-*, no-useless-escape */
/* global xhr, globalThis:writable,monaco */
/**
 * @typedef range
 * @type {object}
 * @property {number} startLineNumber - an ID.
 * @property {number} endLineNumber - your name.
 */

console.time("HW");
console.time("TEST");
try {
 if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
  console.log(navigator.serviceWorker);
 } else {
 }
} catch (e) {
 alert(e);
 console.error("Error", e);
 throw e;
}
console.timeEnd("TEST");

function logz(inp, ov) {
 if (ov || globalThis.dev === true) {
  console.log.call(globalThis, inp);
 }
}

class sgt {
 /** A Suggestion
  *
  * @param {range} range
  *
  * @param {string} label what the label should display
  * @param {string} kind the type of symbol to show
  * @param {string} [insert]
  * @param {string} [doc]
  * @param {string} [sort]
  * @param {boolean} [snippet]
  */
 constructor(range, label, kind = "", insert = "", doc = `Insert ${insert} into text.`, sort = label, snippet = null) {
  return {
   sortText: "__" + sort + "__",
   label: label,
   kind: kind,
   documentation: doc,
   insertTextRules: `${snippet ? 4 : 0}`,
   insertText: insert,
   range: range
  };
 }
}

class Demo {
 /** @type sgt[] */
 #res = [];
 #regex = /\d+/;
 /**
  * **A demo class**
  * @param {*} obj
  * @param {*} range
  */
 constructor(obj, range) {
  Object.entries(obj).forEach(([key, val]) => {
   if (!this.#regex.test(key)) {
    this.#res.push(new sgt(range, key, val, "", `Demo for type of ${key}.`));
   }
  });
  return this.#res;
 }
}

globalThis.done = [];
globalThis.issues = [];
/* eslint-disable-next-line */
globalThis.config = LanguageConfiguration = {
 comments: {
  lineComment: ":",
  blockComment: ["|::", "::|"]
 },
 brackets: [
  ["{", "}"],
  ["[", "]"],
  ["(", ")"]
 ],
 autoClosingPairs: [
  {open: "{", close: "}"},
  {open: "[", close: "]"},
  {open: "(", close: ")"},
  {open: "`", close: "`"},
  {open: '"', close: '"'},
  {open: "'", close: "'"}
 ],
 surroundingPairs: [
  {open: "{", close: "}"},
  {open: "[", close: "]"},
  {open: "(", close: ")"},
  {open: "`", close: "`"},
  {open: '"', close: '"'},
  {open: "'", close: "'"}
 ]
};

globalThis.tokenThings = {
 defaultToken: "invalid",

 tokenPostfix: ".HW",
 ignoreCase: true,
 t1: ["which", "once", "when", "how", "will", "about", "what", "should", "can", "to"],
 t2: ["only", "some", "just", "most"],
 t3: ["this", "it", "one", "you", "that", "I"],
 t4: ["get", "following", "then", "find", "describe", "explain", "show", "try"],
 enums: ["for", "of"],
 pos: ["true", "good", "best", "great", "awesome"],
 neg: ["not", "bad", "no", "worst", "none", "but", "false"],
 cnd: ["is", "if", "isn't"],
 ops: ["less", "greater", "equal", "let", "set", "or", "and", "add", "added", "subtract", "subtracted", "multiply", "multiplied", "times", "divide", "divided", "be"],
 brackets: [
  {open: "{", close: "}", token: "delimiter.curly"},
  {open: "[", close: "]", token: "delimiter.bracket"},
  {open: "(", close: ")", token: "delimiter.parenthesis"}
 ],

 // we include these common regular expressions
 symbols: /[=\>\<!~?:&+\-*\'\"\`\/\^%]+/,

 // The main tokenizer for our languages
 tokenizer: {
  root: [
   [/^(\s*)(A:(?:\s.*|))$/, ["", "enum"]],

   [/[\{\}\[\]\(\)]/, "@brackets"],

   [
    /[a-z_$][\w$]*/,
    {
     cases: {
      "@t1": "type",
      "@t2": "tag.decorator",
      "@t3": "keyword",
      "@t4": "constant.numeric",
      "@ops": "namespace",
      "@pos": "markup.inserted",
      "@neg": "markup.deleted",
      "@cnd": "entity.name.class",
      "@enums": "namespace",
      "@default": "blur"
     }
    }
   ],

   {include: "@whitespace"},

   // delimiters and operators
   [/[{}()]/, "@brackets"],
   [/[<>](?!@symbols)/, "@brackets"],
   [/@symbols/, "punctuation"],

   // numbers
   [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
   [/0[xX][0-9a-fA-F]+/, "number.hex"],
   [/\d+/, "number"],
   // delimiter: after number because of .\d floats
   [/[;,.]/, "delimiter"]
  ],
  comment: [
   [/[^\:\|]+/m, "comment"],
   //  [/\\:\*/,    'comment', '@push' ],    // nested comment
   ["::|", "comment", "@pop"],
   [/:/, "comment"]
  ],
  whitespace: [
   [/[\s\t\r\n]+/, "white"],
   [/\|\:/, "comment", "@comment"],
   [/\:?\:[ |].*$/, "comment"]
  ]
 }
};
/* eslint-disable no-template-curly-in-string */

function createSuggestionsProposals(range, types = [], monaco) {
 const x = {
  "demo": new Demo(monaco.languages.CompletionItemKind, range),
  "cites": [
   new sgt(
    range,
    "CHI",
    21,
    '${1:Author}. "${2:Source Title}." ${3:Container Title}, ${4:Contributors}, ${5:Version}, ${6:Number}, ${7:Publisher}, ${8:Publish Date}, ${9:Location}.',
    "Insert A CHIC citation",
    "__CITES__",
    true
   ),
   {
    sortText: "__CITES__",
    label: "MLA",
    kind: monaco.languages.CompletionItemKind.Reference,
    documentation: "Insert An MLA citation",
    insertText: '${1:Author}. "${2:Source Title}." ${3:Container Title}, ${4:Contributors}, ${5:Version}, ${6:Number}, ${7:Publisher}, ${8:Publish Date}, ${9:Location}.',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    range: range
   },
   {
    sortText: "__CITES__",
    label: "APA",
    kind: monaco.languages.CompletionItemKind.Reference,
    documentation: "Insert An APA citation",
    insertText: '${1:Author}. "${2:Source Title}." ${3:Container Title}, ${4:Contributors}, ${5:Version}, ${6:Number}, ${7:Publisher}, ${8:Publish Date}, ${9:Location}.',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    range: range
   }
  ]
 };
 let res = [];
 types.forEach(function (item) {
  let a = x[item] ?? [];
  res.unshift(a);
 });
 return res.flat(Infinity);
}

function createCodeActionProposals(model /**ITextModel*/, range /**Range*/, context /**CodeActionContext*/, token /**CancellationToken*/, monaco) {
 globalThis.rest = 1;
 /**
  * @type codeAct[]
  */
 let actions = [];
 globalThis.issues = context.markers;
 /* eslint-disable-next-line */
 context.markers.map(error => {
  actions.push({
   title: `Fix ${error.code} [${error.relatedInformation.message}]`,
   diagnostics: error,
   kind: "quickfix",
   edit: {
    edits: [
     {
      resource: model.uri,
      edit: {
       range: error,
       text: error.relatedInformation.message
      }
     }
    ]
   },
   isPreferred: true
  });
 });
 if (false) {
  actions.push({
   title: `Make Plural`,
   kind: "refactor",
   edit: {
    edits: [
     {
      resource: model.uri,
      edit: {
       range: range,
       text: globalThis.fmt.plur(model.getValueInRange(range))
      }
     }
    ]
   },
   isPreferred: false
  });
  actions.push({
   title: `Make singular`,
   kind: "refactor",
   edit: {
    edits: [
     {
      resource: model.uri,
      edit: {
       range: range,
       text: globalThis.fmt.sing(model.getValueInRange(range))
      }
     }
    ]
   },
   isPreferred: false
  });
 }
 let fixes = {
  actions: actions,
  dispose: a => {
   let s = a;
   logz(["Updated Issue: ", s]);
  }
 };
 return fixes;
}

/* eslint-enable no-template-curly-in-string */

/** @typedef codeAct
 * @type {{title: string, diagnostics: [marker], kind: string, edit: { edits: [ { resource: string, edit: { range: marker, text: string } } ] }, isPreferred: boolean } }
 *
 *
 */
globalThis.pr = {
 init: function () {
  return require(["vs/editor/editor.main"], function () {
   monaco.languages.setMonarchTokensProvider(globalThis.langDef, globalThis.tokenThings);
   globalThis.xpr = {
    init: function () {
     return {
      registerCodeAction: monaco.languages.registerCodeActionProvider(globalThis.langDef, {
       provideCodeActions: function (model /**ITextModel*/, range /**Range*/, context /**CodeActionContext*/, token /**CancellationToken*/) {
        return createCodeActionProposals(model, range, context, token, monaco);
       },
       resolveCodeAction: function (codeAct, token) {
        logz([codeAct]);
        let model = monaco.editor.getModel(codeAct.diagnostics.relatedInformation.resource);
        logz(["Issues:", globalThis.issues], true);
        monaco.editor.setModelMarkers(model, "EN-US ", globalThis.issues);
       }
      }),

      // Register a tokens provider for the language
      registerHover: monaco.languages.registerHoverProvider(globalThis.langDef, {
       provideHover: function (model, position) {
        let word = model.getWordAtPosition(position).word;
        if (globalThis.showHover === true && /^[a-z]*$/i.test(word)) {
         return xhr("https://api.dictionaryapi.dev/api/v2/entries/en/" + word).then(function (response) {
          let result = {
           contents: [
            {
             value: "```" + word.substring(0, 1).toUpperCase() + word.substring(1) + "```"
            }
           ]
          };
          let data = JSON.parse(response.responseText)[0].meanings;
          data.forEach(obj => {
           /* eslint-disable-next-line */
           result.contents.push({
            value: "**" + obj.partOfSpeech.substring(0, 1).toUpperCase() + obj.partOfSpeech.substring(1) + ":**"
           });
           obj.definitions.forEach(txt => result.contents.push({value: "_" + txt.definition + "_"}));
          });
          return result;
         });
        }
       }
      }),
      registerCompletionItem: monaco.languages.registerCompletionItemProvider(globalThis.langDef, {
       provideCompletionItems: function (model, position) {
        let word = model.getWordUntilPosition(position);
        let range = {
         startLineNumber: position.lineNumber,
         endLineNumber: position.lineNumber,
         startColumn: word.startColumn,
         endColumn: word.endColumn
        };

        if (globalThis.showSuggests) {
         return {suggestions: createSuggestionsProposals(range, ["cites", "demo"], monaco)};
        } else {
         return;
        }
       }
      })
     };
    }
   };
   globalThis.xpr.init();
   monaco.languages.setLanguageConfiguration(globalThis.langDef, globalThis.config);
  });
 }
};
console.timeEnd("HW");
