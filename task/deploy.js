// 引入gulp配置文件
const config = require('../config/gulp-config.js');

const path = require('path');

// 引入自动部署功能
// const autoDeploy = require('@ssfe/stand-in-cli');

module.exports = function() {

  const localDir = path.resolve(process.cwd(), 'dist');
  const remoteDir = config.base.onlineSubDirectory.substring(1);

  /*
  autoDeploy({
    'local': localDir,
    'remote': remoteDir, // 远程地址文件夹
    'msg': config.deploy.msg || '发布sportSystem', // 部署信息
    'mail':  config.deploy.mail || 'liudan6@staff.sina.com.cn', // 邮箱地址，用于接收部署结果
    'replace':  config.deploy.replace || true,
    'host':  config.deploy.host || '10.41.41.73', // 默认 '10.210.227.108'
    'no-cache':  config.deploy['no-cache'] || true,
    'maxCount':  config.deploy.maxCount || 300, // 一次上传最大文件数
    'silent':  config.deploy.silent || true, // 使用安静模式：使用了危险选项时不会有提示问题，
  });
  */

};
