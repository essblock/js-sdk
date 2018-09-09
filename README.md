
###Project introduction(项目介绍)
Ess-sdk development is based on stellar-sdk development, integrating stellar-sdk and stellar-base.

The JavaScript Ess SDK facilitates integration with the Ess Horizon API server and commits Ess transactions, both on Node.js and browsers. It has two main uses: querying horizons and buildings, signing and submitting transactions to Ess networks.

ess-sdk开发基于stellar-sdk开发，将stellar-sdk和stellar-base整合在一起。
JavaScript Ess SDK促进了与Ess Horizon API服务器的集成以及Ess事务的提交，无论是在Node.js上还是在浏览器上。它有两个主要用途：查询地平线和建筑物，签署和提交交易到Ess网络。

###Software architecture(软件架构)
The SRC directory is the source file of the project, and the modular way of ES6 is developed.

Node_modules is the required dependency of the project, and is downloaded through NPM install.

The dist directory is the SDK generated after the project is packaged and used by the web side. It exposes the EssSdk object for external use. The object contains methods and properties for querying the horizon and buildings, signing and submitting transactions to the Ess network.

The lib directory is the SDK tool used by the node after the project is packaged, exposing all objects that provide query horizons and buildings, sign and submit transactions to the Ess network.

Gulpfile.js is the process of packaging projects into nodesdk.

Webpack.config.js is the process of packing project items into browser SDK (not compressed).

Webpack.config.min.js is the process of packing project items into browser SDK (compression).

src目录是项目的源文件，es6的模块化方式进行开发
node_modules是项目的所需的依赖，通过npm install 下载
dist目录是项目打包后生成的sdk，供web端使用，暴露出EssSdk对象给外部使用，对象中包含查询地平线和建筑物，签署和提交交易到Ess网络的方法和属性。
lib目录是项目打包后供node使用的sdk工具，暴露出提供查询地平线和建筑物，签署和提交交易到Ess网络的所有对象。
gulpfile.js是项目打包成nodesdk的过程
webpack.config.js是项目项目打包成浏览器sdk的过程（未压缩）
webpack.config.min.js是项目项目打包成浏览器sdk的过程（压缩）

###Instructions(使用说明)
Download webpack gulp globally
Run npm install to download dependency in projects
Run npm run build in the project to package node version SDK, and the packaged files are in lib folder.
Running npm run browser packaged browser version SDK (uncompressed) in the project, the packaged file is in the dist folder, the file name is not ess-sdk.js, and the EssSdk object is exposed.
Running npm run browsermin packaged browser version SDK (compressed) in the project, the packaged file is in the dist folder, the file name is not ess-sdk.min.js, and the EssSdk object is exposed.

全局安装node

全局下载 webpack gulp

在项目中运行npm install 下载依赖

在项目中运行npm run node 打包node版本sdk，打包后的文件在lib文件夹
在项目中运行npm run browser 打包浏览器版本sdk（未压缩），打包后的文件在dist文件夹，文件名未ess-sdk.js,暴露出EssSdk对象。
在项目中运行npm run browsermin 打包浏览器版本sdk（已压缩），打包后的文件在dist文件夹，文件名未ess-sdk.min.js,暴露出EssSdk对象。
在项目中运行npm run build 打包出所有文件。
