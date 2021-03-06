/*
  gulpProject工程化功能入口模块
 */

const path = require('path');
const copy = require('copy');
// 样式
const chalk = require('chalk');

const suceessTip = function(msg) {
  console.log(chalk.green('*') + ' ' + msg);
};

// 创建配置文件
const createFile = require('./commonUtils/createFile.js');

const createDefaultConfig = function(isSimplify, projectName) {
  if (isSimplify) { // 在当前项目中创建简化配置文件
    createFile(path.resolve(__dirname, '../initData/config/simplify-config.js'),
      path.resolve(process.cwd(), 'config/simplify-config.js'), projectName);
  } else { // 创建完整版项目配置文件
    createFile(path.resolve(__dirname, '../initData/config/gulp-config.js'),
      path.resolve(process.cwd(), 'gulp-config.js'), projectName);
    /* 注：server-test-config.js配置数据合并到gulp-config.js中
    createFile(path.resolve(__dirname, '../initData/config/server-test-config.js'),
      path.resolve(process.cwd(), 'server-test-config.js'), projectName);
    */
  }

  // 创建package.json
  createFile(path.resolve(__dirname, '../initData/package.json'),
    path.resolve(process.cwd(), 'package.json'), projectName);

  // 创建项目本地执行脚本(build脚本)
  copy(path.resolve(__dirname, '../initData/build/*'), path.resolve(process.cwd(), './build/'), function(){
    suceessTip('项目本地执行脚本文件创建成功');
  });

  // 创建gitignore配置文件
  createFile(path.resolve(__dirname, '../initData/git/gitignore.text'),
    path.resolve(process.cwd(), './.gitignore'), null);
};

module.exports = createDefaultConfig;
