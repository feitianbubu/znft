## 启动pc相关
1. 安装依赖
```shell
yarn install
```
2. build @lib组件库
```shell
cd packages/lib
./windows.auto.sh
```
3. 启动静态服务器 提供abi.json
```shell
yarn run static:start
```
4. 启动pc服务
```shell
yarn run pc:start
```

## 一键删除依赖
```shell
yarn run clean:deps
```

## commit 规范
* feat: 新功能（feature）
* fix: 修补bug
* docs: 文档（documentation）
* style: 格式（不影响代码运行的变动）
* refactor: 重构（即不是新增功能，也不是修改bug的代码变动）
* perf: 更改代码以提高性能
* test: 添加测试
* chore: 构建过程或辅助工具的变动*/
