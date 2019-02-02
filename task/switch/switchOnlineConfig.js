// 引入gulp配置文件
const config = require('../../config/gulp-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins();

module.exports = function () {
  return gulp.src(config.base.dist + '/**', {base: config.base.dist})
    .pipe(plugins.replace('page-config', 'online-page-config'))
    .pipe(plugins.replace('page-list', 'page-list-online'))
    .pipe(gulp.dest(config.base.dist));
};
