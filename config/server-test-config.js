/* 线上测试服务器配置
 * 【备注】
 * host：主机IP地址；
 * user：登录账户
 * password：登录密码
 * remoteSubDirectory：项目准备部署的服务器项目二级目录
 */
// 引入全局功能模块
const path = require('path');
// 引入gulp配置文件
const gulpconfig = require('./gulp-config.js');
const getConfigObj = require('../build/commonUtils/getConfigObj.js');

/* 获取当前项目的构建配置文件 */
const currentServerConfig = getConfigObj(path.resolve(process.cwd(), 'config/server-test-config.js'));

var defaultConfig = {
  host: '49.235.6.237', // 腾讯云服务器ip
  user: 'root',
  password: '123456789',
  remoteSubDirectory: gulpconfig.base.testSubDirectory,
  port: '21'
};

// 整合currentServerConfig配置数据
const paramConfig = Object.assign({}, defaultConfig, currentServerConfig);

module.exports = paramConfig;
