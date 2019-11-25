/*
  inspect：用于生成当前gulpProject的配置文件，以便用户检查当前配置是否正确
 */

const fs = require('fs');
const path = require('path');
const formatJson = require('./commonUtils/formatJson.js');

// 引入gulp配置文件
const config = require('../config/gulp-config.js');
const ftpConfig = require('../config/server-test-config.js');

// 样式
const chalk = require('chalk');
const suceessTip = function(msg) {
  console.log(chalk.green('*') + ' ' + msg);
};

// 根据当前配置文件内容创建指定名称的文件
const createConfigJs = function (fileCont, fileName) {
  let filePath = path.resolve(process.cwd(), fileName);

  fs.writeFile(filePath, formatJson(JSON.stringify(fileCont)), (err) => {
    if (err) {
      throw Error(err);
    }
    suceessTip('当前配置文件已生成：'+ filePath);
  });
};

const showCurrentConfig = function () {
  // 先生成当前gulp-config.js配置文件
  createConfigJs(config, 'current-gulp-config.js');

  if (!config.ftpConfig) {
    createConfigJs(ftpConfig, 'current-ftp-config.js');
  }
};

module.exports = showCurrentConfig;
