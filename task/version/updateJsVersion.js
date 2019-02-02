// 引入gulp配置文件
const config = require('../../config/gulp-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins();

module.exports = function () {
  return gulp.src(['rev/**/*.json', config.distFileDir('script'), '!' + config.distFileDir('scriptLib')], {base: config.base.dist})
    .pipe(plugins.revCollector())
    .pipe(gulp.dest(config.base.dist));
};
