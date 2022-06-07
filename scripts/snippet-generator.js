const path = require('path');
const { log, figlet } = require('./libs/util');
const clear = require('clear');
const { SnippetLoader } = require('./compiller/index');

(async () => {
  clear();

  const info = await figlet(' SNIPPET');
  log(info);

  let [, , filePath = 'default.vue', command] = process.argv; // npm run snippet [filePath]

  let fullPath = path.resolve(
    __dirname,
    `../src/${filePath}`.replaceAll('//', '/')
  );

  const parseUrl = path.parse(fullPath);
  const ext = parseUrl.ext.slice(1);

  const scopeMap = {
    js: 'javascript',
    vue: 'vue',
  };

  const app = new SnippetLoader({
    entry: fullPath,
    output: path.resolve(__dirname, '../snippets'),
    command: command || parseUrl.name,
    scope: scopeMap[ext],
  });

  app.run();
})();
