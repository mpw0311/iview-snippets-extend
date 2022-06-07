const path = require('path');
const readline = require('readline');
const fs = require('fs');
const promisify = require('util').promisify;
const { log, figlet } = require('./libs/util');
const ora = require('ora');
const clear = require('clear');

const spinner = ora('snippet generator start……');

const LINE_MAX = 5;

const getPath = (relativePath) => path.join(__dirname, relativePath);

/**
 * 获取代码片段并转换为snippet body内容
 * @param {*} fullPath
 * @returns
 */
async function readSnipetContent(fullPath) {
  const fileStream = fs.createReadStream(fullPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // 注意：使用 crlfDelay 选项
  // 将 input.txt 中的所有 CR LF ('\r\n') 实例识别为单个换行符。
  let content = [];
  for await (let line of rl) {
    let space = line.match(/^(\s{2})+/g);
    // console.log("line before", line)
    line = line.replaceAll('$', '$$');
    // line = line.replaceAll("$$TM_FILENAME_BASE", "$TM_FILENAME_BASE")
    // console.log("line after", line)

    if (space) {
      space = space[0];
      const tab = space.replaceAll('  ', '\t');
      content.push(line.replaceAll(space, tab));
    } else {
      content.push(line);
    }
  }
  // 少于10行，用 /n 一行展示
  if (content.length <= LINE_MAX) {
    content = [content.join('\n')];
  }
  return content;
}

class SnippetItem {
  constructor({ scope, command, content }) {
    if (scope) {
      this.scope = scope;
    }
    this.prefix = [command];
    this.body = content;
    this.description = `${command} 代码片段模板`;
  }
}
/**
 * 生成snippet文件
 * @param {*} command
 */
function writeSnippetFile(command, scope, content) {
  const outputPath = getPath(`../snippets/${command}.code-snippets`);

  const snippet = {
    [command]: new SnippetItem({ command, scope, content }),
  };

  const str = JSON.stringify(snippet);

  return promisify(fs.writeFile)(outputPath, str).catch((err) => {
    console.error(err);
  });
}

/**
 * 获取 fullPath
 * @returns
 */
function getPathFilePath() {
  let [, , filePath = 'default.vue'] = process.argv; // npm run snippet [filePath]

  let url = `../src/${filePath}`;
  url = url.replaceAll('//', '/');

  const fullPath = getPath(url);
  //   const stat = fs.statSync(fullPath)
  //   if (!stat.isFile()) {
  //     throw new Error('filePath 不是一个文件')
  //   }
  console.log('fullPath', fullPath);
  return fullPath;
}

const fullPath = getPathFilePath();

// main
(async () => {
  clear();
  spinner.start();

  const info = await figlet('CCBSCF SNIPPET');
  log(info);

  const content = await readSnipetContent(fullPath);

  spinner.succeed(`snippet content ok`);
  spinner.start(`snippet write start`);

  const parseUrl = path.parse(fullPath);
  const ext = parseUrl.ext.slice(1);
  const scope = {
    js: 'javascript',
    vue: 'vue',
  };

  const command = process.argv[3] || parseUrl.name;

  await writeSnippetFile(command, scope[ext], content);

  spinner.succeed(`snippet write ok`);
})();
