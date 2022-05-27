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

const xhr = url => {
 var req = null;
 return new Promise(
  function (c, e) {
   req = new XMLHttpRequest();
   req.onreadystatechange = function () {
    if (req._canceled) {
     return;
    }
    if (req.readyState === 4) {
     if ((req.status >= 200 && req.status < 300) || req.status === 1223) {
      c(req);
     } else {
      e(req);
     }
     req.onreadystatechange = function () {};
    }
   };
   req.open("GET", url, true);
   req.responseType = "string";
   req.send(null);
  },
  function () {
   req._canceled = true;
   req.abort();
  }
 );
};
