// 引入gulp配置文件
const config = require('../../config/gulp-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins();

module.exports = function () {
  return gulp.src(['rev/scripts/*.json', config.distFileDir('requireConfig')], {base: config.base.dist})
    .pipe(plugins.revCollector())
    .pipe(gulp.dest(config.base.dist));
};
