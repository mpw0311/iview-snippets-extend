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
    title: 'iview-snippets-extend SNIPPETS',
    description:
      '`iview-snippets-extend`是在`iview-snippets`的基础上进行扩展，包含了`iview-snippets`中内容。',
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
        title: 'iview-vue',
        language: 'vue',
        description: 'vue 页面模板代码片段',
        filter: (item) => /\/vue.code-snippets$/.test(item.path),
      },
      {
        title: 'iview-javascript',
        language: 'javascript',
        description: 'js 代码片段',
        filter: (item) => item.language === 'javascript',
      },
    ],
  });

  app.run();
})();
