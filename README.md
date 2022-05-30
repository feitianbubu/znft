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

