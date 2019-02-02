// 引入gulp配置文件
const config = require('../../config/gulp-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins();

module.exports = function () {
  // 打开默认浏览器自动运行首页
  return gulp.src(config.base.dist + config.base.indexHtml)
    .pipe(plugins.open()); // 默认路径打开
};
