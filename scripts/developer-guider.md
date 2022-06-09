## package 开发手册

- 全局安装 vscode 构建工具：`npm i vsce -g`

### 快速创建一个 snippet

- `npm run snippet <filePath> <commmand>`:
  - `filePath`: 默认值`default.vue`， 指定`src`目录下一个文件并转换成符合 `snippet` 规则的文件，并保存到`。/snippets`文件下创建`xxx.code-snippets`文件
  - `commmand`: 默认值为文件名`<fileName>`，指 `snippet` 指令，对应`prefix`属性
  - 修改`xxx.code-snippets`文件
  - 在`package.json`文件`snippets`对象中引入

### 自动导出 README.md 文档

- `npm run build:readme`:自动化脚本导出`README.md`文档

### 构建一个本地 snippet 插件

- `npm run build`: 构建一个`xxx.vsix`插件，可在扩展中本地安装测试插件

### 发布市场流程

- 登录`https://dev.azure.com/`创建一个`publisher`账户
- `vsce login <publisher name>`: 登录账户输入个人访问令牌
- `vsce publish`：发布当前插件