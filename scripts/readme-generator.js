const path = require('path');
const util = require('util');
const { log } = require('./libs/util');

const { MarkdownLoader } = require('./compiller/index');

const promisify = util.promisify;
// 控制台打印
const figlet = promisify(require('figlet'));
// 清空命令行
const clear = require('clear');

const ivewReg = /iview.code-snippets$/;

(async () => {
  clear();

  const content = await figlet('IVIEW SNIPPET');

  log(content);

  const app = new MarkdownLoader({
    title: 'iview-snippet-extend SNIPPETS',
    description: '',
    entry: path.resolve(__dirname, '../package.json'),
    output: path.resolve(__dirname, '../README.md'),
    models: [
      {
        title: 'iview',
        language: 'vue-html',
        description: 'iview 组件库 snippets',
        filter: (item) => ivewReg.test(item.path),
      },
      {
        title: 'javascript',
        language: 'javascript',
        description: 'js 代码片段',
        filter: (item) => item.language === 'javascript',
      },
    ],
  });

  app.run();
})();
