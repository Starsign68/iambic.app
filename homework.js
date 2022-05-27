/* eslint-disable import/no-amd, no-undef, no-unused, no-useless-escape */
// https://docs.webspellchecker.net/display/WebSpellCheckerCloud/Web+API ?? CHECK ??

let issues = [];
const langf = "HW";
monaco.languages.register({id: langf});

const config = (LanguageConfiguration = {
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
});

const tokenz = {
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
 symbols: /[=\>\<!~?:&+\-*\/\^%]+/,

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
      "@t2": "tag.decorator.js",
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
   [/[^\:\|]+/, "comment"],
   // [/\/\*/,    'comment', '@push' ],    // nested comment
   [":|", "comment", "@pop"],
   [/:/, "comment"]
  ],
  whitespace: [
   [/[ \t\r\n]+/, "white"],
   [/\|\:\:/, "comment", "@comment"],
   [/\:.*$/, "comment"]
  ]
 }
};
globalThis.provides = {
 registerCodeAction: monaco.languages.registerCodeActionProvider(langf, {
  provideCodeActions: (model /**ITextModel*/, range /**Range*/, context /**CodeActionContext*/, token /**CancellationToken*/) => {
   const actions = context.markers.map(error => {
    return (
     {
      title: `Fix ${error.message.match(/(?<=\()[a-z]+?(?=\))/)}`,
      diagnostics: [error],
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
     },
     model
    );
   });
   return {
    actions: actions,
    dispose: () => {}
   };
  }
 }),

 // Register a tokens provider for the language
 registerHover: monaco.languages.registerHoverProvider(langf, {
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
      result.contents.push({
       value: "**" + obj.partOfSpeech.substring(0, 1).toUpperCase() + obj.partOfSpeech.substring(1) + ":**"
      }),
       obj.definitions.forEach(txt => result.contents.push({value: "_" + txt.definition + "_"}));
     });
     return result;
    });
   }
  }
 }),

 registerCompletionItem: monaco.languages.registerCompletionItemProvider(langf, {
  provideCompletionItems: function (model, position) {
   let keywords = ["because", "this shows", "in one instance,"];
   const suggestions = [
    ...keywords.map(text => {
     return {
      label: text,
      kind: monaco.languages.CompletionItemKind.Text,
      insertText: text.toLowerCase()
     };
    })
   ];
   if (showSuggests) {
    return {suggestions: suggestions};
   } else {
    return {suggestions: {}};
   }
  }
 })
};

monaco.languages.setLanguageConfiguration(langf, config);
monaco.languages.setMonarchTokensProvider(langf, tokenz);
