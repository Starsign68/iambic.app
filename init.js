/* eslint-disable import/no-amd, no-undef, no-unused-expressions, no-useless-escape */

require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/"
  }
});
globalThis.MonacoEnvironment = {
  getWorkerUrl: function (workerId, label) {
    return `data:text/javascript;charset=utf-8 , ${encodeURIComponent(`
self.MonacoEnvironment = { baseUrl: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/" };
importScripts("https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/base/worker/workerMain.min.js");`)}`;
  }
};

globalThis.monaco = require(["vs/editor/editor.main"], () => monaco);
monaco.languages.register({id: "HOMEWORK"});
