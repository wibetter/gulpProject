/* 线上测试服务器配置
 * 【备注】
 * host：主机IP地址；
 * user：登录账户
 * password：登录密码
 * remoteSubDirectory：项目准备部署的服务器项目二级目录
 */
const config = require('./gulp-config.js');

module.exports = {
  host:     '10.41.41.73', // 默认 '10.210.227.108'
  user:     'sinas',
  password: 'sinasports',
  remoteSubDirectory: config.base.testSubDirectory,
};
