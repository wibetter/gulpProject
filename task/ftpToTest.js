// 引入gulp配置文件
const config = require('../config/gulp-config.js'),
  testServer = require('../config/server-test-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins');
const plugins = gulpLoadPlugins(),
  gutil = plugins.util,
ftp = require('vinyl-ftp'); // 资源文件上传

module.exports = function () {
  if (!testServer.host || testServer.host == 'yourServerHost') {
    console.log('提醒：请配置ftp，host不能为空。');
  } else if (!testServer.user || testServer.user == 'yourServerAccount') {
    console.log('提醒：请配置ftp，user账号不能为空。');
  } else if (!testServer.password || testServer.password == 'yourServerPassword') {
    console.log('提醒：请配置ftp，password不能为空。');
  } else {
    var conn = ftp.create({
      host: testServer.host,
      user: testServer.user,
      password: testServer.password,
      parallel: 10,
      log: gutil.log
    });
    // 将编译完成的代码上传到开发服务器上
    return gulp.src( config.base.dist + '/**', { base: config.base.dist, buffer: false } )
      .pipe( conn.dest( testServer.remoteSubDirectory ) );
  }
};
