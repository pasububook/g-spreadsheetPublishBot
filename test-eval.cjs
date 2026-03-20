const fs = require('fs');
const js = fs.readFileSync('src/html/changesInput.html', 'utf8').match(/<script type=\"module\" crossorigin>(.*?)<\/script>/s)[1];

const fakeWin = {
  document: { getElementById:()=>({}), createElement:()=>({classList:{toggle:()=>null},appendChild:()=>null, style:{}, querySelector:()=>null, querySelectorAll:()=>[], addEventListener:()=>null}), querySelector:()=>null, querySelectorAll:()=>[], addEventListener:()=>null, readyState: 'complete' },
  MutationObserver: class { observe(){} },
  setTimeout: setTimeout,
  fetch: async () => { throw new Error('FETCH SHOULD NOT BE CALLED!'); }
};
fakeWin.window = fakeWin;
const f = new Function('window', 'document', 'MutationObserver', 'setTimeout', 'fetch', js);
try {
  f(fakeWin, fakeWin.document, fakeWin.MutationObserver, setTimeout, fakeWin.fetch);
  console.log('OK! Bundle runs synchronously without throwing!');
} catch (e) {
  console.log('ERROR:', e);
}
