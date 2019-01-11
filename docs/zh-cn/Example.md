# 样例工程

## iOS

从命令行，进入`example`目录，然后安装依赖库和生成`main.jsbundle`。

```shell
cd example
yarn
npm run bundle:ios
npm start
```

最后启动了服务。然后安装Pod库：

```shell
cd ios
pod install --repo-update
```

用Xcode打开`Example.xcworkspace`，选择不同的`Target`，运行不同的样例工程。