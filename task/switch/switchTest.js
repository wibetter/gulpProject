// 引入gulp配置文件
const config = require('../../config/gulp-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins();

module.exports = function () {
  return gulp.src(config.base.dist + '/**', {base: config.base.dist})
    .pipe(plugins.replace(config.test.srcPath, config.test.distPath))
    .pipe(gulp.dest(config.base.dist));
};
