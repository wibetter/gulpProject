// 引入gulp配置文件
const config = require('../../config/gulp-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins();

module.exports = function () {
  return gulp.src(config.base.dist + config.base.indexHtml)
    .pipe(plugins.open({uri: 'http:' + config.online.distPath + config.base.indexHtml}));
};
